import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store.tsx';
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from './ErrorBoundary.tsx';
import { BrowserRouter } from 'react-router-dom';
//import { ToastContainer } from "react-toastify";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,  
)
