import React, { ChangeEvent } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";  // new import 
import { connect } from "react-redux";          // new import 
import PropTypes from "prop-types"; 
import {
  Container,
  Button,
  TextField,
  Grid,
  Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onLoginClick = () => {
    const userData = {
      username: username,
      password: password
    };
    console.log("Login " + userData.username + " " + userData.password);
    this.props.login(userData, "/dashboard");
  };

  return (
    <Container>
      <Grid container justify="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Login</Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="usernameId"
              label="User name"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              id="passwordId"
              label="Your password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
            />
          </form>
          <Button variant="contained" color="primary" onClick={onLoginClick}>Login</Button>
          <Typography variant="body1" className="mt-2">
            Don't have account? <Link to="/signup">Signup</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  login
})(withRouter(Login));