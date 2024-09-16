import { useState } from 'react'
import './App.css'
import './css/styles.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
      <nav>
          <ul>
              <li><a href="src/iss-map.html">ISS</a></li> 
              <li><a href="#missions">Missions</a></li>
              <li><a href="#space-suit">Space Suit</a></li>
              <li><a href="#astronaut-ax4">Gaganyatri's</a></li>
              <li><a href="src/news.html">News</a></li> 
          </ul>
      </nav>
      </header>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <section id="missions">
        <h2>Missions</h2>
        <div id="mission1">
          <h3>Gaganyaan - 1 </h3>
          <p>Axiom 4</p>
        </div>
      </section>
      <section id="space-suit">
        <h2>SpaceX Space Suit</h2>
        <button id="spaceSuitButton">
          <img src="src/img/space-suit.jpg" alt="SpaceX Space Suit" width="300" height="300"/>
        </button>
        <div id="spaceSuitInfo" >
          <p>The SpaceX space suit is made of a multi-layer fabric that provides thermal insulation, radiation protection, and life support.</p>
          <p>The suit includes a helmet with a built-in display and communication system, a life support system that provides oxygen and water, and a waste management system that recycles urine and carbon dioxide.</p>
        </div>
      </section>
      <div className="container" id="astronaut-ax4">
        <section id="prime-astronaut" className="astronaut">
            <h2>Shubhanshu Shukla</h2>
            <h3>Prime</h3>
            <button id="primeAstronautButton">
            <img src="src/img/shukla_shubhanshu.jpg" alt="Shubhanshu Shukla" width="300" height="300"/>
            </button>
            <div id="prime-astronaut-info" >
            <p><strong>Missions:</strong> [Prime Astronaut Missions]</p>
            <p><strong>Notable Achievements:</strong> [Prime Astronaut Achievements]</p>
            </div>
        </section>
        <section id="backup-astronaut" className="astronaut">
            <h2>Prasanth Balakrishnan Nair</h2>
            <h3>Backup</h3>
            <button id="backupAstronautButton">
            <img src="src/img/prasanth_nair.jpg" alt="Prasanth Balakrishnan Nair" width="300" height="300"/>
            </button>
            <div id="backup-astronaut-info" >
            <p><strong>Missions:</strong> [Backup Astronaut Missions]</p>
            <p><strong>Notable Achievements:</strong> [Backup Astronaut Achievements]</p>
            </div>
        </section>
      </div>
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
