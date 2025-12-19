const { pool } = require('../config/db');

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const {
      propertyType,
      listingType,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      condition,
      page = 1,
      limit = 12
    } = req.query;

    // Build WHERE clause
    let whereConditions = ["status = 'available'"];
    let params = [];
    let paramIndex = 1;

    if (propertyType) {
      whereConditions.push(`property_type = $${paramIndex}`);
      params.push(propertyType);
      paramIndex++;
    }

    if (listingType) {
      whereConditions.push(`listing_type = $${paramIndex}`);
      params.push(listingType);
      paramIndex++;
    }

    if (city) {
      whereConditions.push(`city ILIKE $${paramIndex}`);
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (condition) {
      whereConditions.push(`condition = $${paramIndex}`);
      params.push(condition);
      paramIndex++;
    }

    if (bedrooms) {
      whereConditions.push(`bedrooms >= $${paramIndex}`);
      params.push(parseInt(bedrooms));
      paramIndex++;
    }

    if (bathrooms) {
      whereConditions.push(`bathrooms >= $${paramIndex}`);
      params.push(parseInt(bathrooms));
      paramIndex++;
    }

    if (minPrice) {
      whereConditions.push(`price >= $${paramIndex}`);
      params.push(parseInt(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`price <= $${paramIndex}`);
      params.push(parseInt(maxPrice));
      paramIndex++;
    }

    if (minArea) {
      whereConditions.push(`square_feet >= $${paramIndex}`);
      params.push(parseInt(minArea));
      paramIndex++;
    }

    if (maxArea) {
      whereConditions.push(`square_feet <= $${paramIndex}`);
      params.push(parseInt(maxArea));
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');
    const offset = (page - 1) * limit;

    // Get properties
    const query = `
      SELECT * FROM properties 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM properties WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params.slice(0, -2)); // Remove limit and offset
    const total = parseInt(countResult.rows[0].count);

    res.json({
      properties: result.rows,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error in getProperties:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = result.rows[0];

    // Increment views
    await pool.query(
      'UPDATE properties SET views = views + 1 WHERE id = $1',
      [id]
    );

    res.json(property);
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Broker only)
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      property_type,
      listing_type,
      price,
      address,
      city,
      state,
      zipcode,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      condition,
      features,
      images,
      furnished,
      floors
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties 
       (title, description, property_type, listing_type, price, address, city, state, 
        zipcode, bedrooms, bathrooms, square_feet, year_built, condition, features, 
        images, furnished, floors, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'available') 
       RETURNING *`,
      [
        title,
        description,
        property_type,
        listing_type,
        price,
        address,
        city,
        state,
        zipcode,
        bedrooms,
        bathrooms,
        square_feet,
        year_built,
        condition,
        features,
        images,
        furnished,
        floors
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error in createProperty:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Broker/Owner only)
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      property_type,
      listing_type,
      price,
      address,
      city,
      state,
      zipcode,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      condition,
      features,
      images,
      status,
      furnished,
      floors
    } = req.body;

    const result = await pool.query(
      `UPDATE properties 
       SET title = $1, description = $2, property_type = $3, listing_type = $4, 
           price = $5, address = $6, city = $7, state = $8, zipcode = $9,
           bedrooms = $10, bathrooms = $11, square_feet = $12, year_built = $13,
           condition = $14, features = $15, images = $16, status = $17,
           furnished = $18, floors = $19, updated_at = CURRENT_TIMESTAMP
       WHERE id = $20 
       RETURNING *`,
      [
        title,
        description,
        property_type,
        listing_type,
        price,
        address,
        city,
        state,
        zipcode,
        bedrooms,
        bathrooms,
        square_feet,
        year_built,
        condition,
        features,
        images,
        status,
        furnished,
        floors,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in updateProperty:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Broker/Owner only)
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM properties WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property removed' });
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM properties 
       WHERE featured = true AND status = 'available' 
       ORDER BY created_at DESC 
       LIMIT 6`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error in getFeaturedProperties:', error);
    res.status(500).json({ message: error.message });
  }
};