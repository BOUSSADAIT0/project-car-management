import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { createRequest } from '../services/requestService';
import { toast } from 'react-toastify';
import { FaClipboardCheck, FaCalendarAlt } from 'react-icons/fa';

const RequestForm = ({ vehicleId, availabilityStatus, onRequestSubmitted }) => {
  const [requestType, setRequestType] = useState('information');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isRentalRequest = requestType === 'location';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validation for rental requests
      if (isRentalRequest) {
        if (!startDate || !endDate) {
          toast.error('Veuillez spécifier les dates de début et de fin pour la location');
          setLoading(false);
          return;
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
          toast.error('La date de fin doit être postérieure à la date de début');
          setLoading(false);
          return;
        }
      }
      
      const requestData = {
        vehicleId,
        requestType,
        startDate: isRentalRequest ? startDate : null,
        endDate: isRentalRequest ? endDate : null,
        message
      };
      
      await createRequest(requestData);
      
      toast.success('Votre demande a été soumise avec succès');
      
      // Reset form
      setRequestType('information');
      setStartDate('');
      setEndDate('');
      setMessage('');
      
      // Notify parent component
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header className="bg-primary text-white">
        <FaClipboardCheck className="me-2" /> Faire une demande
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Type de demande</Form.Label>
            <Form.Select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              disabled={!availabilityStatus}
            >
              <option value="information">Demande d'information</option>
              <option value="achat">Achat</option>
              <option value="location">Location</option>
            </Form.Select>
          </Form.Group>

          {isRentalRequest && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaCalendarAlt className="me-1" /> Date de début</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaCalendarAlt className="me-1" /> Date de fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Message (optionnel)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détails supplémentaires ou questions..."
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading || !availabilityStatus}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
          </Button>
          
          {!availabilityStatus && (
            <div className="text-danger mt-2 text-center">
              Ce véhicule n'est pas disponible actuellement
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequestForm;