const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For Render.com hosted databases
    },
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Database connected successfully");

    // Sync models (create tables if they don't exist)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database tables synchronized");
    } else {
      // In production, use migrations instead of sync
      await sequelize.sync();
    }
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };