const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// Servir les fichiers statiques depuis le répertoire 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint non trouvé' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});