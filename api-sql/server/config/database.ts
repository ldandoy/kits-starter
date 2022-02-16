import { Sequelize } from 'sequelize';

const URI = process.env.BDD_URL

const sequelize = new Sequelize(`${URI}`, {query:{raw:true}})

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;
