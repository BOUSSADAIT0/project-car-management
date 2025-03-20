const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserAdminStatus
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Routes existantes
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

// Nouvelle route pour mettre à jour le statut admin
router.put('/:id/admin', protect, admin, updateUserAdminStatus);

module.exports = router;