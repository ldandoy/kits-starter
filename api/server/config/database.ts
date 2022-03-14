import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`, {query:{raw:true}})

// console.log(process.env.DATABASE_URL)

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.sync();
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize
