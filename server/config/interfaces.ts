import {Document} from 'mongoose'
import { Request } from 'express'

export interface IUser extends Document {
    name: string,
    account: string,
    password: string,
    avatar: string,
    role: string,
    type: string,
    reset_token: string,
    persos: [any],
    perso: string
}

export interface IPerso extends Document {
    name: string,
    age: string,
    race: string,
    classe: string,
    alignement: string,
    taille: string,
    poids: string,
    niveau: string,
    bonusMaitrise: string,
    pdv: string,
    force: string,
    dexterite: string,
    constitution: string,
    intelligence: string,
    sagesse: string,
    charisme: string,
    gold: string,
    ca: string,
    competences: [string],
    equipements: [string],
    armes: [Armes],
    user: any
}

export interface INewUser {
    name: string,
    account: string,
    password: string
}

export interface IDecodedToken {
    id?: string
    newUser?: INewUser
    iat: Number
    exp:Number
}

export interface IGgPayload {
    email: string
    email_verified: boolean
    name: string
    picture: string
}

export interface IReqAuth extends Request {
    user?: IUser
}

export interface Armes {
    name: string,
    degat: string
}