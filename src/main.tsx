
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remover React.StrictMode para evitar renderizações duplas em desenvolvimento
ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);
