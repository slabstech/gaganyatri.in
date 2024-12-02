import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Container,
  Button,
  TextField,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { signupNewUser } from "./SignupActions";

const Signup = ({ signupNewUser }:any) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSignupClick = () => {
    const userData = {
      username,
      password
    };
    //console.log("Sign up " + userData.username + " " + userData.password);
    signupNewUser(userData);
    navigate("/login");
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign up
          </Typography>
          <TextField
            fullWidth
            label="User name"
            name="username"
            placeholder="Enter user name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Your password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onSignupClick}
          >
            Sign up
          </Button>
          <Box mt={2}>
            <Typography variant="body1">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

Signup.propTypes = {
  signupNewUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state:any) => ({
  createUser: state.createUser
});

export default connect(mapStateToProps, {
  signupNewUser
})(Signup);
