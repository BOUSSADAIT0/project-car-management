const Request = require('../models/Request');
const Vehicle = require('../models/Vehicle');

// @desc    Créer une nouvelle demande
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  try {
    const { vehicleId, requestType, startDate, endDate, message } = req.body;

    // Vérifier si le véhicule existe et est disponible
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    
    if (!vehicle.disponible) {
      return res.status(400).json({ message: 'Ce véhicule n\'est pas disponible' });
    }

    const request = await Request.create({
      user: req.user._id,
      vehicle: vehicleId,
      requestType,
      startDate: startDate || null,
      endDate: endDate || null,
      message: message || ''
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir toutes les demandes (admin)
// @route   GET /api/requests
// @access  Private/Admin
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate('user', 'name email')
      .populate('vehicle', 'make model year');
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir les demandes d'un utilisateur
// @route   GET /api/requests/myRequests
// @access  Private
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate('vehicle', 'make model year images status prix');
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour le statut d'une demande
// @route   PUT /api/requests/:id
// @access  Private/Admin
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    request.status = status;
    
    // Si la demande est acceptée et c'est un achat ou une location, mettre à jour la disponibilité du véhicule
    if (status === 'acceptée' && (request.requestType === 'achat' || request.requestType === 'location')) {
      const vehicle = await Vehicle.findById(request.vehicle);
      if (vehicle) {
        vehicle.disponible = false;
        await vehicle.save();
      }
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getUserRequests,
  updateRequestStatus
};