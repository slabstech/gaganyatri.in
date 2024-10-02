import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Root from "./reducers/Root.tsx"; 
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root>
      <App />
    </Root>
    <ToastContainer hideProgressBar={true} newestOnTop={true} />
  </StrictMode>,
)
