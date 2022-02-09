import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import swaggerUi from "swagger-ui-express"

import routes from './routes/index'

// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
console.log(process.env.BASE_URL)
app.use(cors({
    origin: ['http://127.0.0.1:3000', `${process.env.BASE_URL}`],
    credentials: true,
}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.static('public'))

// Database
import './config/database'

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
        url: "/swagger.json",
        },
    })
)

// Routes
app.use('/api/auth', routes.authRouter)
app.use('/api/user', routes.userRouter)
app.use('/api/admin/users', routes.adminUserRouter )

app.get('/', (req, res) => {
    res.status(200).json({msg: "it works !"})
})

/**
 * TODO: Ajouter Hander Error + 404 Not found
 */

// server listenning
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})