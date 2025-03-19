const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - user
 *         - vehicle
 *         - requestType
 *       properties:
 *         user:
 *           type: string
 *           description: ID de l'utilisateur
 *         vehicle:
 *           type: string
 *           description: ID du véhicule
 *         requestType:
 *           type: string
 *           enum: ['achat', 'location', 'information']
 *           description: Type de demande
 *         startDate:
 *           type: string
 *           format: date
 *           description: Date de début (pour location)
 *         endDate:
 *           type: string
 *           format: date
 *           description: Date de fin (pour location)
 *         status:
 *           type: string
 *           enum: ['en attente', 'acceptée', 'refusée']
 *           description: Statut de la demande
 *         message:
 *           type: string
 *           description: Message de l'utilisateur
 */
const requestSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle'
  },
  requestType: {
    type: String,
    required: true,
    enum: ['achat', 'location', 'information']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['en attente', 'acceptée', 'refusée'],
    default: 'en attente'
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);