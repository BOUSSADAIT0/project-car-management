import api from './api';

// Get all vehicles with pagination and filtering
export const getVehicles = async (keyword = '', pageNumber = 1) => {
  const { data } = await api.get(`/vehicles?keyword=${keyword}&page=${pageNumber}`);
  return data;
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
  const { data } = await api.get(`/vehicles/${id}`);
  return data;
};

// Create vehicle (admin)
export const createVehicle = async (vehicleData) => {
  const formData = new FormData();
  
  // Add basic vehicle data
  Object.keys(vehicleData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, vehicleData[key]);
    }
  });
  
  // Add images
  if (vehicleData.images && vehicleData.images.length > 0) {
    vehicleData.images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  const { data } = await api.post('/vehicles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};

// Update vehicle (admin)
export const updateVehicle = async (id, vehicleData) => {
  const formData = new FormData();
  
  // Add basic vehicle data
  Object.keys(vehicleData).forEach(key => {
    if (key !== 'images' && key !== 'keepImages') {
      formData.append(key, vehicleData[key]);
    }
  });
  
  // Add keep images
  if (vehicleData.keepImages && vehicleData.keepImages.length > 0) {
    vehicleData.keepImages.forEach(image => {
      formData.append('keepImages', image);
    });
  }
  
  // Add new images
  if (vehicleData.images && vehicleData.images.length > 0) {
    vehicleData.images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  const { data } = await api.put(`/vehicles/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};

// Delete vehicle (admin)
export const deleteVehicle = async (id) => {
  await api.delete(`/vehicles/${id}`);
  return { success: true };
};