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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './components/theme/dashboard/theme/customizations';
import ISSApp from './components/theme/dashboard/components/ISSApp.tsx';
import AX4App from './components/theme/dashboard/components/AX4App.tsx';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
              <SideMenu />
              <AppNavbar />
              <Box
                component="main"
                sx={(theme) => ({
                  flexGrow: 1,
                  backgroundColor: theme.palette.background.default,
                  overflow: 'auto',
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
                  <Routes>
                    <Route path="/" element={<MainGrid />} />
                    <Route path="/iss" element={<ISSApp />} />
                    <Route path="/ax4" element={<AX4App />} />
                    
                  </Routes>
                </Stack>
              </Box>
            </Box>
          </AppTheme>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);