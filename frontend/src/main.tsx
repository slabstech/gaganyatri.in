import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from './ErrorBoundary.tsx';
import { BrowserRouter } from 'react-router-dom';
//import { ToastContainer } from "react-toastify";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,  
)
