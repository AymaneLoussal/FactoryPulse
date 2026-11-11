import { NavLink } from 'react-router'

export default function Navigation() {
  return (
    <nav className="main-navigation" aria-label="Navigation principale">
      <NavLink to="/" end>Dashboard</NavLink>
      <NavLink to="/machines" end>Machines</NavLink>
      <NavLink to="/machines/new" end>Ajouter une machine</NavLink>
    </nav>
  )
}
