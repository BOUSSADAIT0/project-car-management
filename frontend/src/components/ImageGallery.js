import React, { useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const baseImageUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Placeholder image if no images are available
  const placeholderImage = 'https://via.placeholder.com/600x400?text=Pas+d%27image';

  if (!images || images.length === 0) {
    return (
      <Row>
        <Col>
          <Image src={placeholderImage} fluid className="vehicle-detail-img" />
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Image 
            src={`${baseImageUrl}/uploads/${images[selectedImage]}`}
            alt="Vehicle" 
            fluid 
            className="vehicle-detail-img"
          />
        </Col>
      </Row>
      {images.length > 1 && (
        <Row>
          <Col className="d-flex flex-wrap">
            {images.map((image, index) => (
              <Image
                key={index}
                src={`${baseImageUrl}/uploads/${image}`}
                alt={`Thumbnail ${index}`}
                className={`thumbnail-img ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </Col>
        </Row>
      )}
    </>
  );
};

export default ImageGallery;