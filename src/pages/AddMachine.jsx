import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'
import MachineDataState from '../components/ui/MachineDataState.jsx'

export default function AddMachine({ machines, loading, error }) {
  return (
    <section aria-labelledby="add-machine-title">
      <PageHeading
        id="add-machine-title"
        title="Ajouter une machine"
        description="Un espace dédié aux nouvelles machines de votre parc."
      />
      <MachineDataState machines={machines} loading={loading} error={error}>
        <Panel>
          <p>Le formulaire d’ajout sera disponible ici.</p>
        </Panel>
      </MachineDataState>
      <Link className="text-link" to="/machines">← Retour aux machines</Link>
    </section>
  )
}
