const { Sequelize } = require('sequelize');
require('dotenv').config();

// PRODUCTION-ONLY CONFIGURATION
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false, // Disable SQL logging in production
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Check your DATABASE_URL environment variable');
    return false;
  }
};

// Sync models
const syncDatabase = async () => {
  try {
    // Use alter instead of force to preserve data
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synced');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  Sequelize
};