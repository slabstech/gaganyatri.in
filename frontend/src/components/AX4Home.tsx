import { Component } from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AX4Demo from './demos/space/AX4Demo';

interface AppState {}

type AX4HomeProps = {
  serverUrl: string;
};

class AX4Home extends Component<AX4HomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  constructor(props: AX4HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12 }}>
            <AX4Demo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default AX4Home;