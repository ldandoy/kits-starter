import express from 'express'
import auth from '../middlewares/auth'
import persoCtrl from '../controllers/persoCtrl'

const Router = express.Router()

Router.post('/create-perso', auth, persoCtrl.createPerso)

Router.get('/list-perso', auth, persoCtrl.listPerso)

Router.post('/set-perso', auth, persoCtrl.setPerso)

export default Router