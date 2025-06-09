import React, { Component } from 'react';
import MyChatBot from './chatbot/chatApp';
import './Home.css';
import TrackerHome from './TrackerHome';
import LaunchTimers from './LaunchTimers';
import { Typography } from '@mui/material';

interface AppState {
  loading: boolean;
}

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
      <div >
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
          Axiom Mission 4
        </Typography>
        <div  style={{ display: 'none' }} >
          <MyChatBot serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
        </div>
        <div>
          <LaunchTimers serverUrl={this.serverBaseUrl} />
        </div>
        <div >
          <TrackerHome serverUrl={this.serverBaseUrl} />
        </div>
      </div>
    );
  }
}

export default Home;