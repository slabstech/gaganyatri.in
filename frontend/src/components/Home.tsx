import { Component } from 'react';
import { Container, Grid, Typography, Divider } from '@mui/material';
import VisionDemo from './vision/VisionDemo';
import TextDemo from './text_llm/TextDemo';

interface AppState {
}

class Home extends Component<{}, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = "https://gaganyatri-django-spaces.hf.space/api/v1";

  constructor(props:{}) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          LLM Use Cases
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <VisionDemo />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextDemo />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Home;
