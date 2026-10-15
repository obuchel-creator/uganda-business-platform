import { useEffect, useState } from 'react'

type HealthResponse = {
  status: string
  service: string
}

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Health check failed')
        return response.json() as Promise<HealthResponse>
      })
      .then((health) => setApiStatus(health.status === 'ok' ? 'online' : 'offline'))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setApiStatus('offline')
      })

    return () => controller.abort()
  }, [])

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Uganda Business Platform home">
          <span className="brand-mark" aria-hidden="true">U</span>
          <span>UBP</span>
        </a>
        <span className="topbar-label">Platform setup</span>
      </header>

      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="eyebrow"><span className="eyebrow-dot" /> FOUNDATION</div>
        <h1 id="welcome-title">Uganda Business Platform</h1>
        <p className="intro">Your workspace is set up. The frontend and API are ready for the next product features.</p>

        <div className="status-panel" aria-live="polite">
          <div className={`status-icon status-${apiStatus}`} aria-hidden="true">
            {apiStatus === 'online' ? '✓' : apiStatus === 'offline' ? '!' : '·'}
          </div>
          <div className="status-copy">
            <strong>Backend API</strong>
            <span>
              {apiStatus === 'online' && 'Connected and responding'}
              {apiStatus === 'checking' && 'Checking connection…'}
              {apiStatus === 'offline' && 'Not responding. Start the backend to connect.'}
            </span>
          </div>
          <span className={`status-badge badge-${apiStatus}`}>
            {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking'}
          </span>
        </div>

        <p className="next-step">Next step <span>Define the first business workflow and build it here.</span></p>
      </section>

      <footer className="page-footer">
        <span>BUILT FOR BUSINESS IN UGANDA</span>
        <span>Frontend · API</span>
      </footer>
    </main>
  )
}

export default App
