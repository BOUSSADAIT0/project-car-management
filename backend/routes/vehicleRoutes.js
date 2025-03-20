const express = require('express');
const router = express.Router();
const { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Obtenir tous les véhicules
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Mot-clé de recherche
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des véhicules récupérée avec succès
 *   post:
 *     summary: Créer un véhicule (admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - make
 *               - model
 *               - year
 *               - fuel_type
 *               - prix
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               city_mpg:
 *                 type: number
 *               class:
 *                 type: string
 *               combination_mpg:
 *                 type: number
 *               cylinders:
 *                 type: integer
 *               displacement:
 *                 type: number
 *               drive:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               highway_mpg:
 *                 type: number
 *               transmission:
 *                 type: string
 *               disponible:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [à vendre, à louer, à acheter]
 *               prix:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Véhicule créé avec succès
 *       401:
 *         description: Non autorisé
 */
router.route('/')
  .get(getVehicles)
  .post(protect, admin, createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Obtenir un véhicule par ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Véhicule récupéré avec succès
 *       404:
 *         description: Véhicule non trouvé
 *   put:
 *     summary: Mettre à jour un véhicule (admin)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du véhicule
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               city_mpg:
 *                 type: number
 *               class:
 *                 type: string
 *               combination_mpg:
 *                 type: number
 *               cylinders:
 *                 type: integer
 *               displacement:
 *                 type: number
 *               drive:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               highway_mpg:
 *                 type: number
 *               transmission:
 *                 type: string
 *               disponible:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [à vendre, à louer, à acheter]
 *               prix:
 *                 type: number
 *               keepImages:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Véhicule mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Véhicule non trouvé
 *   delete:
 *     summary: Supprimer un véhicule (admin)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du véhicule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Véhicule supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Véhicule non trouvé
 */
router.route('/:id')
  .get(getVehicleById)
  .put(protect, admin, updateVehicle)
  .delete(protect, admin, deleteVehicle);

module.exports = router;