import { Component } from 'react';
import { Container, Grid, Typography, Divider } from '@mui/material';
import VisionDemo from './vision/VisionDemo';
import TextDemo from './text_llm/TextDemo';
import TranslateDemo from './translate/TranslateDemo';
import SpeechDemo from './speech/SpeechDemo';

interface AppState {
}


type HomeProps = {
  url: string;
};


class Home extends Component<HomeProps, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = import.meta.env.VITE_HF_SPACES_URL;

  constructor(props:HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.url;
  }

  render() {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          LLM Use Cases
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SpeechDemo url={this.serverBaseUrl} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <VisionDemo url={this.serverBaseUrl} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TranslateDemo url={this.serverBaseUrl}/>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextDemo url={this.serverBaseUrl}/>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Home;
