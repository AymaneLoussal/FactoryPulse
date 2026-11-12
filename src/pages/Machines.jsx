import { Link, useLocation } from 'react-router'
import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Panel from '../components/ui/Panel.jsx'
import MachineDataState from '../components/ui/MachineDataState.jsx'

export default function Machines({ machines, loading, error, onUpdateMachineStatus, onDeleteMachine }) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tous')
  const reset = () => { setSearch(''); setStatus('Tous') }
  const visible = machines.filter(machine => machine.name.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')) && (status === 'Tous' || machine.status === status))
  return (
    <section aria-labelledby="machines-title">
      <PageHeading
        id="machines-title"
        title="Parc de machines"
        description="Retrouvez les informations de vos machines."
      />
      {location.state?.message && <p role="status">{location.state.message}</p>}
      <Link className="text-link" to="/machines/new">+ Ajouter une machine</Link>
      <MachineDataState machines={machines} loading={loading} error={error}>
        <div className="filters">
          <label htmlFor="search-machine">Rechercher par nom <input id="search-machine" type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
          <label htmlFor="filter-status">Statut <select id="filter-status" value={status} onChange={event => setStatus(event.target.value)}>
            <option>Tous</option><option>En fonctionnement</option><option>À l'arrêt</option><option>En panne</option>
          </select></label>
          <button type="button" onClick={reset}>Réinitialiser les filtres</button>
        </div>
        {visible.length === 0 ? <p role="status">Aucune machine ne correspond aux filtres. <button type="button" onClick={reset}>Réinitialiser les filtres</button></p> : (
          <div className="machine-grid">{visible.map(machine => <Panel key={machine.id}>
            <article aria-label={machine.name}><h3>{machine.name}</h3><p>Zone : {machine.zone}</p><p>Production : {machine.dailyProduction} unités / jour</p>
              <label htmlFor={`status-${machine.id}`}>Statut de {machine.name} <select id={`status-${machine.id}`} value={machine.status} onChange={event => onUpdateMachineStatus(machine.id, event.target.value)}>
                <option>En fonctionnement</option><option>À l'arrêt</option><option>En panne</option>
              </select></label>
              <button type="button" onClick={() => { if (window.confirm(`Supprimer ${machine.name} (${machine.id}) ?`)) onDeleteMachine(machine.id) }}>Supprimer {machine.name}</button>
            </article>
          </Panel>)}</div>
        )}
      </MachineDataState>
    </section>
  )
}
