// MODIFICATION: Correction du code qui possède une erreur "protect" non défini
const { protect } = require('./authMiddleware');

// backend/middleware/adminMiddleware.js
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Non autorisé, réservé aux administrateurs' });
  }
};
  
module.exports = { protect, admin };