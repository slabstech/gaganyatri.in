import { Component } from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ISSDemo from './demos/space/ISSDemo';

interface AppState {}

type ISSHomeProps = {
  serverUrl: string;
};

class ISSHome extends Component<ISSHomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  constructor(props: ISSHomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12 }}>
            <ISSDemo serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default ISSHome;