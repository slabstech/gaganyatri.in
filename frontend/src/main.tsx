import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from './ErrorBoundary.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './components/theme/shared-theme/AppTheme';
import AppNavbar from './components/theme/dashboard/components/AppNavbar';
import Header from './components/theme/dashboard/components/Header';
import MainGrid from './components/theme/dashboard/components/MainGrid';
import LLMTechDemoApp from './components/theme/dashboard/components/LLMTechDemoApp';
import TaxTechDemoApp from './components/theme/dashboard/components/TaxTechDemoApp';
import MetricsApp from './components/theme/dashboard/components/MetricsApp';
import SideMenu from './components/theme/dashboard/components/SideMenu';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Provider } from 'react-redux';
import { store } from './reducers/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/theme/sign-in/SignIn';
import SignUp from './components/theme/sign-up/SignUp';
import Checkout from './components/theme/checkout/Checkout';
import Blog from './components/theme/blog/Blog';
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
                    <Route path="/taxtechdemo" element={<TaxTechDemoApp />} />
                    <Route path="/llmtechdemo" element={<LLMTechDemoApp />} />
                    <Route path="/metricsdemo" element={<MetricsApp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/blog" element={<Blog />} />
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