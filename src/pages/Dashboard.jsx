import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'
import MachineDataState from '../components/ui/MachineDataState.jsx'

export default function Dashboard({ machines, loading, error }) {
  return (
    <section aria-labelledby="dashboard-title">
      <PageHeading
        id="dashboard-title"
        title="Vue d’ensemble"
        description="Suivez l’état de votre parc industriel."
      />
      <MachineDataState machines={machines} loading={loading} error={error}>
        <Panel>
          <p>Les indicateurs du parc seront regroupés ici.</p>
        </Panel>
      </MachineDataState>
      <Link className="text-link" to="/machines">Voir les machines →</Link>
    </section>
  )
}
