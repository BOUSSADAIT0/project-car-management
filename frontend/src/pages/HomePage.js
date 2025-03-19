import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getVehicles } from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import VehicleFilter from '../components/VehicleFilter';
import { FaPlus } from 'react-icons/fa';

const HomePage = () => {
  const { keyword = '', pageNumber = 1 } = useParams();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await getVehicles(keyword, pageNumber);
        
        // Apply filters if any
        let filteredData = [...data.vehicles];
        
        if (Object.keys(filters).length > 0) {
          filteredData = filteredData.filter(vehicle => {
            // Filter by price range
            if (filters.priceMin && vehicle.prix < filters.priceMin) return false;
            if (filters.priceMax && vehicle.prix > filters.priceMax) return false;
            
            // Filter by year
            if (filters.year && vehicle.year.toString() !== filters.year) return false;
            
            // Filter by make
            if (filters.make && !vehicle.make.toLowerCase().includes(filters.make.toLowerCase())) return false;
            
            // Filter by status
            if (filters.status && vehicle.status !== filters.status) return false;
            
            // Filter by fuel type
            if (filters.fuelType && vehicle.fuel_type !== filters.fuelType) return false;
            
            return true;
          });
        }
        
        setVehicles(filteredData);
        setPage(data.page);
        setPages(data.pages);
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

    fetchVehicles();
  }, [keyword, pageNumber, filters]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Nos Véhicules</h1>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <VehicleFilter onApplyFilter={applyFilters} />
        </Col>
        
        <Col md={9}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Row>
                {vehicles.length === 0 ? (
                  <Message>Aucun véhicule trouvé</Message>
                ) : (
                  vehicles.map((vehicle) => (
                    <Col key={vehicle._id} sm={12} md={6} lg={4} xl={4} className="mb-4">
                      <VehicleCard vehicle={vehicle} />
                    </Col>
                  ))
                )}
              </Row>
              <Paginate
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ''}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HomePage;