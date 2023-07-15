const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  port: process.env.DATABASE_PORT
});

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Event = sequelize.define('event', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  image_url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  privacy_setting: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  start_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  end_date: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

const EventParticipant = sequelize.define('eventParticipant', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

const EventInvitation = sequelize.define('eventInvitation', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  response: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

const EventJoinRequest = sequelize.define('eventJoinRequest', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  response: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

// Associations
User.hasMany(Event, { foreignKey: 'owner_id_fk', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'owner_id_fk', onDelete: 'CASCADE' });

User.belongsToMany(Event, {
  through: EventParticipant,
  foreignKey: 'user_id_fk',
  otherKey: 'event_id_fk',
  onDelete: 'CASCADE',
});

Event.belongsToMany(User, {
  through: EventParticipant,
  foreignKey: 'event_id_fk',
  otherKey: 'user_id_fk',
  onDelete: 'CASCADE',
});

User.belongsToMany(Event, {
  through: EventInvitation,
  foreignKey: 'user_id_fk',
  otherKey: 'event_id_fk',
  onDelete: 'CASCADE',
});

Event.belongsToMany(User, {
  through: EventInvitation,
  foreignKey: 'event_id_fk',
  otherKey: 'user_id_fk',
  onDelete: 'CASCADE',
});

User.belongsToMany(Event, {
  through: EventJoinRequest,
  foreignKey: 'user_id_fk',
  otherKey: 'event_id_fk',
  onDelete: 'CASCADE',
});

Event.belongsToMany(User, {
  through: EventJoinRequest,
  foreignKey: 'event_id_fk',
  otherKey: 'user_id_fk',
  onDelete: 'CASCADE',
});

module.exports = { User, Event, EventParticipant, EventInvitation, EventJoinRequest, sequelize };
