import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../context';
import { updateUserProfile, getUserProfile } from '../services/authService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaUser, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};
    
    if (password && password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Only include password if it was updated
      const userData = {
        name,
        email,
        ...(password && { password }),
      };
      
      const data = await updateUserProfile(userData);
      
      // Update local context
      await updateProfile({
        name: data.name,
        email: data.email,
      });
      
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col md={6} className="mx-auto">
        <Card className="my-3">
          <Card.Header as="h3" className="text-center bg-primary text-white">
            <FaUser className="me-2" /> Mon Profil
          </Card.Header>
          <Card.Body>
            {error && <Message variant="danger">{error}</Message>}
            {success && (
              <Message variant="success">
                Profil mis à jour avec succès
              </Message>
            )}
            {loading && <Loader />}
            
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

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

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Nouveau mot de passe (optionnel)</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrez un nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!validationErrors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Confirmer le mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmez le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!validationErrors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                <FaKey className="me-1" /> Mettre à jour le profil
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;