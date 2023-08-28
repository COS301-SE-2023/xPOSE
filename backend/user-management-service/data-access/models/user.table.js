// const Sequelize = require("sequelize");
// const sequelize = require("../sqldb.js");

import {Sequelize } from "sequelize";
import sequelize from "../../sqldb.js";

const User = sequelize.define("users", {
  firebase_doc_ref: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      userName: {
        type: Sequelize.STRING,
        allowNull:false
      },
});
// module.exports = User
export default User;