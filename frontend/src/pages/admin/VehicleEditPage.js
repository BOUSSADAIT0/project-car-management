import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FaArrowLeft, FaCar } from 'react-icons/fa';
import { getVehicleById, updateVehicle, createVehicle } from '../../services/vehicleService';
import VehicleForm from '../../components/VehicleForm';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const VehicleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const isEditing = id !== 'new';
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchVehicleDetails();
    }
  }, [id]);

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

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      if (isEditing) {
        await updateVehicle(id, formData);
        toast.success('Véhicule mis à jour avec succès');
      } else {
        await createVehicle(formData);
        toast.success('Véhicule créé avec succès');
      }
      
      navigate('/admin/vehicles');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Link to="/admin/vehicles" className="btn btn-light my-3">
        <FaArrowLeft className="me-1" /> Retour
      </Link>
      
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h2 className="m-0">
            <FaCar className="me-2" /> {isEditing ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h2>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <VehicleForm 
              vehicle={isEditing ? vehicle : null} 
              onSubmit={handleSubmit} 
              buttonText={isEditing ? 'Mettre à jour' : 'Créer'}
            />
          )}
          
          {submitting && <Loader />}
        </Card.Body>
      </Card>
    </>
  );
};

export default VehicleEditPage;