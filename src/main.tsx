
import React from 'react'
import ReactDOM from 'react-dom/client'
import { SimpleAuthProvider } from '@/hooks/useSimpleAuth'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SimpleAuthProvider>
      <App />
    </SimpleAuthProvider>
  </React.StrictMode>
);
