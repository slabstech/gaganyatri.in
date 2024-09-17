import './App.css'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import NoMatch from './components/NoMatch';
import Maps from './components/Maps';
import News from './components/news/News';

function App() {

  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NoMatch />} />
          </Routes>
      <footer>
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
