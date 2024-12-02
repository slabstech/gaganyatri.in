import { Component } from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import VisionDemo from './vision/VisionDemo';
import TextDemo from './text_llm/TextDemo';
import TranslateDemo from './translate/TranslateDemo';
import SpeechDemo from './speech/SpeechDemo';
import MyChatBot from './chatbot/chatApp';
import IndicDemo from './indic_llm/IndicDemo';
import TaxTechDemo from './demos/taxtech/TaxDemo';
import TaxTechTaxDataDemo from './demos/taxtech/TaxDemoTaxData';

interface AppState {}

type TaxHomeProps = {
  serverUrl: string;
};

class TaxHome extends Component<TaxHomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  constructor(props: TaxHomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12 }}>
            <TaxTechDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TaxTechTaxDataDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default TaxHome;