const Vehicle = require('../models/Vehicle');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/car_images/';
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Erreur: Images uniquement!');
    }
  }
}).array('images', 10);

// @desc    Obtenir tous les véhicules
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    // Filtres
    const keyword = req.query.keyword
      ? {
          $or: [
            { make: { $regex: req.query.keyword, $options: 'i' } },
            { model: { $regex: req.query.keyword, $options: 'i' } },
            { class: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    // Pagination
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const count = await Vehicle.countDocuments({ ...keyword });
    
    const vehicles = await Vehicle.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      vehicles,
      page,
      pages: Math.ceil(count / pageSize),
      count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir un véhicule par ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Véhicule non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer un véhicule
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res) => {
  try {
    const uploadMiddleware = (req, res) => {
      return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    };

    await uploadMiddleware(req, res);

    // Récupérer les chemins des images téléchargées
    const imagePaths = req.files ? req.files.map(file => `car_images/${file.filename}`) : [];

    const {
      make,
      model,
      year,
      city_mpg,
      class: vehicleClass,
      combination_mpg,
      cylinders,
      displacement,
      drive,
      fuel_type,
      highway_mpg,
      transmission,
      disponible,
      status,
      prix
    } = req.body;

    const vehicle = await Vehicle.create({
      make,
      model,
      year,
      city_mpg,
      class: vehicleClass,
      combination_mpg,
      cylinders,
      displacement,
      drive,
      fuel_type,
      highway_mpg,
      transmission,
      disponible: disponible === 'true',
      status,
      prix,
      images: imagePaths
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un véhicule
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res) => {
  try {
    const uploadMiddleware = (req, res) => {
      return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    };

    await uploadMiddleware(req, res);

    // Récupérer les chemins des nouvelles images téléchargées
    const newImagePaths = req.files ? req.files.map(file => `car_images/${file.filename}`) : [];

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    const {
      make,
      model,
      year,
      city_mpg,
      class: vehicleClass,
      combination_mpg,
      cylinders,
      displacement,
      drive,
      fuel_type,
      highway_mpg,
      transmission,
      disponible,
      status,
      prix,
      keepImages
    } = req.body;

    // Déterminer quelles images conserver
    let imagesToKeep = [];
    if (keepImages) {
      if (Array.isArray(keepImages)) {
        imagesToKeep = keepImages;
      } else {
        imagesToKeep = [keepImages];
      }
    }

    // Mettre à jour le véhicule
    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.city_mpg = city_mpg || vehicle.city_mpg;
    vehicle.class = vehicleClass || vehicle.class;
    vehicle.combination_mpg = combination_mpg || vehicle.combination_mpg;
    vehicle.cylinders = cylinders || vehicle.cylinders;
    vehicle.displacement = displacement || vehicle.displacement;
    vehicle.drive = drive || vehicle.drive;
    vehicle.fuel_type = fuel_type || vehicle.fuel_type;
    vehicle.highway_mpg = highway_mpg || vehicle.highway_mpg;
    vehicle.transmission = transmission || vehicle.transmission;
    vehicle.disponible = disponible !== undefined ? disponible === 'true' : vehicle.disponible;
    vehicle.status = status || vehicle.status;
    vehicle.prix = prix || vehicle.prix;
    
    // Mettre à jour les images
    vehicle.images = [...imagesToKeep, ...newImagePaths];

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un véhicule
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Véhicule supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  upload
};