import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import LLMTechHome from '../../../LLMTechHome';
import HackathonDemos from '../../../HackathonDemos';


const serverUrl  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;

export default function LLMTechDemoApp() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12}>
        <LLMTechHome serverUrl={serverUrl}  />
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Hackathon Outcomes
      </Typography>
      <Grid container spacing={2} columns={12}>
          <HackathonDemos serverUrl={serverUrl} />
      </Grid>
    </Box>
  );
}
