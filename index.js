import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import {connectToMongoDB} from './dbConfig.js'
import {router} from "./routes.js";

dotenv.config()

const app = express()

app.use(cors())

//  request bodies
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// logger
app.use(morgan('dev'))

// ---- Routes ----- //
app.use('/api', router)

// START SERVER & CONNECT TO DB
const port = process.env.PORT || 3000

app.listen(port, async () => {
    console.log('Server running on port : ', port);
    await connectToMongoDB()
})

