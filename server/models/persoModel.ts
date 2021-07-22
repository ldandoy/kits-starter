import mongoose, { Schema } from 'mongoose'

const persoSchema = new mongoose.Schema({
    age: {
        type: String,
        trim: true,
    }, 
    name: {
        type: String,
        trim: true,
        unique: true
    }, 
    race: {
        type: String
    }, 
    classe: {
        type: String
    }, 
    alignement: {
        type: String
    }, 
    taille : {
        type: String,
        trim: true,
    }, 
    poids: {
        type: String,
        trim: true,
    }, 
    niveau: {
        type: String
    }, 
    bonusMaitrise: {
        type: String
    }, 
    pdv: {
        type: String
    }, 
    force: {
        type: String
    }, 
    dexterite: {
        type: String
    }, 
    constitution: {
        type: String
    }, 
    intelligence: {
        type: String
    }, 
    sagesse: {
        type: String
    },
    charisme: {
        type: String
    }, 
    gold: {
        type: Number
    },
    ca: {
        type: String
    },
    competences: [{
        type: String
    }],
    equipements: [{
        type: String
    }],
    armes: [{
        name: String,
        degat: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    last_step: {
        type: Schema.Types.ObjectId,
        ref: 'Step'
    }
})

export default mongoose.model('Perso', persoSchema)