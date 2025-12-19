const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Connected Successfully');
    
    // Create tables
    await createTables();
    
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    process.exit(1);
  }
};

// Create all necessary tables
const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPropertiesTable = `
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(12,2) NOT NULL,
      location VARCHAR(255),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      zipcode VARCHAR(20),
      bedrooms INTEGER,
      bathrooms INTEGER,
      square_feet INTEGER,
      property_type VARCHAR(100),
      status VARCHAR(50) DEFAULT 'available',
      image_url TEXT,
      images TEXT[],
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      broker_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createBrokersTable = `
    CREATE TABLE IF NOT EXISTS brokers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      license_number VARCHAR(100),
      bio TEXT,
      image_url TEXT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createPropertiesTable);
    await pool.query(createBrokersTable);
    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
};

module.exports = { pool, connectDB };