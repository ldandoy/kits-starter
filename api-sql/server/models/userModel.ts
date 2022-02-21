import { Sequelize, DataTypes } from 'sequelize';
import { IUser } from '../config/interfaces';

const sequelize = new Sequelize('sqlite::memory:');

const userSchema = sequelize.define<IUser>('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },  
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' // [user, admin]
    }, 
    type: {
        type: DataTypes.STRING,        
        defaultValue: 'normal' // [normal, fast]
    },
    reset_token: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
}, {
    timestamps: true
});

export default userSchema;