import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import PageHeading from './components/ui/PageHeading.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Machines from './pages/Machines.jsx'
import AddMachine from './pages/AddMachine.jsx'

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

  // The same array is passed to every page; navigation never remounts App.
  const machineData = { machines, loading, error }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard {...machineData} />} />
        <Route path="/machines" element={<Machines {...machineData} />} />
        <Route path="/machines/new" element={<AddMachine {...machineData} />} />
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
