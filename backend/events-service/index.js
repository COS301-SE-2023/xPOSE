const app = require('./app');
const {sequelize} = require('./data-access/sequelize');
// simple config
const PORT = 8004;

sequelize
.sync({ force: false })
.then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
        console.log(`Server running on Port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
    console.error('Failed to connect to database');
})

