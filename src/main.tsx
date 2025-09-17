import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProviders } from './providers/AppProviders.tsx'
import { seedDatabase } from './api/seeding.ts'

async function enableMocking() {
  const { worker } = await import('./api/browser')
  await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } })
  await seedDatabase();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>,
  )
})
