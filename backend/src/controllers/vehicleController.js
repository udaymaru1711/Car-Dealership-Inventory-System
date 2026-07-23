const db = require('../config/dbWrapper');

/**
 * Add a new vehicle
 * POST /api/vehicles
 */
const createVehicle = async (req, res) => {
  try {
    const { make, model, year, category, price, quantity, image_url, description } = req.body;

    // Validation
    if (!make || !model || !year || !category || price === undefined) {
      return res.status(400).json({ error: 'Make, model, year, category, and price are required' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const vehicleQuantity = quantity !== undefined ? parseInt(quantity) : 0;
    if (isNaN(vehicleQuantity) || vehicleQuantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
    }

    const result = await db.query(
      `INSERT INTO vehicles (make, model, year, category, price, quantity, image_url, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        make.trim(),
        model.trim(),
        parseInt(year),
        category.trim(),
        parseFloat(price),
        vehicleQuantity,
        image_url || null,
        description || null
      ]
    );

    return res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.error('Create Vehicle Error:', error);
    return res.status(500).json({ error: 'Internal server error while creating vehicle' });
  }
};

/**
 * Get all available vehicles
 * GET /api/vehicles
 */
const getAllVehicles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vehicles ORDER BY id DESC');
    return res.status(200).json({
      count: result.rows.length,
      vehicles: result.rows
    });
  } catch (error) {
    console.error('Get Vehicles Error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching vehicles' });
  }
};

/**
 * Search vehicles by make, model, category, or price range
 * GET /api/vehicles/search
 */
const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const filters = {};
    if (make) filters.make = make.trim();
    if (model) filters.model = model.trim();
    if (category) filters.category = category.trim();
    if (minPrice && !isNaN(minPrice)) filters.minPrice = parseFloat(minPrice);
    if (maxPrice && !isNaN(maxPrice)) filters.maxPrice = parseFloat(maxPrice);

    // Memory fallback execution
    let vehicles = db.searchInMemoryVehicles(filters);

    // If PostgreSQL DB query is active
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (make) {
      conditions.push(`make ILIKE $${paramIndex++}`);
      values.push(`%${make.trim()}%`);
    }

    if (model) {
      conditions.push(`model ILIKE $${paramIndex++}`);
      values.push(`%${model.trim()}%`);
    }

    if (category) {
      conditions.push(`category ILIKE $${paramIndex++}`);
      values.push(category.trim());
    }

    if (minPrice && !isNaN(minPrice)) {
      conditions.push(`price >= $${paramIndex++}`);
      values.push(parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
      conditions.push(`price <= $${paramIndex++}`);
      values.push(parseFloat(maxPrice));
    }

    let sql = 'SELECT * FROM vehicles';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY price ASC';

    const dbResult = await db.query(sql, values);
    if (dbResult.rows.length > 0) {
      vehicles = dbResult.rows;
    }

    return res.status(200).json({
      count: vehicles.length,
      filters,
      vehicles
    });
  } catch (error) {
    console.error('Search Vehicles Error:', error);
    return res.status(500).json({ error: 'Internal server error while searching vehicles' });
  }
};

/**
 * Update vehicle details
 * PUT /api/vehicles/:id
 */
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, category, price, quantity, image_url, description } = req.body;

    const existing = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const current = existing.rows[0];

    const updatedMake = make !== undefined ? make.trim() : current.make;
    const updatedModel = model !== undefined ? model.trim() : current.model;
    const updatedYear = year !== undefined ? parseInt(year) : current.year;
    const updatedCategory = category !== undefined ? category.trim() : current.category;
    const updatedPrice = price !== undefined ? parseFloat(price) : parseFloat(current.price);
    const updatedQuantity = quantity !== undefined ? parseInt(quantity) : current.quantity;
    const updatedImageUrl = image_url !== undefined ? image_url : current.image_url;
    const updatedDescription = description !== undefined ? description : current.description;

    const result = await db.query(
      `UPDATE vehicles 
       SET make = $1, model = $2, year = $3, category = $4, price = $5, quantity = $6, image_url = $7, description = $8 
       WHERE id = $9 RETURNING *`,
      [
        updatedMake,
        updatedModel,
        updatedYear,
        updatedCategory,
        updatedPrice,
        updatedQuantity,
        updatedImageUrl,
        updatedDescription,
        id
      ]
    );

    return res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.error('Update Vehicle Error:', error);
    return res.status(500).json({ error: 'Internal server error while updating vehicle' });
  }
};

/**
 * Delete a vehicle (Admin only)
 * DELETE /api/vehicles/:id
 */
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    await db.query('DELETE FROM vehicles WHERE id = $1', [id]);

    return res.status(200).json({
      message: 'Vehicle deleted successfully',
      deletedVehicleId: parseInt(id)
    });
  } catch (error) {
    console.error('Delete Vehicle Error:', error);
    return res.status(500).json({ error: 'Internal server error while deleting vehicle' });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle
};
