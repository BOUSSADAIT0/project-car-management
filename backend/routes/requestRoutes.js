const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getUserRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Créer une nouvelle demande
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - requestType
 *             properties:
 *               vehicleId:
 *                 type: string
 *               requestType:
 *                 type: string
 *                 enum: [achat, location, information]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Véhicule non trouvé
 *   get:
 *     summary: Obtenir toutes les demandes (admin)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
router.route('/')
  .post(protect, createRequest)
  .get(protect, admin, getRequests);

/**
 * @swagger
 * /api/requests/myRequests:
 *   get:
 *     summary: Obtenir les demandes d'un utilisateur
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demandes récupérées avec succès
 *       401:
 *         description: Non autorisé
 */
router.route('/myRequests')
  .get(protect, getUserRequests);

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Mettre à jour le statut d'une demande (admin)
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la demande
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [en attente, acceptée, refusée]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Demande non trouvée
 */
router.route('/:id')
  .put(protect, admin, updateRequestStatus);

module.exports = router;