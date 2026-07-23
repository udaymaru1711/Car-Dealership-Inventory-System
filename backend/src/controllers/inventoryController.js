const db = require('../config/dbWrapper');

/**
 * Purchase a vehicle (Decrements quantity in stock)
 * POST /api/vehicles/:id/purchase
 */
const purchaseVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : 1;
    const purchaseQty = req.body.quantity ? parseInt(req.body.quantity) : 1;

    if (isNaN(purchaseQty) || purchaseQty <= 0) {
      return res.status(400).json({ error: 'Purchase quantity must be a positive integer' });
    }

    // Check if vehicle exists
    const vehicleResult = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicle = vehicleResult.rows[0];

    // Check stock availability
    if (vehicle.quantity < purchaseQty) {
      return res.status(400).json({
        error: vehicle.quantity === 0 ? 'Vehicle is currently out of stock' : `Only ${vehicle.quantity} unit(s) available in stock`,
        availableQuantity: vehicle.quantity
      });
    }

    // Decrement vehicle stock
    const updateResult = await db.query(
      'UPDATE vehicles SET quantity = quantity - $1 WHERE id = $2 RETURNING *',
      [purchaseQty, id]
    );

    const updatedVehicle = updateResult.rows[0];
    const totalPrice = parseFloat(vehicle.price) * purchaseQty;

    // Record purchase transaction
    const purchaseResult = await db.query(
      'INSERT INTO purchases (user_id, vehicle_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, id, purchaseQty, totalPrice]
    );

    return res.status(200).json({
      message: 'Vehicle purchased successfully',
      purchase: purchaseResult.rows[0],
      vehicle: updatedVehicle
    });
  } catch (error) {
    console.error('Purchase Vehicle Error:', error);
    return res.status(500).json({ error: 'Internal server error while purchasing vehicle' });
  }
};

/**
 * Restock a vehicle (Increases quantity in stock - Admin only)
 * POST /api/vehicles/:id/restock
 */
const restockVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const restockQty = req.body.quantity ? parseInt(req.body.quantity) : 1;

    if (isNaN(restockQty) || restockQty <= 0) {
      return res.status(400).json({ error: 'Restock quantity must be a positive integer' });
    }

    // Check if vehicle exists
    const vehicleResult = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Increment vehicle stock
    const updateResult = await db.query(
      'UPDATE vehicles SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
      [restockQty, id]
    );

    return res.status(200).json({
      message: 'Vehicle restocked successfully',
      vehicle: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Restock Vehicle Error:', error);
    return res.status(500).json({ error: 'Internal server error while restocking vehicle' });
  }
};

module.exports = {
  purchaseVehicle,
  restockVehicle
};
