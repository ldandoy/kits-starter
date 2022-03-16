import { Request, Response, NextFunction } from 'express'
import {validPhone, validEmail} from '../utils/valid'

export const validRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { name, account, password } = req.body

    const errors = []

    if (!name) {
        errors.push('Ajouter votre nom')
    } else if (name.length > 20) {
        errors.push('Votre nom ne peut dépasser 20 caractères')
    }

    if (!account) {
        errors.push({ msg: '' })
    } else if (!validPhone(account) && !validEmail(account)) {
        errors.push('Votre email ou votre numéro de téléphone est mal formaté')
    }

    if (!password || password.length < 6) {
        errors.push("Votre mot de passe doit avoir au moins 6 caractères")
    }

    if (errors.length > 0) return res.status(400).json({msg: errors})
    
    next()
}