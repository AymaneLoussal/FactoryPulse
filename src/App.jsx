import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Machines from './pages/Machines.jsx'
import AddMachine from './pages/AddMachine.jsx'

export default function App() {
  // FC-6: static page shells. FC-7 will display one page per route here.
  // FC-8 will own the shared machine state above those routed pages.
  return (
    <AppLayout>
      <Dashboard />
      <Machines />
      <AddMachine />
    </AppLayout>
  )
}
