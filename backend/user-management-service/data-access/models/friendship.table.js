// const Sequelize = require("sequelize");
// const sequelize = require("../sqldb");
// const User = require("./user.table.js");


import { Sequelize } from "sequelize";
import sequelize from "../../sqldb.js";
import User from "./user.table.js";

const Friendship = sequelize.define("friendships", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Status: {
      type: Sequelize.STRING,
      defaultValue: 'Pending'
    }
  });
  // Friendship.belongsToMany(User, {through: Friendship, as: 'Friends', foreignKey:"firebase_doc_ref"});
  Friendship.belongsTo(User, { foreignKey: "userID1" });
  Friendship.belongsTo(User, { foreignKey: "userID2" });
  
  // module.exports = Friendship;
export default Friendship;