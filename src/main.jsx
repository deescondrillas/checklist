// v1.0.1 | 2026-06-26 | Franco De Escondrillas

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import './styles/index.css'
import './styles/theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>)
