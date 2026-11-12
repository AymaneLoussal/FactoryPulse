import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import MachineDataState from '../components/ui/MachineDataState.jsx'

const statuses = ['En fonctionnement', "À l'arrêt", 'En panne']

export default function AddMachine({ machines, loading, error, onAddMachine }) {
  const navigate = useNavigate()
  const submitted = useRef(false)
  const [form, setForm] = useState({ name: '', zone: '', status: statuses[0], dailyProduction: '' })
  const [errors, setErrors] = useState({})
  function change(event) {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
    const valid = name === 'name' || name === 'zone' ? !!value.trim()
      : name === 'status' ? statuses.includes(value)
        : /^\d+$/.test(value) && Number.isSafeInteger(Number(value))
    if (valid) setErrors(previous => ({ ...previous, [name]: '' }))
  }
  function submit(event) {
    event.preventDefault()
    if (submitted.current || loading || error) return
    const next = {}
    if (!form.name.trim()) next.name = 'Le nom est obligatoire.'
    if (!form.zone.trim()) next.zone = 'La zone est obligatoire.'
    if (!statuses.includes(form.status)) next.status = 'Choisissez un statut valide.'
    if (!/^\d+$/.test(form.dailyProduction) || !Number.isSafeInteger(Number(form.dailyProduction))) next.dailyProduction = 'Saisissez un entier supérieur ou égal à zéro.'
    setErrors(next)
    if (Object.keys(next).length) return
    let id
    let number = 1
    do { id = `M-${String(number++).padStart(3, '0')}` } while (machines.some(machine => machine.id === id))
    submitted.current = true
    onAddMachine({ id, name: form.name.trim(), zone: form.zone.trim(), status: form.status, dailyProduction: Number(form.dailyProduction) })
    navigate('/machines', { state: { message: 'Machine ajoutée.' } })
  }
  return (
    <section aria-labelledby="add-machine-title">
      <PageHeading id="add-machine-title" title="Ajouter une machine" description="Renseignez les informations requises." />
      {loading || error ? <MachineDataState machines={machines} loading={loading} error={error} /> : (
        <form className="machine-form panel" onSubmit={submit} noValidate>
          <label htmlFor="machine-name">Nom *</label>
          <input id="machine-name" name="name" value={form.name} onChange={change} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'error-name' : undefined} />
          {errors.name && <p id="error-name" className="data-error">{errors.name}</p>}
          <label htmlFor="machine-zone">Zone de production *</label>
          <input id="machine-zone" name="zone" value={form.zone} onChange={change} aria-invalid={!!errors.zone} aria-describedby={errors.zone ? 'error-zone' : undefined} />
          {errors.zone && <p id="error-zone" className="data-error">{errors.zone}</p>}
          <label htmlFor="machine-status">Statut *</label>
          <select id="machine-status" name="status" value={form.status} onChange={change} aria-invalid={!!errors.status} aria-describedby={errors.status ? 'error-status' : undefined}>{statuses.map(status => <option key={status}>{status}</option>)}</select>
          {errors.status && <p id="error-status" className="data-error">{errors.status}</p>}
          <label htmlFor="machine-production">Production journalière *</label>
          <input id="machine-production" name="dailyProduction" type="number" min="0" step="1" value={form.dailyProduction} onChange={change} aria-invalid={!!errors.dailyProduction} aria-describedby={errors.dailyProduction ? 'error-production' : undefined} />
          {errors.dailyProduction && <p id="error-production" className="data-error">{errors.dailyProduction}</p>}
          <button type="submit">Ajouter la machine</button>
        </form>
      )}
      <Link className="text-link" to="/machines">← Retour aux machines</Link>
    </section>
  )
}
