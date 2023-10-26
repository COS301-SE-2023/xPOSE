import { Sequelize, DataTypes, Model } from 'sequelize';
import { config } from 'dotenv';

// Read database credentials from the .env file
config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

// Create a MySQL database instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

class user extends Model {}
user.init(
  {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    face_encoding: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    freezeTableName: true, // Prevent table name pluralization
    timestamps: false // Disable createdAt and updatedAt
  }
);

class event extends Model {}
event.init(
  {
    eid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    is_encrypted: {
      type: DataTypes.BOOLEAN,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'event',
    tableName: 'event',
    freezeTableName: true, // Prevent table name pluralization
    timestamps: false, // Disable createdAt and updatedAt
  }
);

class post extends Model {}
post.init(
  {
    pid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'post',
    tableName: 'post',
    freezeTableName: true, // Prevent table name pluralization
    timestamps: false, // Disable createdAt and updatedAt
    
  }
);

class posttaggeduser extends Model {}
posttaggeduser.init(
  {},
  {
    sequelize,
    modelName: 'posttaggeduser',
    tableName: 'posttaggeduser',
    freezeTableName: true, // Prevent table name pluralization
    timestamps: false, // Disable createdAt and updatedAt
  }
);

class collections extends Model {}
collections.init(
  {
    collection_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    collection_name: {
      type: DataTypes.STRING,
    },
    is_private: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'collections',
    tableName: 'collections',
    freezeTableName: true, // Prevent table name pluralization
    timestamps: false, // Disable createdAt and updatedAt
  }
);

class postscollection extends Model {}
postscollection.init(
  {},
  {
    sequelize,
    modelName: 'postscollection',
    tableName: 'postscollection',
    freezeTableName: true, // Prevent table name pluralization
    timestamps: false, // Disable createdAt and updatedAt
  }
);

user.hasMany(post, { foreignKey: 'post_owner_uid_id', onDelete: 'CASCADE' });
event.hasMany(post, { foreignKey: 'event_eid_id', onDelete: 'CASCADE' });
user.hasMany(posttaggeduser, { foreignKey: 'uid', onDelete: 'CASCADE' });
post.hasMany(posttaggeduser, { foreignKey: 'post_id', onDelete: 'CASCADE' });
user.hasMany(collections, { foreignKey: 'user_uid', onDelete: 'CASCADE' });
user.hasMany(postscollection, { foreignKey: 'user_uid', onDelete: 'CASCADE' });
collections.hasMany(postscollection, { foreignKey: 'collection_id', onDelete: 'CASCADE' });
post.hasMany(postscollection, { foreignKey: 'post_id', onDelete: 'CASCADE' });

const createTables = async () => {
  await sequelize.sync({ force: false }); // Use { force: true } to recreate tables (this drops existing tables)
  console.log('Tables created');
};

const closeConnection = () => {
  sequelize.close();
};

// Export the models and createTables function
export { user, event, post , posttaggeduser, collections, postscollection, createTables, closeConnection };
