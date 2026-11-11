import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'
import MachineDataState from '../components/ui/MachineDataState.jsx'

export default function Machines({ machines, loading, error }) {
  return (
    <section aria-labelledby="machines-title">
      <PageHeading
        id="machines-title"
        title="Parc de machines"
        description="Retrouvez les informations de vos machines."
      />
      <MachineDataState machines={machines} loading={loading} error={error}>
        <Panel>
          <p>L’espace de consultation des machines sera disponible ici.</p>
        </Panel>
      </MachineDataState>
      <Link className="text-link" to="/machines/new">+ Ajouter une machine</Link>
    </section>
  )
}
