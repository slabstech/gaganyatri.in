import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const About = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <Box mt={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" gutterBottom>
          Building Tech for Mars
        </Typography>
        <Typography variant="body1">
          Creating Intelligent software to incorporate on Robots
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
