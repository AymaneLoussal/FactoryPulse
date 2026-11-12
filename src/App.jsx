import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import PageHeading from './components/ui/PageHeading.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Machines from './pages/Machines.jsx'
import AddMachine from './pages/AddMachine.jsx'

const permittedStatuses = ['En fonctionnement', "À l'arrêt", 'En panne']

export default function App() {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadMachines() {
      try {
        const response = await fetch('/machines.json', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Impossible de charger les machines (HTTP ${response.status}).`)
        }

        const data = await response.json().catch(() => {
          throw new Error('Le fichier machines.json ne contient pas un JSON valide.')
        })
        if (!Array.isArray(data)) {
          throw new Error('Le fichier machines.json doit contenir un tableau de machines.')
        }

        if (active) setMachines(data)
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof TypeError
            ? 'Impossible de charger les machines. Vérifiez la connexion et le fichier machines.json.'
            : loadError.message)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMachines()
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  function addMachine(machine) {
    if (loading || error || !machine ||
      !['id', 'name', 'zone'].every(field => typeof machine[field] === 'string' && machine[field].trim()) ||
      !permittedStatuses.includes(machine.status) ||
      !Number.isInteger(machine.dailyProduction) || machine.dailyProduction < 0) return

    // Snapshot the flat record before scheduling: callers cannot mutate it later.
    const candidate = {
      id: machine.id,
      name: machine.name,
      zone: machine.zone,
      status: machine.status,
      dailyProduction: machine.dailyProduction,
    }
    setMachines(previous => previous.some(item => item.id === candidate.id)
      ? previous
      : [...previous, candidate])
  }

  function updateMachineStatus(id, status) {
    if (loading || error || !permittedStatuses.includes(status)) return
    setMachines(previous => {
      if (!previous.some(machine => machine.id === id && machine.status !== status)) return previous
      return previous.map(machine => machine.id === id ? { ...machine, status } : machine)
    })
  }

  function deleteMachine(id) {
    if (loading || error) return
    setMachines(previous => previous.some(machine => machine.id === id)
      ? previous.filter(machine => machine.id !== id)
      : previous)
  }

  const machineData = { machines, loading, error }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard {...machineData} />} />
        <Route path="/machines" element={<Machines {...machineData} onUpdateMachineStatus={updateMachineStatus} onDeleteMachine={deleteMachine} />} />
        <Route path="/machines/new" element={<AddMachine {...machineData} onAddMachine={addMachine} />} />
        <Route path="*" element={
          <section aria-labelledby="not-found-title">
            <PageHeading id="not-found-title" title="Page introuvable" description="Cette page n’existe pas." />
            <Link className="text-link" to="/">Revenir au dashboard</Link>
          </section>
        } />
      </Routes>
    </AppLayout>
  )
}
