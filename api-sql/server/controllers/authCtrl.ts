import { Post, Get, Route, Body, Request } from "tsoa"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import md5 from 'md5'

import userModel from '../models/userModel'
import sendMail from '../utils/sendMail'
import { validEmail } from '../utils/valid'
import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../utils/generateToken'
import { registerResponse, registerParams } from '../interfaces/auth/register'
import { loginParams, loginResponse } from '../interfaces/auth/login'
import { activeParams, activeResponse } from '../interfaces/auth/active'
import { refreshTokenRequest, refreshTokenResponse } from '../interfaces/auth/refreshToken'
import { IGgPayload, googleLoginParams, googleLoginResponse } from '../interfaces/auth/google'
import { forgotPasswordParams, forgotPasswordResponse } from '../interfaces/auth/forgotPassword'
import { resetPasswordParams, resetPasswordResponse } from '../interfaces/auth/resetPassword'
import { IDecodedToken } from '../interfaces/auth/token'
import { User } from '../interfaces/models/user'

@Route("/api/auth")
export class authCtrl {
    @Post("/register")
    public async register (@Body() body :registerParams ): Promise<registerResponse> {
        try {
            const { name, account , password } = body
            const user = userModel.findByPk(account)
            
            if(!user) {
                return {
                    msg: 'Email or Phone number already exists.',
                    status: 500
                }
            }

            const passwordhash = await bcrypt.hash(password, 12)

            const newUser: User = userModel.build({
                name,
                account,
                password: passwordhash,
                role: 'admin',
                type: 'normal',
                reset_token: ''
            })

            const active_token = generateActiveToken({ newUser })

            const url = `${process.env.BASE_URL}/active/${active_token}`

            if (validEmail(account)) {               
                const html = '<h1>Bonjour</h1><p>Merci de valider votre compte <a href="' + url + '">en cliquant ici</a></p>'
                sendMail(account, "Active your account", html)
            
                return {
                    msg: 'Bravo ! Vous avez reçu un email pour activer votre compte.',
                    status: 200
                }
            } else {
                return {
                    msg: "Vos informations ne nous permettent pas de créer le compte.",
                    status: 500
                }
            }
        } catch (error:any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Post("/login")
    public async login (@Body() body: loginParams ): Promise<loginResponse> {
        try {
            const { account, password } = body
            const user = await userModel.findOne({
                where: {account}
            })

            if(!user) {
                return {
                    msg: "Ce compte n'existe pas.",
                    status: 400
                }
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return {
                    msg: "Mot de passe incorrecte.",
                    status: 400
                }
            }

            const access_token = generateAccessToken({ id: user.id })
            const refresh_token = generateRefreshToken({ id: user.id })

            return {
                msg: "Login Success!",
                status: 200,
                access_token,
                refresh_token,
                user
            }

        } catch (error:any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Post("/active")
    public async activeAccount (@Body() body: activeParams ): Promise<activeResponse> {
        try {
            const { active_token } = body
            const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
            const { newUser } = decoded
    
            if(!newUser) {
                return {
                    msg: "Invalid authentication.",
                    status: 400
                }
            }
            
            const user = await userModel.findOne({
                where: {
                    account: newUser.account
                }
            })

            if (user) {
                return {
                    msg: "Ce user existe déjà.",
                    status: 400
                }
            }
            
            userModel.create({...newUser})

            return {
                msg: "Account has been activated!",
                status: 200
            }
    
        } catch (err:any) {
            return {
                msg: err.message,
                status: 500
            }
        }
    }
    @Get("/logout")
    public logout() : void {
    }
    @Get("/refresh_token")
    public async refreshToken (@Request() req: refreshTokenRequest): Promise<refreshTokenResponse> {
        try {
            const rf_token = req.cookies.refreshtoken
            
            if (!rf_token) {
                return{
                    msg: "Merci de vous authentifier !",
                    status: 500
                }
            }

            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)

            if (!decoded) {
                return {
                    msg: "Merci de vous authentifier",
                    status: 500
                }
            }

            const user = await userModel.findByPk(decoded.id)

            if (!user) {
                return {
                    msg: "Ce compte n'existe pas !",
                    status: 500
                }
            }

            const access_token = generateAccessToken({id: user.id})
            console.log(access_token)

            return {
                status: 200,
                access_token,
                user
            }

        } catch (error:any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Post("/google_login")
    public async googleLogin (@Body() body : googleLoginParams ): Promise<googleLoginResponse> {
        try {
            const { id_token } = body
            const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`)
            
            const verify = await client.verifyIdToken({ 
                idToken: id_token,
                audience: `${process.env.GOOGLE_CLIENT_ID}`
            })

            const { email, email_verified, name, picture } = <IGgPayload>verify.getPayload()

            if (!email_verified) {
                return {
                    msg: "Email verification failed.",
                    status: 500
                }
            }

            const password = email + process.env.GOOGLE_SALT
            const passwordHash = await bcrypt.hash(password, 12)
            const user = await userModel.findByPk(email)
    
            if (user) {
                const access_token = generateAccessToken({ id: user.id })
                const refresh_token = generateRefreshToken({id: user.id})

                return {
                    msg: "Login Success!",
                    status: 200,
                    access_token,
                    refresh_token,
                    user
                }

            } else {
                const user = {
                    name,
                    account: email, 
                    password: passwordHash, 
                    avatar: picture,
                    type: 'Google',
                }
                
                const newUser = userModel.build(user)
                await newUser.save()

                const access_token = generateAccessToken({id: newUser.id})
                const refresh_token = generateRefreshToken({id: newUser.id})

                return {
                    msg: "Login Success!",
                    status: 200,
                    access_token,
                    refresh_token,
                    user
                }
            }
          
        } catch (err: any) {
          return {
              msg: err.message,
              status: 500
          }
        }
    }
    @Post("/forgot_password")
    public async forgot_password (@Body() body : forgotPasswordParams ): Promise<forgotPasswordResponse> {
        try {
            const { account } = body

            const user = await userModel.findOne({
                where: {account}
            })
    
            if (user) {
                if (user.type === "normal") {
                    const reset_token = md5(account)
                    
                    await userModel.update({
                        reset_token
                    }, {where : {id: user.id}})

                    const url = `${process.env.BASE_URL}/reset_password/${reset_token}`
                    const html = '<h1>Bonjour</h1><p>Pour mettre à jour votre mot de passe <a href="' + url + '">cliquer ici</a></p><p>Vous avez 24h</p>'
                    sendMail(account, "Reset password", html)
                    return {
                        msg: 'Un mail vous a été envoyé avec les instructions pour reinitialiser votre mot de passe',
                        status: 200
                    }
                } else {
                    return {
                        msg: "Cet utilisateur ne peut pas reinitialiser son mot de passe",
                        status: 500
                    }
                }
            } else {
                return {
                    msg: "Cet utilisateur n'existe pas",
                    status: 500
                }
            }
        
        } catch (err: any) {
            return {
                msg: err.message,
                status: 500
            }
        }
    }
    @Post("/reset_password/:reset_token")
    public async reset_password (@Body() body : resetPasswordParams ): Promise<resetPasswordResponse> {
        try {
            const { account, password, cf_password } = body
            const { reset_token } = body

            const user = await userModel.findOne({ where: { account , reset_token }})    
            if (user) {
                const passwordhash = await bcrypt.hash(password, 12)

                await userModel.update({
                    password: passwordhash,
                    reset_token: ""
                }, { where: {_id: user.id}})

                return {
                    msg: 'Votre mot de passe a bien été mis à jour. Vous pouvez à présent vous connecter avec celui-ci',
                    status: 200
                }
            } else {
                return {
                    msg: "Les infos envoyées n'ont pas permis de mettre à jour le mot de passe",
                    status: 500
                }
            }
        } catch (err: any) {
            return {
                msg: err.message,
                status: 500
            }
        }
    }
}

export default authCtrl;