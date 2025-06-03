import React, { useState, useEffect, } from 'react';
import { Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/header.module.css';

const HEADER = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '' });

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

   const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken"); // Si también guardaste el token
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
    >
      <Container>
        <Navbar.Brand onClick={() => navigate('/home')} className={styles.brand}>
          BookFinder
        </Navbar.Brand>
        
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/read" 
              className={styles.navLink}
            >
              <i className="bi bi-book me-1"></i> Libros Leídos
            </Nav.Link>
            
           <Nav.Link 
              as={Link} 
              to="/favorites" 
              className={styles.navLink}
            >
              <i className="bi bi-heart me-1"></i> Favoritos
            </Nav.Link>
            
            <NavDropdown
              title={
                <>
                  <span className="ms-2 d-none d-lg-inline">{user.name || 'Usuario'}</span>
                </>
              }
              align="end"
              className={styles.navLink}
              menuClassName={styles.dropdownMenu}
            >
              
              <NavDropdown.Item 
                className={styles.dropdownItem}
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HEADER;