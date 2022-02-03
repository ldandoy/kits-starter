import express from 'express'
import auth from '../middlewares/auth'
import userCtrl from '../controllers/userCtrl'

const Router = express.Router()

/**
 * @swagger
 * /messages:
 *   patch:
 *     summary: Return current user information
 *     description: Return current user information.
 *     responses:
 *       500:
 *         description: Return error messages
*/
Router.patch('/me', auth, userCtrl.updateUser)

/**
 * @swagger
 * /messages:
 *   patch:
 *     summary: Reset password
 *     description: Retrieve a list of messages.
 *     responses:
 *       200:
 *         description: Password reset
 *       400:
 *         description: Return  bad request error messages
 *       500:
 *         description: Return error messages
*/
Router.patch('/reset_password', auth, userCtrl.resetPassword)

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Update profile picture
 *     description: Update profile picture.
 *     responses:
 *       200:
 *         description: Profile picture updated
 *       500:
 *         description: Return error messages
*/
Router.post('/update_profile_image', auth, userCtrl.updateProfileImage)

export default Router