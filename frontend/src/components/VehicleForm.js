import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FaUpload, FaTimes } from 'react-icons/fa';

const VehicleForm = ({ vehicle, onSubmit, buttonText = 'Enregistrer' }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    city_mpg: '',
    class: '',
    combination_mpg: '',
    cylinders: '',
    displacement: '',
    drive: '',
    fuel_type: '',
    highway_mpg: '',
    transmission: '',
    disponible: true,
    status: 'à vendre',
    prix: '',
    images: []
  });
  
  const [keepImages, setKeepImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const baseImageUrl = 'http://localhost:5000/uploads/';

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        city_mpg: vehicle.city_mpg || '',
        class: vehicle.class || '',
        combination_mpg: vehicle.combination_mpg || '',
        cylinders: vehicle.cylinders || '',
        displacement: vehicle.displacement || '',
        drive: vehicle.drive || '',
        fuel_type: vehicle.fuel_type || '',
        highway_mpg: vehicle.highway_mpg || '',
        transmission: vehicle.transmission || '',
        disponible: vehicle.disponible !== undefined ? vehicle.disponible : true,
        status: vehicle.status || 'à vendre',
        prix: vehicle.prix || '',
        images: []
      });
      
      // Set existing images to keep
      if (vehicle.images && vehicle.images.length > 0) {
        setKeepImages(vehicle.images);
      }
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview all images
    const newImagePreviewUrls = [];
    const newImageFiles = [];
    
    files.forEach(file => {
      newImageFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prevUrls => [...prevUrls, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setImageFiles([...imageFiles, ...newImageFiles]);
  };

  const removeImageFile = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    
    const newImagePreviewUrls = [...imagePreviewUrls];
    newImagePreviewUrls.splice(index, 1);
    
    setImageFiles(newImageFiles);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const removeKeepImage = (index) => {
    const newKeepImages = [...keepImages];
    newKeepImages.splice(index, 1);
    setKeepImages(newKeepImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create form data for submission
    const submitData = {
      ...formData,
      images: imageFiles,
      keepImages
    };
    
    onSubmit(submitData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Marque</Form.Label>
            <Form.Control
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Modèle</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Année</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Classe</Form.Label>
            <Form.Control
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Prix</Form.Label>
            <Form.Control
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type de carburant</Form.Label>
            <Form.Select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner</option>
              <option value="gas">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Électrique</option>
              <option value="hybrid">Hybride</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Transmission</Form.Label>
            <Form.Select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option value="">Sélectionner</option>
              <option value="a">Automatique</option>
              <option value="m">Manuelle</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Consommation en ville (mpg)</Form.Label>
            <Form.Control
              type="number"
              name="city_mpg"
              value={formData.city_mpg}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Consommation sur autoroute (mpg)</Form.Label>
            <Form.Control
              type="number"
              name="highway_mpg"
              value={formData.highway_mpg}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Consommation combinée (mpg)</Form.Label>
            <Form.Control
              type="number"
              name="combination_mpg"
              value={formData.combination_mpg}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Cylindres</Form.Label>
            <Form.Control
              type="number"
              name="cylinders"
              value={formData.cylinders}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Cylindrée</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              name="displacement"
              value={formData.displacement}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Transmission</Form.Label>
            <Form.Select
              name="drive"
              value={formData.drive}
              onChange={handleChange}
            >
              <option value="">Sélectionner</option>
              <option value="fwd">Traction</option>
              <option value="rwd">Propulsion</option>
              <option value="awd">4 roues motrices</option>
              <option value="4wd">4x4</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Statut</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="à vendre">À vendre</option>
              <option value="à louer">À louer</option>
              <option value="à acheter">À acheter</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Disponible"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Images</Form.Label>
        <Form.Control
          type="file"
          onChange={handleImageChange}
          multiple
          accept="image/*"
        />
        <Form.Text className="text-muted">
          Vous pouvez sélectionner plusieurs images
        </Form.Text>
      </Form.Group>

      {/* New Image Previews */}
      {imagePreviewUrls.length > 0 && (
        <div>
          <p>Nouvelles images:</p>
          <div className="image-preview">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img src={url} alt={`Preview ${index}`} />
                <div className="remove-btn" onClick={() => removeImageFile(index)}>
                  <FaTimes />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images */}
      {keepImages.length > 0 && (
        <div className="mt-3">
          <p>Images existantes:</p>
          <div className="image-preview">
            {keepImages.map((image, index) => (
              <div key={index} className="image-preview-item">
                <img 
                  src={`${baseImageUrl}${image.startsWith('car_images/') ? image : `car_images/${image}`}`} 
                  alt={`Existing ${index}`} 
                />
                <div className="remove-btn" onClick={() => removeKeepImage(index)}>
                  <FaTimes />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" className="mt-3">
        {buttonText}
      </Button>
    </Form>
  );
};

export default VehicleForm;