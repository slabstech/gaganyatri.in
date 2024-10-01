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

const App = () => {
  const [url, setUrl] = useState('initialUrl');
  // TODO - remove below log
  console.log(url);
  const [checked, setChecked] = useState(false);
  /*const dispatch = useDispatch();
  const url = useSelector(state => state.url.url);
  const handleCheckboxChange = (nextChecked) => {
    dispatch({ type: 'SET_URL', payload: nextChecked ? 'newUrl' : 'initialUrl' });
  };*/

  const handleChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
    setUrl(nextChecked ? 'newUrl' : 'initialUrl');
  };

  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NoMatch />} />
          </Routes>
      <footer>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        <label htmlFor="url-toggle">
          <span>{checked ? 'offline' : 'online'}</span>
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
