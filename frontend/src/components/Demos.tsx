import { Grid, Paper } from '@mui/material';
import FoodGuardian from './demos/FoodGuardian';
import Recipes from './demos/Recipes';

const Demos = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <FoodGuardian />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Recipes />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Demos;
