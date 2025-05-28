
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ImprovedToaster } from './components/ui/improved-toaster'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <ImprovedToaster />
  </React.StrictMode>
);
