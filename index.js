import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bcrypt, { hash } from 'bcrypt'

import { connectToMongoDB } from './dbConfig.js'
import { User } from './models.js'

dotenv.config()

const app = express()

const users = [
    {
        fullName: 'Antony Torotich',
        phoneNumber: 700111222,
        email: '1@1.com',
        password: '1',
        role: 1,
        token: 'sghsdfjlsdfismbfsfsd',

        ghUsername: 'developer-ke'
    },
    {
        fullName: 'Latiphar Mmella',
        phoneNumber: 700222111,
        email: '2@2.com',
        password: '2',
        role: 2,
        token: 'sghsdfjlsdfismbfsfsd',

        ghUsername: 'mmella-code'
    },
    {
        fullName: 'Gabriel Gatimu',
        phoneNumber: 700121212,
        email: '3@3.com',
        password: '3',
        role: 3,
        token: 'sghsdfjlsdfismbfsfsd',

        ghUsername: 'gatimugabriel'
    }

]

// allow clients to communicate with the server 
app.use(cors())

// allow request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// logger
app.use(morgan('dev'))

// ---- Routes ----- //
app.get('/hello', (req, res) => {
    res.send('hello world')
})

//  signing route
app.post('/signin', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({
        where: { email }
    })

    //  check credentials
    if (!user || ! await bcrypt.compare(password, user.password)) {
        return res.status(400).json({
            success: 'false',
            message: 'Invalid Credentials'
        })
    }

    res.status(200).json({
        user
    })
})


//  create account
app.post('/signup', async (req, res) => {
    const { fullName, email, phoneNumber, password, role, token, ghUsername } = req.body

    try {
        const user = await User.findOne({
            where: { email }
        })

        //  check credentials
        if (user) {

            console.log('user found', user);

            return res.status(409).json({
                success: 'false',
                message: 'Email already in use'
            })
        }

        console.log('No user found', user);

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
            message: 'Error occured while creating account',
        })
    }
})

// START SERVER & CONNECT TO DB
app.listen(3000, () => {
    console.log('Server running');

    connectToMongoDB().then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.error('error', err);
        process.exit(1)
    })
})

