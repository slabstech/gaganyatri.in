import { Component } from 'react';
import { Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Countdown from 'react-countdown';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { motion } from 'framer-motion';
import MyChatBot from './chatbot/chatApp';

interface AppState {}

type HomeProps = {
  serverUrl: string;
};

class Home extends Component<HomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  // Define the Ax-4 mission launch date in IST (June 10, 2025, 5:52 PM IST)
  private readonly launchDate = new Date('2025-06-10T17:52:00+05:30');

  constructor(props: HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
  }

  // Renderer for the countdown timer
  private countdownRenderer = ({ days, hours, minutes, seconds, completed }: {
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
          py: 4,
          background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Countdown to Axiom Mission 4 Launch (IST)
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {[
            { value: days, label: 'Days' },
            { value: hours, label: 'Hours' },
            { value: minutes, label: 'Minutes' },
            { value: seconds, label: 'Seconds' },
          ].map(({ value, label }) => (
            <motion.div
              key={label}
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{
                minWidth: 80,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: 4,
                padding: 8,
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {value.toString().padStart(2, '0')}
              </Typography>
              <Typography variant="caption">{label}</Typography>
            </motion.div>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          >
            <RocketLaunchIcon sx={{ fontSize: 30, color: 'white' }} />
          </motion.div>
        </Box>
      </Box>
    );
  };

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={2} columns={12}>
          <div style={{ display: 'none' }}>
            <Grid size={{ xs: 12 }}></Grid>
            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>
          </div>
          <Grid size={{ xs: 12 }}>
            <Countdown
              date={this.launchDate}
              renderer={this.countdownRenderer}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <MyChatBot serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default Home;