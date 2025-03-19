import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Form, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaCar, FaUser, FaShoppingCart, FaCog, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { AuthContext } from '../context';
import SearchBox from './SearchBox';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <FaCar className="me-2" /> Auto Gestion
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/my-requests">
                    <Nav.Link>
                      <FaClipboardList className="me-1" /> Mes Demandes
                    </Nav.Link>
                  </LinkContainer>
                  
                  <NavDropdown title={<><FaUser className="me-1" /> {user.name}</>} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profil</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      <FaSignOutAlt className="me-1" /> Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser className="me-1" /> Se Connecter
                  </Nav.Link>
                </LinkContainer>
              )}
              
              {isAdmin && (
                <NavDropdown title={<><FaCog className="me-1" /> Admin</>} id="adminmenu">
                  <LinkContainer to="/admin/vehicles">
                    <NavDropdown.Item>Véhicules</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/requests">
                    <NavDropdown.Item>Demandes</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;