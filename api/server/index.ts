import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import swaggerUi from "swagger-ui-express"

// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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

import routes from './routes/index'

// Routes
app.use('/api/auth', routes.authRouter)

app.get('/', (request: express.Request, response: express.Response) => {
    response.status(200).json({msg: "it works !"})
})

/**
 * TODO: Ajouter Hander Error + 404 Not found
 */

// server listenning
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})