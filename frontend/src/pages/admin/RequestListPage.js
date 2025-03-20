import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaClipboardList, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { getAllRequests, updateRequestStatus } from '../../services/requestService';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const RequestListPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const baseImageUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
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

  const openStatusModal = (request) => {
    setSelectedRequest(request);
    setStatusUpdate(request.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setStatusUpdate('');
  };

  const updateStatus = async () => {
    if (!selectedRequest || !statusUpdate) return;
    
    try {
      setUpdatingStatus(true);
      await updateRequestStatus(selectedRequest._id, statusUpdate);
      
      // Update the local state
      setRequests(
        requests.map((request) =>
          request._id === selectedRequest._id
            ? { ...request, status: statusUpdate }
            : request
        )
      );
      
      toast.success('Statut de la demande mis à jour avec succès');
      closeModal();
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Erreur lors de la mise à jour du statut'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    
    return <Badge bg={variant} className="status-badge">{status}</Badge>;
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
      <Row className="align-items-center mb-3">
        <Col>
          <h1>
            <FaClipboardList className="me-2" /> Gestion des Demandes
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
            <Table responsive striped hover className="admin-table m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CLIENT</th>
                  <th>VÉHICULE</th>
                  <th>TYPE</th>
                  <th>STATUT</th>
                  <th>DATE</th>
                  <th>PÉRIODE (LOCATION)</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Aucune demande trouvée
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request._id.substring(0, 8)}...</td>
                      <td>{request.user ? request.user.name : 'Utilisateur inconnu'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {request.vehicle && request.vehicle.images && request.vehicle.images.length > 0 ? (
                            <img
                              src={`${baseImageUrl}/uploads/${request.vehicle.images[0].startsWith('car_images/') ? request.vehicle.images[0] : `car_images/${request.vehicle.images[0]}`}`}
                              alt={request.vehicle ? request.vehicle.make : ''}
                              className="me-2"
                            />
                          ) : null}
                          <span>
                            {request.vehicle 
                              ? `${request.vehicle.make} ${request.vehicle.model}` 
                              : 'Véhicule inconnu'}
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
                        <Button
                          variant="primary"
                          className="btn-sm me-2"
                          onClick={() => openStatusModal(request)}
                        >
                          Statut
                        </Button>
                        
                        {request.vehicle && (
                          <Link to={`/vehicle/${request.vehicle._id}`}>
                            <Button variant="light" className="btn-sm">
                              <FaEye />
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal de mise à jour du statut */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mise à jour du statut de la demande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <p>
                <strong>Client :</strong> {selectedRequest.user ? selectedRequest.user.name : 'Inconnu'}
              </p>
              <p>
                <strong>Véhicule :</strong>{' '}
                {selectedRequest.vehicle
                  ? `${selectedRequest.vehicle.make} ${selectedRequest.vehicle.model}`
                  : 'Inconnu'}
              </p>
              <p>
                <strong>Type de demande :</strong> {selectedRequest.requestType}
              </p>
              <p>
                <strong>Message :</strong> {selectedRequest.message || 'Aucun message'}
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Statut</Form.Label>
                <Form.Select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="en attente">En attente</option>
                  <option value="acceptée">Acceptée</option>
                  <option value="refusée">Refusée</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={updateStatus}
            disabled={updatingStatus}
          >
            {updatingStatus ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RequestListPage;