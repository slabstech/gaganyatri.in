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

    <AppTheme >
      <CssBaseline enableColorScheme />

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
    </AppTheme>
    </ErrorBoundary>
  </StrictMode>,
);
