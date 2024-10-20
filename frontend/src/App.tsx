import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import NoMatch from './components/NoMatch';
import News from './components/news/News';
import Demos from './components/Demos';
import Maps from './components/Maps';
import { useState } from 'react';
//import { ToastContainer } from "react-toastify";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
//import Dashboard from "./components/dashboard/Dashboard";
import axios from "axios";
import { Switch, FormControlLabel, FormGroup, Box, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import DiscordIcon from './assets/discordIcon';
//axios.defaults.baseURL = "http://127.0.0.1:8000";

const App = () => {

  const offlineUrl =  'http://localhost:8000/api/v1' ;
  const onlineUrl  = import.meta.env.VITE_HF_SPACES_URL;
  const [serverUrl, setUrl] = useState(onlineUrl);
  console.log(serverUrl);
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setUrl(event.target.checked ? onlineUrl : offlineUrl);
  };

  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home serverUrl={serverUrl} />} />
          <Route path="/demos" element={<Demos serverUrl={serverUrl} />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      <footer>
      <Box
        sx={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label={checked ? 'online' : 'offline'}
          />
        </FormGroup>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="https://gaganyatri.in/">
            gaganyatri.in
          </Link>{' '}
          |
          <IconButton size="small" href="https://github.com/slabstech" target="_blank">
            <GitHubIcon />
          </IconButton>
          <IconButton size="small" href="https://x.com/gaganyatri" target="_blank">
            <TwitterIcon />
          </IconButton>
          <IconButton size="small" href="https://discord.gg/HAXjG7sC" target="_blank">
            <DiscordIcon />
          </IconButton>
        </Typography>
      </Box>
      </footer>
    </>
  )
}

export default App;
