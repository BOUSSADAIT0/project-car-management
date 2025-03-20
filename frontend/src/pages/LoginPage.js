import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaSignInAlt, FaUserShield } from 'react-icons/fa';

// Fonction pour mettre à jour le statut administrateur (temporaire)
const setAsAdmin = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return false;
    
    userInfo.isAdmin = true;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut admin:', error);
    return false;
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login, loading, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate(redirect);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleSetAsAdmin = () => {
    if (isAuthenticated) {
      const success = setAsAdmin();
      if (success) {
        alert('Vous êtes maintenant administrateur. Veuillez vous reconnecter pour que les changements prennent effet.');
        logout();
        navigate('/login');
      } else {
        alert('Échec de la mise à jour du statut administrateur');
      }
    } else {
      alert('Veuillez vous connecter d\'abord');
    }
  };

  return (
    <FormContainer>
      <h1 className="mb-4">
        <FaSignInAlt className="me-2" /> Connexion
      </h1>
      
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Adresse e-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entrez votre e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
          Se connecter
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Nouveau client?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            S'inscrire
          </Link>
        </Col>
      </Row>
      
      {/* Bouton temporaire pour définir l'utilisateur comme administrateur */}
      <Button 
        variant="outline-primary" 
        className="w-100 mt-3"
        onClick={handleSetAsAdmin}
      >
        <FaUserShield className="me-2" /> Définir comme administrateur (temporaire)
      </Button>
      <p className="text-muted small text-center mt-2">
        Ce bouton est temporaire et permet de donner les droits d'administrateur à un utilisateur.
      </p>
    </FormContainer>
  );
};

export default LoginPage;