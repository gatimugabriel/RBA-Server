import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

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
app.post('/signin', (req, res) => {
    const { email, password } = req.body

    //  find user
    const user = users.filter(user => email.toLowerCase() === user.email)

    if (!user || password !== user[0]?.password) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    res.status(200).json({
        message: 'success',
        user
    })
})


app.listen(3000, () => {
    console.log('Server running');
})

