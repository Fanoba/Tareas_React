import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <NavLink to="/Home" className="navbar-item" end>Home</NavLink>
          </li>
          <li>
            <NavLink to="/Login" className="navbar-item">Login</NavLink>
          </li>
          <li>
            <NavLink to="/Perfil" className="navbar-item">Perfil</NavLink>
          </li>
          <li>
            <NavLink to="/Dash" className="navbar-item">Dashboard</NavLink>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet /> {/* Este renderiza las rutas hijas */}
    </div>
  );
}
