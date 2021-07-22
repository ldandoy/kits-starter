import { Response } from 'express'
import { IReqAuth, IPerso } from '../config/interfaces'

import { lanceDe } from "../utils/aideJeu"
import persoModel from '../models/persoModel'
import stepModel from '../models/userModel'

const stepCtrl = {
    getLastStep: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({err: "Invalid Authentication."})

        console.log(req.user, req.user.perso)
        try {
            persoModel.findOne({_id: req.user.perso})
            .then((perso:IPerso) => {
                console.log(perso)
                return res.json(perso)
            })
        } catch (err: any) {
            return res.status(500).json({err: err.message})
        }
    }
}

export default stepCtrl;