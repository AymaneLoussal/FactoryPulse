import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'

export default function AddMachine() {
  return (
    <section aria-labelledby="add-machine-title">
      <PageHeading
        id="add-machine-title"
        title="Ajouter une machine"
        description="Un espace dédié aux nouvelles machines de votre parc."
      />
      <Panel>
        <p>Le formulaire d’ajout sera disponible ici.</p>
      </Panel>
    </section>
  )
}
