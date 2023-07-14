/*const Sequelize = require("sequelize");
const sequelize = require("../sqldb");
const User = require("./user.table.js");*/


import { Sequelize } from "sequelize";
import sequelize from "../sqldb.js";
import User from "./user.table.js";

const Friend_request = sequelize.define("friend_requests", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    response: {
      type: Sequelize.STRING
    }
    // friend_a_id: {
    //     type: Sequelize.STRING
    // },
    // friend_b_id: {
    //     type: Sequelize.STRING
    // }
  });
  
  Friend_request.belongsTo(User, { foreignKey: "friend_a_id", targetKey: "firebase_doc_ref" });
  Friend_request.belongsTo(User, { foreignKey: "friend_b_id", targetKey: "firebase_doc_ref" });
  
  // module.exports = Friend_request;
export default Friend_request;