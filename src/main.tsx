import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import styles from './index.css?inline'

const root = document.createElement('cooky-translator')
const shadowRoot = root.attachShadow({ mode: 'open' })
document.body.appendChild(root)
ReactDOM.createRoot(shadowRoot).render(
  <React.StrictMode>
    <style type="text/css">{styles.toString()}</style>
    <App />
  </React.StrictMode>,
)
