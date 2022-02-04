import userModel from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import md5 from 'md5'
import { Post, Get, Route, Body, Path } from "tsoa"

import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../utils/generateToken'
import sendMail from '../utils/sendMail'
import { validEmail } from '../middlewares/valid'

import { IDecodedToken, IGgPayload } from '../config/interfaces'
import { registerResponse, registerParams } from '../config/interfaces/auth/register'
import { loginResponse, loginParams } from '../config/interfaces/auth/login'
import { activeResponse, activeParams } from '../config/interfaces/auth/active'
import { logoutResponse, logoutParams } from '../config/interfaces/auth/logout'
import { refreshTokenResponse, refreshTokenParams } from '../config/interfaces/auth/refreshToken'
import { forgotPasswordResponse, forgotPasswordParams } from '../config/interfaces/auth/forgotPassword'
import { resetPasswordResponse, resetPasswordParams } from '../config/interfaces/auth/resetPassword'




const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`)

@Route("/api/auth")
export class authCtrl {

    @Post("/register")
    public async register (@Body() body :registerParams ): Promise<registerResponse> {
        try {
            const { name, account, password } = body
            const user = userModel.findOne({account})
            
            if(!user) {
                return {
                    msg: 'Email or Phone number already exists.',
                    status: 500
                }
            }

            const passwordhash = await bcrypt.hash(password, 12)

            const newUser = { name, account, password: passwordhash }

            const active_token = generateActiveToken({newUser})

            const url = `${process.env.BASE_URL}/active/${active_token}`

            if (validEmail(account)) {
                if (process.env.SEND === "true") {
                    const html = '<h1>Bonjour</h1><p>Merci de valider votre compte <a href="' + url + '">en cliquant ici</a></p>'
                    sendMail(account, "Active your account", html)
                }
            
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
            const user = await userModel.findOne({account})

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

            const access_token = generateAccessToken({ id: user._id })
            const refresh_token = generateRefreshToken({ id: user._id })
            
            return {
                msg: "Login Success!",
                status: 200,
                access_token,
                refresh_token,
                user: {...user._doc, password: ''}
            }

        } catch (error:any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Post("/active")
    public async activeAccount (@Body() body :activeParams ): Promise<activeResponse> {
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
            
            const user = await userModel.findOne({ account: newUser.account })

            if (user) {
                return {
                    msg: "Ce user existe déjà.",
                    status: 400
                }
            }

            const new_user = new userModel(newUser)

            await new_user.save()

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
    public async refreshToken (rf_token: string): Promise<refreshTokenResponse> {
        try {
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

            const user = await userModel.findById(decoded.id).select('-password')

            if (!user) {
                return {
                    msg: "Ce compte n'existe pas !",
                    status: 500
                }
            }

            const access_token = generateAccessToken({id: user._id})

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
            const user = await userModel.findOne({account: email})
    
            if (user) {
                const access_token = generateAccessToken({ id: user._id })
                const refresh_token = generateRefreshToken({id: user._id})

                return {
                    msg: "Login Success!",
                    access_token,
                    refresh_token,
                    user: {...user._doc, password: ''}
                }

            } else {
                const user = {
                    name,
                    account: email, 
                    password: passwordHash, 
                    avatar: picture,
                    type: 'Google'
                }
                
                const newUser = new userModel(user)
                await newUser.save()

                const access_token = generateAccessToken({id: newUser._id})
                const refresh_token = generateRefreshToken({id: newUser._id})

                return {
                    msg: "Login Success!",
                    access_token,
                    refresh_token,
                    user: {...user._doc, password: ''}
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

            const user = await userModel.findOne({account: account})
    
            if (user) {
                if (user.type === "normal") {
                    const reset_token = md5(account)
                    
                    await userModel.findOneAndUpdate({_id: user._id}, {
                        reset_token
                    })

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
            const { reset_token } = //req.params 

            const user = await userModel.findOne({
                account,
                reset_token
            })
    
            if (user) {
                const passwordhash = await bcrypt.hash(password, 12)

                await userModel.findOneAndUpdate({_id: user._id}, {
                    password: passwordhash,
                    reset_token: ""
                })

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