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
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.static('public'))

import { RegisterRoutes } from "./routes/routes";

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
app.use('/api', routes.authRouter)
app.use('/api', routes.userRouter)

// server listenning
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})