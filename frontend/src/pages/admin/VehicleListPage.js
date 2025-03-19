import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaCar } from 'react-icons/fa';
import { getVehicles, deleteVehicle } from '../../services/vehicleService';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';
import { toast } from 'react-toastify';

const VehicleListPage = () => {
  const { pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  const baseImageUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchVehicles();
  }, [pageNumber]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles('', pageNumber);
      setVehicles(data.vehicles);
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

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) {
      try {
        setLoading(true);
        await deleteVehicle(id);
        fetchVehicles();
        toast.success('Véhicule supprimé avec succès');
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Erreur lors de la suppression du véhicule'
        );
        setLoading(false);
      }
    }
  };

  const createVehicleHandler = () => {
    navigate('/admin/vehicle/new');
  };

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'à vendre':
        variant = 'primary';
        break;
      case 'à louer':
        variant = 'info';
        break;
      case 'à acheter':
        variant = 'warning';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h1>
            <FaCar className="me-2" /> Gestion des Véhicules
          </h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createVehicleHandler}>
            <FaPlus className="me-1" /> Ajouter un véhicule
          </Button>
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
                  <th>IMAGE</th>
                  <th>MARQUE/MODÈLE</th>
                  <th>ANNÉE</th>
                  <th>PRIX</th>
                  <th>STATUT</th>
                  <th>DISPONIBILITÉ</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id}>
                    <td>{vehicle._id.substring(0, 8)}...</td>
                    <td>
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={`${baseImageUrl}/uploads/${vehicle.images[0]}`}
                          alt={vehicle.make}
                        />
                      ) : (
                        <span>Aucune image</span>
                      )}
                    </td>
                    <td>
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.prix && `${vehicle.prix.toLocaleString()} €`}</td>
                    <td>{getStatusBadge(vehicle.status)}</td>
                    <td>
                      <Badge bg={vehicle.disponible ? 'success' : 'danger'}>
                        {vehicle.disponible ? 'Disponible' : 'Non disponible'}
                      </Badge>
                    </td>
                    <td>
                      <LinkContainer to={`/admin/vehicle/${vehicle._id}/edit`}>
                        <Button variant="light" className="btn-sm me-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(vehicle._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      
      <Paginate pages={pages} page={page} isAdmin={true} />
    </>
  );
};

export default VehicleListPage;