// const Sequelize = require("sequelize");
// const sequelize = require("../sqldb.js");

import { Sequelize } from "sequelize";
import sequelize from "../../sqldb.js";

const User = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firebase_doc_ref: {
        type: Sequelize.STRING,
        unique: true, // Add this line to define the column as unique
        allowNull: false, // If the column is required, add this line
      }
});
// module.exports = User
export default User;