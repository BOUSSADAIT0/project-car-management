import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaEdit, FaGasPump, FaCar, FaTachometerAlt, FaCogs } from 'react-icons/fa';
import { getVehicleById } from '../services/vehicleService';
import { AuthContext } from '../context';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ImageGallery from '../components/ImageGallery';
import RequestForm from '../components/RequestForm';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const data = await getVehicleById(id);
        setVehicle(data);
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

    fetchVehicleDetails();
  }, [id]);

  const getDriveTypeText = (drive) => {
    switch (drive) {
      case 'fwd': return 'Traction';
      case 'rwd': return 'Propulsion';
      case 'awd': return '4 roues motrices';
      case '4wd': return '4x4';
      default: return drive;
    }
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        <FaArrowLeft className="me-1" /> Retour
      </Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : vehicle ? (
        <>
          <Row>
            <Col md={7}>
              <ImageGallery images={vehicle.images} />
            </Col>
            <Col md={5}>
              <Card>
                <Card.Body>
                  <Card.Title as="h3">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </Card.Title>
                  
                  <Card.Text as="div" className="my-3">
                    <Badge 
                      bg={vehicle.disponible ? "success" : "danger"}
                      className="me-2"
                    >
                      {vehicle.disponible ? "Disponible" : "Non disponible"}
                    </Badge>
                    <Badge 
                      bg={
                        vehicle.status === 'à vendre' 
                          ? "primary" 
                          : vehicle.status === 'à louer' 
                            ? "info" 
                            : "warning"
                      }
                    >
                      {vehicle.status}
                    </Badge>
                  </Card.Text>
                  
                  <Card.Text as="h4" className="my-3">
                    Prix: {vehicle.prix && `${vehicle.prix.toLocaleString()} €`}
                  </Card.Text>
                  
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <FaCar className="me-2" /> Classe:
                        </Col>
                        <Col>
                          <strong>{vehicle.class}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <FaGasPump className="me-2" /> Carburant:
                        </Col>
                        <Col>
                          <strong>
                            {vehicle.fuel_type === 'gas' ? 'Essence' : 
                             vehicle.fuel_type === 'diesel' ? 'Diesel' : 
                             vehicle.fuel_type === 'electric' ? 'Électrique' : 
                             vehicle.fuel_type === 'hybrid' ? 'Hybride' : 
                             vehicle.fuel_type}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <FaCogs className="me-2" /> Transmission:
                        </Col>
                        <Col>
                          <strong>
                            {vehicle.transmission === 'a' ? 'Automatique' : 
                             vehicle.transmission === 'm' ? 'Manuelle' : 
                             vehicle.transmission}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <FaTachometerAlt className="me-2" /> Consommation:
                        </Col>
                        <Col>
                          <strong>
                            {vehicle.combination_mpg} mpg (combinée)
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <Row>
                        <Col>Type de transmission:</Col>
                        <Col>
                          <strong>{getDriveTypeText(vehicle.drive)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <Row>
                        <Col>Cylindres:</Col>
                        <Col>
                          <strong>{vehicle.cylinders}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <Row>
                        <Col>Cylindrée:</Col>
                        <Col>
                          <strong>{vehicle.displacement} L</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  
                  {isAdmin && (
                    <Button
                      className="w-100 mt-3"
                      variant="warning"
                      onClick={() => navigate(`/admin/vehicle/${vehicle._id}/edit`)}
                    >
                      <FaEdit className="me-1" /> Modifier
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {isAuthenticated ? (
            <Row className="mt-3">
              <Col md={7}>
                <RequestForm 
                  vehicleId={vehicle._id} 
                  availabilityStatus={vehicle.disponible}
                />
              </Col>
            </Row>
          ) : (
            <Message variant="info" className="mt-3">
              Veuillez <Link to="/login">vous connecter</Link> pour faire une demande sur ce véhicule
            </Message>
          )}
        </>
      ) : (
        <Message variant="danger">Véhicule non trouvé</Message>
      )}
    </>
  );
};

export default VehicleDetailsPage;