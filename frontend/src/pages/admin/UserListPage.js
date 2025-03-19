import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { FaTrash, FaUsers, FaUserShield, FaUserAlt } from 'react-icons/fa';
import { getUsers, deleteUser } from '../../services/authService';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        setLoading(true);
        await deleteUser(id);
        fetchUsers();
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Erreur lors de la suppression de l\'utilisateur'
        );
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h1>
            <FaUsers className="me-2" /> Gestion des Utilisateurs
          </h1>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive striped hover className="m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOM</th>
                  <th>EMAIL</th>
                  <th>RÔLE</th>
                  <th>INSCRIT LE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id.substring(0, 8)}...</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {user.isAdmin ? (
                            <FaUserShield className="me-2 text-primary" />
                          ) : (
                            <FaUserAlt className="me-2" />
                          )}
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.isAdmin ? 'primary' : 'secondary'}>
                          {user.isAdmin ? 'Administrateur' : 'Client'}
                        </Badge>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(user._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default UserListPage;