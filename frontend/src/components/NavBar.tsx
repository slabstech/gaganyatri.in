// component/NavBar.js

import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/demos">Demo</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;