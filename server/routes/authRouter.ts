import express from 'express'
import authCtrl from '../controllers/authCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Register new account
 *     description: Register new account.
 *     responses:
 *       200:
 *         description: Registered
 *       400:
 *         description: Return  bad request error messages
 *       500:
 *         description: Return error messages
*/
Router.post('/register', validRegister, authCtrl.register)

Router.post('/active', authCtrl.activeAccount)

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Login to your account
 *     description: Login to your account.
 *     responses:
 *       200:
 *         description: Logged in
 *       400:
 *         description: Return  bad request error messages
 *       500:
 *         description: Return error messages
*/
Router.post('/login', authCtrl.login)

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Logout from your account
 *     description: Logout from your account.
 *     responses:
 *       200:
 *         description: Logged out
 *       500:
 *         description: Return error messages
*/
Router.get('/logout', authCtrl.logout)

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Refresh token
 *     description: Refresh token.
 *     responses:
 *       200:
 *         description: Token refreshed
 *       500:
 *         description: Return error messages
*/
Router.get('/refresh_token', authCtrl.refreshToken)

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Login with a google account
 *     description: Login with a google account
 *     responses:
 *       200:
 *         description: Logged in
 *       500:
 *         description: Return error messages
*/
Router.post('/google_login', authCtrl.googleLogin)

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Send a mail to reset password
 *     description: Send a mail to reset password.
 *     responses:
 *       200:
 *         description: Mail sent
 *       500:
 *         description: Return error messages
*/
Router.post('/forgot_password', authCtrl.forgot_password)

Router.post('/reset_password/:reset_token', authCtrl.reset_password)

export default Router