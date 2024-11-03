import { Grid, Paper, Divider } from '@mui/material';
import FoodGuardian from './demos/FoodGuardian';
import Recipes from './demos/Recipes';
import SpeechASR from './demos/SpeechASR';
import SpeechLLM from './demos/SpeechLLM';

type DemosProps = {
  serverUrl: string;
  isOnline: boolean;
};

const Demos: React.FC<DemosProps> = ({ serverUrl }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
            <SpeechASR serverUrl={serverUrl} isOnline={true} />
      </Grid>
      <Grid item xs={12}>
            <Divider />
      </Grid>
      <Grid item xs={12} md={6}>
            <SpeechLLM serverUrl={serverUrl} isOnline={true} />
      </Grid>
      <Grid item xs={12}>
            <Divider />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <FoodGuardian serverUrl={serverUrl} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
            <Divider />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Recipes serverUrl={serverUrl} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Demos;
