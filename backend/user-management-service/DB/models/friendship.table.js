// const Sequelize = require("sequelize");
// const sequelize = require("../sqldb");
// const User = require("./user.table.js");


import { Sequelize } from "sequelize";
import sequelize from "../sqldb.js";
import User from "./user.table.js";

const Friendship = sequelize.define("friendships", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    }
    // friend_a_id: {
    //     type: Sequelize.STRING
    // },
    // friend_b_id: {
    //     type: Sequelize.STRING
    // }
  });
  
  Friendship.belongsTo(User, { foreignKey: "friend_a_id", targetKey: "firebase_doc_ref" });
  Friendship.belongsTo(User, { foreignKey: "friend_b_id", targetKey: "firebase_doc_ref" });
  
  // module.exports = Friendship;
export default Friendship;