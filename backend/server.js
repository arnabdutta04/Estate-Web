const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, testConnection, syncDatabase } = require('./src/config/database');

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration - Allow your frontend
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app', // Replace with your Vercel URL
    'http://localhost:3000' // Remove this line if you don't want localhost
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check - IMPORTANT for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: sequelize.authenticate() ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Real Estate API - Production',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      brokers: '/api/brokers',
      messages: '/api/messages',
      contact: '/api/contact'
    }
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/properties', require('./src/routes/propertyRoutes'));
app.use('/api/brokers', require('./src/routes/brokerRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log('📍 Environment:', process.env.NODE_ENV || 'production');
    
    // Connect to database
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Cannot start - database connection failed');
      process.exit(1);
    }

    // Sync database
    await syncDatabase();

    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Health: http://localhost:${PORT}/health`);
      console.log(`📡 Ready to accept requests`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📡 SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

startServer();

module.exports = app;