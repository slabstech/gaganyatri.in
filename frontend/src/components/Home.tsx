import { Component } from 'react';
import { Container, Grid, Typography, Divider } from '@mui/material';
import VisionDemo from './vision/VisionDemo';
import TextDemo from './text_llm/TextDemo';
import TranslateDemo from './translate/TranslateDemo';
import SpeechDemo from './speech/SpeechDemo';
import MyChatBot from './chatbot/chatApp';
import IndicDemo from './indic_llm/IndicDemo';
import TaxTechDemo from './demos/taxtech/TaxDemo';
import TaxApp from './demos/taxtech/TaxApp';
interface AppState {
}

type HomeProps = {
  serverUrl: string;
  isOnline: boolean;
};

class Home extends Component<HomeProps, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_HF_SPACES_URL;
  isOnline = true;

  constructor(props:HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
    this.isOnline = this.props.isOnline;
  }

  render() {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Tax Sphere
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
     
          </Grid>
          <TaxApp></TaxApp>
          <Grid item xs={12}>
        </Grid>
        </Grid>
        <div  style={{ display: 'none' }} >
        <Typography variant="h4" gutterBottom>
          LLM Use Cases
        </Typography>
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
        </div>
      </Container>
    );
  }
}

export default Home;
