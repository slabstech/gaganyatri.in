import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import NoMatch from './components/NoMatch';
import News from './components/news/News';
import Demos from './components/Demos';
import { useState } from 'react';
import Switch from 'react-switch';
//import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from "react-toastify";
import HomePage from './HomePage.tsx';
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Root from "./reducers/Root.tsx"; 

const App = () => {

  const offlineUrl =  'http://localhost:8000/api/v1' ;
  const onlineUrl  = "https://gaganyatri-django-spaces.hf.space/api/v1" ;
  const [url, setUrl] = useState(onlineUrl);
  // TODO - remove below log
  console.log(url);
  //serverBaseUrl =
  const [checked, setChecked] = useState(true);

  const handleChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
    setUrl(nextChecked ? onlineUrl : offlineUrl);
  };

  return (
    <>
    <Root>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Root>
      <footer>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        <label htmlFor="url-toggle">
          <span>{checked ? 'online' : 'offline'}</span>
          <Switch
            onChange={handleChange}
            checked={checked}
            id="url-toggle"
          />
        </label>
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

export default App
