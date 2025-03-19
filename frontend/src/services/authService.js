import api from './api';

// Login user
export const loginUser = async (email, password) => {
  const { data } = await api.post('/users/login', { email, password });
  return data;
};

// Register user
export const registerUser = async (name, email, password) => {
  const { data } = await api.post('/users', { name, email, password });
  return data;
};

// Get user profile
export const getUserProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

// Update user profile
export const updateUserProfile = async (user) => {
  const { data } = await api.put('/users/profile', user);
  return data;
};

// Get all users (admin)
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// Delete user (admin)
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
  return { success: true };
};

// Get user details (admin)
export const getUserDetails = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// Update user (admin)
export const updateUser = async (id, user) => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};