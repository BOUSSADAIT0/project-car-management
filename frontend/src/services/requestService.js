import api from './api';

// Create a new request
export const createRequest = async (requestData) => {
  const { data } = await api.post('/requests', requestData);
  return data;
};

// Get user requests
export const getUserRequests = async () => {
  const { data } = await api.get('/requests/myRequests');
  return data;
};

// Get all requests (admin)
export const getAllRequests = async () => {
  const { data } = await api.get('/requests');
  return data;
};

// Update request status (admin)
export const updateRequestStatus = async (id, status) => {
  const { data } = await api.put(`/requests/${id}`, { status });
  return data;
};