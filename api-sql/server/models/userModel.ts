import { Sequelize, DataTypes } from 'sequelize';
import { User } from '../interfaces/models/user';

import link from '../config/database'

const userSchema = link.define<User>('User', {
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