import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  TextField,
  Grid
} from '@material-ui/core';

interface AppState {
}
class Signup extends Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSignupClick = () => {
    const userData = {
      username: this.state.username,
      password: this.state.password
    };
    console.log("Sign up " + userData.username + " " + userData.password);
  };

  render() {
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
              value={this.state.username}
              onChange={(e) => this.onChange(e)}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              label="Your password"
              name="password"
              placeholder="Enter password"
              value={this.state.password}
              onChange={(e) => this.onChange(e)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.onSignupClick}
            >Sign up</Button>
            <p className="mt-2">
              Already have account? <Link to="/login">Login</Link>
            </p>
          </Grid>
        </Grid>
      </Container>
      </div>
    );
  }
}

export default Signup;
