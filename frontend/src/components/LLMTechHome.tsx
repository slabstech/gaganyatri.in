import { Component } from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import VisionDemo from './vision/VisionDemo';
import TextDemo from './text_llm/TextDemo';
import TranslateDemo from './translate/TranslateDemo';
import IndicDemo from './indic_llm/IndicDemo';

interface AppState {}

type LLMTechHomeProps = {
  serverUrl: string;
};

class LLMTechHome extends Component<LLMTechHomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  constructor(props: LLMTechHomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
          LLM Use Cases
        </Typography>
        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12 }}>
            <VisionDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <IndicDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TranslateDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default LLMTechHome;