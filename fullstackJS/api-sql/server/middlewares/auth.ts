import { Response, NextFunction} from 'express'
import Users from '../models/userModel'
import jwt from 'jsonwebtoken'
import { IReqAuth } from '../interfaces/common/request'
import { IDecodedToken } from '../interfaces/auth/token'

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        const decoded = <IDecodedToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
        if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})

        const user = await Users.findOne({
            where:{
                id: decoded.id
            }
        })
        if(!user) return res.status(400).json({msg: "User does not exist."})

        req.user = user;

        next()
    } catch (err: any) {
        return res.status(500).json({msg: err.message})
    }
}

export default auth;