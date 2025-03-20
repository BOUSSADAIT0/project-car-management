import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { FaCar, FaGasPump, FaCogs } from 'react-icons/fa';

const VehicleCard = ({ vehicle }) => {
  const baseImageUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return (
    <Card className="my-3 vehicle-card">
      <Link to={`/vehicle/${vehicle._id}`}>
        <Card.Img 
          src={vehicle.images && vehicle.images.length > 0 
            ? `${baseImageUrl}/uploads/${vehicle.images[0]}` 
            : 'https://via.placeholder.com/300x200?text=Pas+d%27image'}
          variant="top" 
          className="vehicle-img"
        />
      </Link>

      <Card.Body>
        <Link to={`/vehicle/${vehicle._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as="h5">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </Card.Title>
        </Link>

        <Card.Text as="div" className="my-2">
          <div className="d-flex align-items-center mb-1">
            <FaCar className="me-2" /> 
            <span>{vehicle.class}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <FaGasPump className="me-2" /> 
            <span>{vehicle.fuel_type}</span>
          </div>
          <div className="d-flex align-items-center">
            <FaCogs className="me-2" /> 
            <span>{vehicle.transmission === 'a' ? 'Automatique' : 'Manuelle'}</span>
          </div>
        </Card.Text>

        <Card.Text as="h5" className="mt-3 d-flex justify-content-between align-items-center">
          <span>{vehicle.prix && `${vehicle.prix.toLocaleString()} €`}</span>
          <Badge 
            bg={vehicle.disponible ? "success" : "danger"}
            className="ms-2"
          >
            {vehicle.disponible ? "Disponible" : "Non disponible"}
          </Badge>
        </Card.Text>
        
        <Card.Text>
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
      </Card.Body>
    </Card>
  );
};

export default VehicleCard;