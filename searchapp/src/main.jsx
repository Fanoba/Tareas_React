import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Focus } from './components/Focus.jsx'
import { ExpertApp } from './components/ExpertApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpertApp></ExpertApp>
  </StrictMode>,
)
