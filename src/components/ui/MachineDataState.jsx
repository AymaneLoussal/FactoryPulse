export default function MachineDataState({ machines, loading, error, children }) {
  if (loading) return <p role="status">Chargement des machines…</p>
  if (error) return <p className="data-error" role="alert">{error}</p>
  if (machines.length === 0) return <p role="status">Aucune machine dans le parc.</p>
  return children
}
