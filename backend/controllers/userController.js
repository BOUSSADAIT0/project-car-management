const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'car_management_secret'; // En production, utilisez une variable d'environnement

// Générer un JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur existe déjà' });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Données utilisateur invalides' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authentifier un utilisateur
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier l'email de l'utilisateur
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir le profil utilisateur
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'Utilisateur supprimé' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Ajoutez cette nouvelle fonction au contrôleur utilisateur existant
// backend/controllers/userController.js

// Fonction à ajouter en bas du fichier userController.js, juste avant module.exports
// @desc    Mettre à jour le statut admin d'un utilisateur
// @route   PUT /api/users/:id/admin
// @access  Private/Admin
const updateUserAdminStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour du statut admin
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifiez l'objet d'export pour inclure la nouvelle fonction
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserAdminStatus
};

