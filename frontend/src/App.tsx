import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import NoMatch from './components/NoMatch';
import Demos from './components/Demos';
import { useState } from 'react';

const App = () => {

  const onlineUrl  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  const [serverUrl, setUrl] = useState(onlineUrl);
  console.log(serverUrl);

  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home serverUrl={serverUrl}  />} />
          <Route path="/demos" element={<Demos serverUrl={serverUrl} />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
    </>
  )
}

export default App;
