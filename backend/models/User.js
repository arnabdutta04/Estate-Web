const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: {
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: "Email already registered",
      },
      validate: {
        notEmpty: { msg: "Email is required" },
        isEmail: { msg: "Please provide a valid email" },
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: "Phone number already registered",
      },
      validate: {
        notEmpty: { msg: "Phone number is required" },
        is: {
          args: /^\+\d{1,4}\d{10}$/,
          msg: "Please provide a valid phone number with country code",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        len: {
          args: [6],
          msg: "Password must be at least 6 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("customer", "broker", "admin"),
      defaultValue: "customer",
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["phone"] },
      { fields: ["role"] },
    ],
  }
);

// Hash password before creating user
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hash password before updating user
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;