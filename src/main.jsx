import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import { SensorProvider } from './context/SensorContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SensorProvider>
      <App />
    </SensorProvider>
  </React.StrictMode>,
)
