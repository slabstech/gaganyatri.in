import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from './ErrorBoundary.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './components/theme/shared-theme/AppTheme';
import AppNavbar from './components/theme/dashboard/components/AppNavbar';
import Header from './components/theme/dashboard/components/Header';
import MainGrid from './components/theme/dashboard/components/MainGrid';
import SideMenu from './components/theme/dashboard/components/SideMenu';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Provider } from 'react-redux';
import { store } from './reducers/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightBlue, deepOrange } from '@mui/material/colors';
import App from './App.tsx';
import SignIn from './components/theme/sign-in/SignIn';
import SignUp from './components/theme/sign-up/SignUp';
import Checkout from './components/theme/checkout/Checkout';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './components/theme/dashboard/theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const theme = createTheme({
  palette: {
    primary: lightBlue,
    secondary: deepOrange,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            overflow: 'auto'
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            
            <Provider store={store}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
        <MainGrid />
        
        <SignIn/>
        <Checkout/>
          </Stack>
        </Box>
      </Box>
    </AppTheme>

    </ErrorBoundary>
  </StrictMode>,
);
