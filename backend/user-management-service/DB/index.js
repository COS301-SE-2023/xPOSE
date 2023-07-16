import sequelize from './sqldb.js';
import User from './models/user.table.js';
import Friendship from './models/friendship.table.js';
import FriendRequest from './models/friend_request.table.js';


const initializeSQLDB = async () => { 
  try {
    // create tables if they do not exist
    sequelize.sync({});
    console.log("Success");
  } catch (err) {
    if (err.name === 'SequelizeDatabaseError' && err.parent) {
      const { code, errno, sqlState, sqlMessage, sql } = err.parent;
      console.log('Foreign Key Error:');
      console.log('Code:', code);
      console.log('Errno:', errno);
      console.log('SQL State:', sqlState);
      console.log('Message:', sqlMessage);
      console.log('SQL Query:', sql);
    } else {
      console.log('An error occurred:', err);
    }
  }
}
initializeSQLDB();

export default initializeSQLDB;

/*sequelize.sync({})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    if (err.name === 'SequelizeDatabaseError' && err.parent) {
      const { code, errno, sqlState, sqlMessage, sql } = err.parent;
      console.log('Foreign Key Error:');
      console.log('Code:', code);
      console.log('Errno:', errno);
      console.log('SQL State:', sqlState);
      console.log('Message:', sqlMessage);
      console.log('SQL Query:', sql);
    } else {
      console.log('An error occurred:', err);
    }
  });*/


