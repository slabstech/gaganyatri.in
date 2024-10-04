import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import NoMatch from './components/NoMatch';
import News from './components/news/News';
import Demos from './components/Demos';
import { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
//import { ToastContainer } from "react-toastify";
import Signup from "./components/signup/Signup";
//import Login from "./components/login/Login";
//import Dashboard from "./components/dashboard/Dashboard";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";

const App = () => {

  const offlineUrl =  'http://localhost:8000/api/v1' ;
  const onlineUrl  = "https://gaganyatri-django-spaces.hf.space/api/v1" ;
  const [url, setUrl] = useState(onlineUrl);
  console.log(url);
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setUrl(event.target.checked ? onlineUrl : offlineUrl);
  };

  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      <footer>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              name="url-toggle"
            />
          }
          label={checked ? 'online' : 'offline'}
        />
      </div>
        <p>
            &copy; gaganyatri.in |
            <a href="https://github.com/slabstech" target="_blank"><i className="fab fa-github"></i></a> |
            <a href="https://x.com/gaganyatri" target="_blank"><i className="fab fa-twitter"></i></a>
        </p>
      </footer>
    </>
  )
}

export default App;
