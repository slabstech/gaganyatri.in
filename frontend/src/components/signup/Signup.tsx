import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // updated imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Container,
  Button,
  TextField,
  Grid
} from '@material-ui/core';
import { signupNewUser } from "./SignupActions";

const Signup = ({ signupNewUser }) => {
  const navigate = useNavigate(); // initialize useNavigate hook
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSignupClick = () => {
    const userData = {
      username,
      password
    };
    console.log("Sign up " + userData.username + " " + userData.password);
    signupNewUser(userData);
    navigate("/login"); // navigate to login page after signup
  };

  return (
    <div>
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={4}>
            <h1>Sign up</h1>
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
            >Sign up</Button>
            <p className="mt-2">
              Already have account? <Link to="/login">Login</Link>
            </p>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

Signup.propTypes = {
  signupNewUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  createUser: state.createUser
});

export default connect(mapStateToProps, {
  signupNewUser
})(Signup);
