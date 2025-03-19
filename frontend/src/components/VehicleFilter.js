import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

const VehicleFilter = ({ onApplyFilter }) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    year: '',
    make: '',
    status: '',
    fuelType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilter(filters);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      year: '',
      make: '',
      status: '',
      fuelType: '',
    });
    onApplyFilter({});
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <FaFilter className="me-2" /> Filtrer les véhicules
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Prix minimum</Form.Label>
            <Form.Control
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              placeholder="Prix minimum"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prix maximum</Form.Label>
            <Form.Control
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              placeholder="Prix maximum"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Année</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={filters.year}
              onChange={handleChange}
              placeholder="Année"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Marque</Form.Label>
            <Form.Control
              type="text"
              name="make"
              value={filters.make}
              onChange={handleChange}
              placeholder="Marque"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Statut</Form.Label>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">Tous</option>
              <option value="à vendre">À vendre</option>
              <option value="à louer">À louer</option>
              <option value="à acheter">À acheter</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type de carburant</Form.Label>
            <Form.Select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleChange}
            >
              <option value="">Tous</option>
              <option value="gas">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Électrique</option>
              <option value="hybrid">Hybride</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">
              Appliquer les filtres
            </Button>
            <Button type="button" variant="outline-secondary" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default VehicleFilter;