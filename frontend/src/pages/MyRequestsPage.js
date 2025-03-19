import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaClipboardList } from 'react-icons/fa';
import { getUserRequests } from '../services/requestService';
import Loader from '../components/Loader';
import Message from '../components/Message';

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseImageUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getUserRequests();
        setRequests(data);
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

    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'en attente':
        variant = 'warning';
        break;
      case 'acceptée':
        variant = 'success';
        break;
      case 'refusée':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  const getRequestTypeBadge = (type) => {
    let variant;
    switch (type) {
      case 'achat':
        variant = 'primary';
        break;
      case 'location':
        variant = 'info';
        break;
      case 'information':
        variant = 'dark';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant}>{type}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <>
      <h1 className="mb-4">
        <FaClipboardList className="me-2" /> Mes Demandes
      </h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : requests.length === 0 ? (
        <Message>Vous n'avez pas encore fait de demandes.</Message>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive striped hover className="m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Véhicule</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date de demande</th>
                  <th>Période (si location)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request._id.substring(0, 8)}...</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {request.vehicle.images && request.vehicle.images.length > 0 ? (
                          <img
                            src={`${baseImageUrl}/uploads/${request.vehicle.images[0]}`}
                            alt={request.vehicle.make}
                            style={{ width: '50px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                          />
                        ) : null}
                        <span>
                          {request.vehicle.make} {request.vehicle.model} ({request.vehicle.year})
                        </span>
                      </div>
                    </td>
                    <td>{getRequestTypeBadge(request.requestType)}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      {request.startDate && request.endDate
                        ? `${formatDate(request.startDate)} - ${formatDate(request.endDate)}`
                        : '-'}
                    </td>
                    <td>
                      <Link to={`/vehicle/${request.vehicle._id}`}>
                        <Button variant="light" size="sm">
                          <FaEye /> Voir
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default MyRequestsPage;