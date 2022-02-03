import mongoose, { Schema } from 'mongoose'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: objectId
 *           description: The user ID.
 *           example: sqdsqd
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: jvhsdcb
 *         account:
 *           type: string
 *           description: The user's email.
 *           example: ldandoy@gmail.com
 *         password:
 *           description: The user's password.
 *           type: string
 *         avatar:
 *           type: string
 *         role:
 *           type: string
 *           description: The user's role (admin or user).
 *         type:
 *           type: string
 *           description: (normal or fast).
 *         reset_token:
 *           type: string
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ajouter votre nom'],
        trim: true,
        maxLength:[20, "Votre nom ne peut dépasser 20 caractères"]
    },
    account: {
        type: String,
        required: [true, 'Entrez votre email'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Entrez votre mot de passe'],
        trim: true,
        min:[6, "Votre mot de passe doit avoir au moins 6 caractères"]
    },
    avatar: {
        type: String,
        trim: true,
        default: ''
    },
    role: {
        type: String,
        default: 'user' // [user, admin]
    },
    type: {
        type: String,
        default: 'normal' // [normal, fast]
    },
    reset_token: {
        type: String,
        default: ''
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

export default mongoose.model('User', userSchema)