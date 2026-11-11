import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'

export default function Machines() {
  return (
    <section aria-labelledby="machines-title">
      <PageHeading
        id="machines-title"
        title="Parc de machines"
        description="Retrouvez les informations de vos machines."
      />
      <Panel>
        <p>L’espace de consultation des machines sera disponible ici.</p>
      </Panel>
    </section>
  )
}
