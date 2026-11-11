import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'

export default function Dashboard() {
  return (
    <section aria-labelledby="dashboard-title">
      <PageHeading
        id="dashboard-title"
        title="Vue d’ensemble"
        description="Suivez l’état de votre parc industriel."
      />
      <Panel>
        <p>Les indicateurs du parc seront regroupés ici.</p>
      </Panel>
    </section>
  )
}
