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

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/theme/marketing-page/components/AppAppBar';
import Hero from './components/theme/marketing-page/components/Hero';
import LogoCollection from './components/theme/marketing-page/components/LogoCollection';
import Highlights from './components/theme/marketing-page/components/Highlights';
import Pricing from './components/theme/marketing-page/components/Pricing';
import Features from './components/theme/marketing-page/components/Features';
import Testimonials from './components/theme/marketing-page/components/Testimonials';
import FAQ from './components/theme/marketing-page/components/FAQ';
import Footer from './components/theme/marketing-page/components/Footer';
import AppTheme from './components/theme/shared-theme/AppTheme';
import AppNavbar from './components/theme/dashboard/components/AppNavbar';
import Header from './components/theme/dashboard/components/Header';
import MainGrid from './components/theme/dashboard/components/MainGrid';
import SideMenu from './components/theme/dashboard/components/SideMenu';

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

/*
const initialState = {

  // Add more state properties as needed
};
<Root initialState={initialState}>
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>

    <AppTheme themeComponents={xThemeComponents} >
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
      <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
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
            <MainGrid />
          </Stack>
        </Box>

      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
      </Box>
    </AppTheme>
    </ErrorBoundary>
  </StrictMode>,
);
