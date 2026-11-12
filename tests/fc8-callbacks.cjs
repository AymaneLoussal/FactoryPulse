const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { chromium } = require('playwright')

const originalFile = fs.readFileSync('public/machines.json')
const official = JSON.parse(originalFile)
const sample = { id: 'TEST-ONLY-1', name: 'Callback test', zone: 'Test zone', status: 'En fonctionnement', dailyProduction: 0 }
let browser

before(async () => {
  const installedChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  const executablePath = process.env.FC8_CHROME_PATH || (fs.existsSync(installedChrome) ? installedChrome : undefined)
  browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-gpu'] })
})
after(async () => {
  await browser?.close()
  assert.deepEqual(fs.readFileSync('public/machines.json'), originalFile)
})

async function probe(page) {
  await page.addInitScript(() => {
    const find = (fiber, predicate) => {
      if (!fiber) return null
      if (predicate(fiber)) return fiber
      return find(fiber.child, predicate) || find(fiber.sibling, predicate)
    }
    window.probe = { actions: {}, commits: 0 }
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true, renderers: new Map(), inject() { return 1 }, onCommitFiberUnmount() {},
      onCommitFiberRoot(id, root) {
        const app = find(root.current, fiber => Array.isArray(fiber.memoizedState?.memoizedState) && fiber.memoizedState?.queue?.dispatch)
        if (!app) return
        const machines = app.memoizedState.memoizedState
        const page = find(app.child, fiber => typeof fiber.type === 'function' && Object.hasOwn(fiber.memoizedProps || {}, 'machines'))
        const props = page?.memoizedProps || {}
        for (const name of ['onAddMachine', 'onUpdateMachineStatus', 'onDeleteMachine']) {
          if (props[name]) window.probe.actions[name] = props[name]
        }
        Object.assign(window.probe, {
          machines, loading: app.memoizedState.next.memoizedState,
          shared: props.machines === machines, commits: window.probe.commits + 1,
        })
      },
    }
  })
}

async function nav(page, name) {
  await page.getByRole('navigation').getByRole('link', { name, exact: true }).click()
}

async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}

async function isolated(port, run) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await probe(page)
  try {
    await page.goto(`http://127.0.0.1:${port}/machines/new`)
    await page.waitForFunction(() => window.probe.loading === false && window.probe.machines.length === 8)
    await nav(page, 'Machines')
    await nav(page, 'Ajouter une machine')
    await page.evaluate(() => {
      window.original = window.probe.machines
      window.originalJSON = JSON.stringify(window.original)
      window.original.forEach(Object.freeze)
      Object.freeze(window.original)
    })
    await run(page)
    assert.equal(await page.evaluate(() => JSON.stringify(window.original) === window.originalJSON), true)
    assert.deepEqual(errors, [])
  } finally { await page.close() }
}

for (const port of (process.env.FC8_TEST_PORTS || '5173,4173').split(',').map(Number)) {
  test(`${port}: add snapshots caller input and preserves frozen source`, () => isolated(port, async page => {
    await page.evaluate(machine => {
      window.probe.actions.onAddMachine(machine)
      machine.name = 'Caller changed its own input after the call'
    }, sample)
    await page.waitForFunction(() => window.probe.machines.length === 9)
    assert.deepEqual(await page.evaluate(() => window.probe.machines.at(-1)), sample)
    assert.equal(await page.evaluate(() => window.probe.machines !== window.original && window.original.every((item, i) => item === window.probe.machines[i])), true)
  }))

  test(`${port}: queued adds preserve both changes and reject duplicate IDs`, () => isolated(port, async page => {
    await page.evaluate(machine => {
      const add = window.probe.actions.onAddMachine
      add({ ...machine, id: 'M-001' })
      add(machine)
      add(machine)
      add({ ...machine, id: 'TEST-ONLY-2', name: machine.name })
    }, sample)
    await page.waitForFunction(() => window.probe.machines.length === 10)
    const ids = await page.evaluate(() => window.probe.machines.map(machine => machine.id))
    assert.equal(new Set(ids).size, 10)
  }))

  test(`${port}: invalid additions are no-ops`, () => isolated(port, async page => {
    await page.evaluate(machine => {
      const invalid = [null, undefined, {}, { ...machine, id: '' }, { ...machine, id: '  ' },
        { ...machine, name: ' ' }, { ...machine, zone: null }, { ...machine, status: 'running' },
        ...[-1, 0.5, NaN, Infinity, '', '12', null, undefined].map(dailyProduction => ({ ...machine, dailyProduction }))]
      invalid.forEach(window.probe.actions.onAddMachine)
    }, sample)
    await settle(page)
    assert.equal(await page.evaluate(() => window.probe.machines === window.original), true)
  }))

  test(`${port}: status update copies only the ID target; queued changes compose`, () => isolated(port, async page => {
    await page.evaluate(() => {
      const update = window.probe.actions.onUpdateMachineStatus
      update('M-001', "À l'arrêt")
      update('M-002', 'En fonctionnement')
    })
    await page.waitForFunction(() => window.probe.machines[0].status === "À l'arrêt" && window.probe.machines[1].status === 'En fonctionnement')
    assert.equal(await page.evaluate(() => window.original[0] !== window.probe.machines[0] && window.original[1] !== window.probe.machines[1] && window.original.slice(2).every((item, i) => item === window.probe.machines[i + 2])), true)
    const expected = official.map(machine => machine.id === 'M-001' ? { ...machine, status: "À l'arrêt" } : machine.id === 'M-002' ? { ...machine, status: 'En fonctionnement' } : machine)
    assert.deepEqual(await page.evaluate(() => window.probe.machines), expected)
    await page.evaluate(() => window.probe.actions.onUpdateMachineStatus('M-001', 'En panne'))
    await page.waitForFunction(() => window.probe.machines[0].status === 'En panne')
  }))

  test(`${port}: unknown IDs, forbidden status and unchanged status preserve identity`, () => isolated(port, async page => {
    await page.evaluate(() => {
      window.probe.actions.onUpdateMachineStatus('missing', 'En panne')
      window.probe.actions.onUpdateMachineStatus('M-001', 'invalid')
      window.probe.actions.onUpdateMachineStatus('M-001', 'En fonctionnement')
      window.probe.actions.onDeleteMachine('missing')
    })
    await settle(page)
    assert.equal(await page.evaluate(() => window.probe.machines === window.original), true)
  }))

  test(`${port}: duplicate names are allowed; update/delete target only the ID`, () => isolated(port, async page => {
    await page.evaluate(machine => {
      window.probe.actions.onAddMachine(machine)
      window.probe.actions.onAddMachine({ ...machine, id: 'TEST-ONLY-2' })
    }, sample)
    await page.waitForFunction(() => window.probe.machines.length === 10)
    await page.evaluate(() => {
      window.probe.actions.onUpdateMachineStatus('TEST-ONLY-1', 'En panne')
      window.probe.actions.onDeleteMachine('TEST-ONLY-2')
    })
    await page.waitForFunction(() => window.probe.machines.length === 9 && window.probe.machines.at(-1).status === 'En panne')
    assert.equal(await page.evaluate(() => window.probe.machines.at(-1).id), 'TEST-ONLY-1')
  }))

  test(`${port}: queued deletes can remove the last machine without mutation`, () => isolated(port, async page => {
    await page.evaluate(() => window.original.forEach(machine => window.probe.actions.onDeleteMachine(machine.id)))
    await page.waitForFunction(() => window.probe.machines.length === 0)
    await nav(page, 'Machines')
    await page.getByText('Aucune machine dans le parc.', { exact: true }).waitFor()
    assert.equal(await page.evaluate(() => window.original.length), 8)
  }))

  test(`${port}: actual callbacks survive navigation and refresh restores official JSON`, () => isolated(port, async page => {
    let fetches = 0
    page.on('request', request => { if (new URL(request.url()).pathname === '/machines.json') fetches++ })
    await page.evaluate(machine => {
      window.probe.actions.onAddMachine(machine)
      window.probe.actions.onUpdateMachineStatus('M-001', 'En panne')
      window.probe.actions.onDeleteMachine('M-002')
    }, sample)
    await page.waitForFunction(() => window.probe.machines.some(machine => machine.id === 'TEST-ONLY-1') && !window.probe.machines.some(machine => machine.id === 'M-002'))
    await page.evaluate(() => { window.modified = window.probe.machines })
    for (const name of ['Machines', 'Dashboard', 'Ajouter une machine']) {
      await nav(page, name)
      assert.equal(await page.evaluate(() => window.probe.shared && window.probe.machines === window.modified), true)
    }
    assert.equal(fetches, 0)
    await page.reload()
    await page.waitForFunction(() => window.probe.loading === false && window.probe.machines[0]?.status === 'En fonctionnement')
    assert.deepEqual(await page.evaluate(() => window.probe.machines), official)
    assert.ok(fetches > 0)
  }))

  test(`${port}: callbacks do not change state while initial loading is pending`, async () => {
    const page = await browser.newPage()
    await probe(page)
    let release
    const pending = new Promise(resolve => { release = resolve })
    await page.route('**/machines.json', async route => {
      await pending
      await route.fulfill({ contentType: 'application/json', body: originalFile.toString('utf8') }).catch(() => {})
    })
    try {
      await page.goto(`http://127.0.0.1:${port}/machines/new`, { waitUntil: 'domcontentloaded' })
      await page.getByText('Chargement des machines…', { exact: true }).waitFor()
      await page.evaluate(machine => window.probe.actions.onAddMachine(machine), sample)
      await nav(page, 'Machines')
      await page.evaluate(() => {
        window.probe.actions.onUpdateMachineStatus('M-001', 'En panne')
        window.probe.actions.onDeleteMachine('M-001')
      })
      assert.equal(await page.evaluate(() => window.probe.machines.length), 0)
      release()
      await page.waitForFunction(() => window.probe.loading === false && window.probe.machines.length === 8)
      assert.deepEqual(await page.evaluate(() => window.probe.machines), official)
    } finally { release(); await page.close() }
  })
}
