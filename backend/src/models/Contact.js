const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Optional - if user is logged in'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name is required'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General Inquiry'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Message is required'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied', 'closed'),
    defaultValue: 'new',
    allowNull: false
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin reply to contact'
  },
  repliedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  repliedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin who replied'
  }
}, {
  tableName: 'contacts',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['email']
    }
  ]
});

module.exports = Contact;