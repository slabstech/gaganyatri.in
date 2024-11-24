import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from './ErrorBoundary.tsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightBlue, deepOrange } from '@mui/material/colors';
import { Provider } from 'react-redux';
import { store } from './reducers/store';
import { BrowserRouter } from 'react-router-dom';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: lightBlue,
    secondary: deepOrange,
  },
});
/*
const initialState = {

  // Add more state properties as needed
};
<Root initialState={initialState}>
*/
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>

         <Provider store={store}>
          <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
          </BrowserRouter>
          </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
