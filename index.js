import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { connectToMongoDB } from './dbConfig.js'
import { User } from './models.js'

dotenv.config()

const app = express()

// allow clients to communicate with the server 
app.use(cors())

// allow request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// logger
app.use(morgan('dev'))

// ---- Routes ----- //

//  signing 
app.post('/signin', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        //  check credentials
        if (!user || ! await bcrypt.compare(password, user.password)) {
            return res.status(400).json({
                success: 'false',
                message: 'Invalid Credentials'
            })
        }

        // generate jwt token
        const userId = user._id;
        const role = user.role

        const accessToken = await jwt.sign(
            { userId, role },
            process.env.JWT_SECRET,
            {
                expiresIn: "10d",
            }
        );

        res.status(200).json({
            accessToken,
            data: user
        })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
})


//  create account
app.post('/signup', async (req, res) => {
    const { fullName, email, phoneNumber, password, role, token, ghUsername } = req.body


    try {
        // const user = await User.findOne({ email })

        // console.log(user);
        // //  check credentials
        // if (user) {
        //     return res.status(409).json({
        //         success: 'false',
        //         message: 'Email already in use'
        //     })
        // }

        const hashedPassword = await hash(password, 10)

        const newUser = await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            token,
            ghUsername
        })

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.code === 11000 ? 'Email already in use' : 'Error occured while creating account',
        })
    }
})

// START SERVER & CONNECT TO DB
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server running on port : ', port);

    connectToMongoDB().then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.error('error', err);
        process.exit(1)
    })
})

