const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// All vehicle endpoints require valid authentication token
router.use(verifyToken);

// POST /api/vehicles - Add new vehicle
router.post('/', createVehicle);

// GET /api/vehicles - List all available vehicles
router.get('/', getAllVehicles);

// GET /api/vehicles/search - Search for vehicles by make, model, category, or price range
router.get('/search', searchVehicles);

// PUT /api/vehicles/:id - Update vehicle details
router.put('/:id', updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle (Admin only)
router.delete('/:id', requireAdmin, deleteVehicle);

module.exports = router;
