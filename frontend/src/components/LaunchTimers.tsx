import React, { Component } from 'react';
import { Typography, Divider, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Countdown from 'react-countdown';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import './LaunchTimers.css';

interface AppState {}

type LaunchTimersProps = {
  serverUrl: string;
};

interface AppState {
}


class LaunchTimers extends Component<LaunchTimersProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  private readonly launchDate = new Date('2025-06-22T13:12:00+05:30');

  constructor(props: LaunchTimersProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
        this.state = {
      issPosition: null,
      issPath: [],
      loading: true,
      globeError: false,
      globeInitialized: false,
    };

  }
  
    private countdownRenderer = ({
      days,
      hours,
      minutes,
      seconds,
      completed,
    }: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      completed: boolean;
    }) => {
      if (completed) {
        return (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <RocketLaunchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6" color="primary">
              Axiom Mission 4 has launched!
            </Typography>
          </Box>
        );
      }
  
      return (
        <Box
          sx={{
            textAlign: 'center',
            my: 2,
            py: 3,
            background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
            borderRadius: 2,
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
            Countdown to Launch (IST)
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ mx: 2 }}>{days} Days</Typography>
            <Typography variant="h4" sx={{ mx: 2 }}>{hours} Hours</Typography>
            <Typography variant="h4" sx={{ mx: 2 }}>{minutes} Minutes</Typography>
            <Typography variant="h4" sx={{ mx: 2 }}>{seconds} Seconds</Typography>
          </Box>
        </Box>
      );
    };
  

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid>
            <div className="section">
              <Countdown date={this.launchDate} renderer={this.countdownRenderer} />
            </div>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default LaunchTimers;