const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - make
 *         - model
 *         - year
 *         - fuel_type
 *       properties:
 *         make:
 *           type: string
 *           description: Marque du véhicule
 *         model:
 *           type: string
 *           description: Modèle du véhicule
 *         year:
 *           type: number
 *           description: Année de fabrication
 *         city_mpg:
 *           type: number
 *           description: Consommation en ville (mpg)
 *         class:
 *           type: string
 *           description: Classe du véhicule
 *         combination_mpg:
 *           type: number
 *           description: Consommation combinée (mpg)
 *         cylinders:
 *           type: number
 *           description: Nombre de cylindres
 *         displacement:
 *           type: number
 *           description: Cylindrée
 *         drive:
 *           type: string
 *           description: Type de transmission
 *         fuel_type:
 *           type: string
 *           description: Type de carburant
 *         highway_mpg:
 *           type: number
 *           description: Consommation sur autoroute (mpg)
 *         transmission:
 *           type: string
 *           description: Type de boîte de vitesse
 *         disponible:
 *           type: boolean
 *           description: Disponibilité du véhicule
 *         status:
 *           type: string
 *           enum: ['à vendre', 'à louer', 'à acheter']
 *           description: Statut du véhicule
 *         prix:
 *           type: number
 *           description: Prix du véhicule
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Chemins des images du véhicule
 */
const vehicleSchema = mongoose.Schema({
  city_mpg: {
    type: Number
  },
  class: {
    type: String
  },
  combination_mpg: {
    type: Number
  },
  cylinders: {
    type: Number
  },
  displacement: {
    type: Number
  },
  drive: {
    type: String
  },
  fuel_type: {
    type: String,
    required: true
  },
  highway_mpg: {
    type: Number
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  transmission: {
    type: String
  },
  year: {
    type: Number,
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['à vendre', 'à louer', 'à acheter'],
    default: 'à vendre'
  },
  prix: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);