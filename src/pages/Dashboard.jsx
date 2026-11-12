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
      {loading || error ? (
        <MachineDataState machines={machines} loading={loading} error={error} />
      ) : (
        <div className="stats-grid">
          <Panel><p>Total des machines</p><strong className="stat-value">{machines.length}</strong></Panel>
          <Panel><p>En fonctionnement</p><strong className="stat-value">{machines.filter(machine => machine.status === 'En fonctionnement').length}</strong></Panel>
          <Panel><p>En panne</p><strong className="stat-value">{machines.filter(machine => machine.status === 'En panne').length}</strong></Panel>
        </div>
      )}
      <Link className="text-link" to="/machines">Voir les machines →</Link>
    </section>
  )
}
