import { Component } from 'react';
import { Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SpeechDemo from './speech/SpeechDemo';
import MyChatBot from './chatbot/chatApp';
import OntogptDemo from './demos/ontogpt/OntogptDemo';

interface AppState {}

type HomeProps = {
  serverUrl: string;
};

class Home extends Component<HomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  constructor(props: HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={2} columns={12}>
        
        <Grid size={{ xs: 12 }}>
            <OntogptDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
        <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
          <div style={{ display: 'none' }}>
          <Grid size={{ xs: 12 }}>
            <SpeechDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <MyChatBot serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
          </div>
        </Grid>
      </Box>
    );
  }
}

export default Home;