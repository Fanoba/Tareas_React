import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Card } from './components/Card.jsx'
import { SampleForm } from './components/SampleForm.jsx'
import { AppCounter } from './components/AppCounter.jsx'
import { CustomHook } from './components/CustomHook.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <CustomHook/>
  </>,
)
