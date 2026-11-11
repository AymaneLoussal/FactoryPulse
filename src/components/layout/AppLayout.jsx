import Navigation from './Navigation.jsx'

export default function AppLayout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="app-header">
        <div className="container header-content">
          <div>
            <h1 className="brand">FactoryPulse</h1>
            <p className="brand-caption">Supervision industrielle</p>
          </div>
          <Navigation />
        </div>
      </header>
      <main id="main-content" className="container page-stack" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
