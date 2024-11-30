import { Component } from 'react';
import { Container, Grid, Typography, Divider } from '@mui/material';
import VisionDemo from './vision/VisionDemo';
import TextDemo from './text_llm/TextDemo';
import TranslateDemo from './translate/TranslateDemo';
import SpeechDemo from './speech/SpeechDemo';
import MyChatBot from './chatbot/chatApp';
import IndicDemo from './indic_llm/IndicDemo';
import TaxTechDemo from './demos/taxtech/TaxDemo';
import TaxTechTaxDataDemo from './demos/taxtech/TaxDemoTaxData';
interface AppState {
}

type HomeProps = {
  serverUrl: string;
};

class Home extends Component<HomeProps, AppState> {

  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  constructor(props:HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          LLM Use Cases
        </Typography>
        <Grid container spacing={2}>
          <TaxTechDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline}/>
        </Grid>
        <Grid item xs={12}>
            <Divider />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <VisionDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <IndicDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <SpeechDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <MyChatBot serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TranslateDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Home;
