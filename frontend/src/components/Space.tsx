import {
  Container,
  Card,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import spaceSuit from '../img/space-suit.jpg';

const Space = () => {
  return (
    <Container>
      <Card>
        {/* Your card content here */}
      </Card>
      <Typography variant="h2">Missions</Typography>
      <Paper elevation={3} style={{ padding: '1rem' }}>
        <Typography variant="h3">Gaganyaan - 1</Typography>
        <Typography variant="body1">Axiom 4</Typography>
      </Paper>
      <Typography variant="h2">SpaceX Space Suit</Typography>
      <Button variant="outlined">
        <img src={spaceSuit} alt="SpaceX Space Suit" width="300" height="300" />
      </Button>
      <Typography variant="body1">
        The SpaceX space suit is made of a multi-layer fabric that provides thermal insulation, radiation protection, and life support.
      </Typography>
      <Typography variant="body1">
        The suit includes a helmet with a built-in display and communication system, a life support system that provides oxygen and water, and a waste management system that recycles urine and carbon dioxide.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h3">Shubhanshu Shukla</Typography>
            <Typography variant="h4">Prime</Typography>
            <Button variant="outlined">
              {/* Prime Astronaut Button Content */}
            </Button>
            <Typography variant="body1">
              <strong>Missions:</strong> [Prime Astronaut Missions]
            </Typography>
            <Typography variant="body1">
              <strong>Notable Achievements:</strong> [Prime Astronaut Achievements]
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h3">Prasanth Balakrishnan Nair</Typography>
            <Typography variant="h4">Backup</Typography>
            <Button variant="outlined">
              {/* Backup Astronaut Button Content */}
            </Button>
            <Typography variant="body1">
              <strong>Missions:</strong> [Backup Astronaut Missions]
            </Typography>
            <Typography variant="body1">
              <strong>Notable Achievements:</strong> [Backup Astronaut Achievements]
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Space;
