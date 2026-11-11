import { Link, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import PageHeading from './components/ui/PageHeading.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Machines from './pages/Machines.jsx'
import AddMachine from './pages/AddMachine.jsx'

export default function App() {
  // App stays mounted above Routes: FC-8 will own shared machine state here.
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/machines/new" element={<AddMachine />} />
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
