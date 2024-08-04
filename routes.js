import {Router} from "express";
import bcrypt, {hash} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {Class, User} from './models.js'
import {verifyJwt} from "./middleware.js";

const router = Router();

//  sign up
router.post('/signup', async (req, res) => {
    const {fullName, email, phoneNumber, password, role, token, ghUsername} = req.body


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

        // generate jwt token
        const userID = newUser._id;

        const accessToken = await jwt.sign(
            {userID, role},
            process.env.JWT_SECRET,
            {
                expiresIn: "10d",
            }
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
            accessToken
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.code === 11000 ? 'Email already in use' : 'Error occured while creating account',
        })
    }
})

//  signing
router.post('/signin', async (req, res) => {
    const {email, password} = req.body

    let userEmail = email.toLowerCase()
    try {
        const user = await User.findOne({email: userEmail})

        //  check credentials
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({
                success: 'false',
                message: 'Invalid Credentials'
            })
        }

        // generate jwt token
        const userID = user._id;
        const role = user.role

        const accessToken = await jwt.sign(
            {userID, role},
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
        res.status(500).json({message: 'Login failed'});
    }
})

//  Get Teacher Classes
router.get('/classes', verifyJwt, async (req, res) => {
    try {
        const teacherID = req.user.userID;
        const classes = await Class.find({teacherID});

        res.status(200).json({
            data: classes
        });
    } catch (error) {
        res.status(500).json({message: 'Error fetching classes data', error});
    }
})

//  create class
router.post('/create-class', verifyJwt, async (req, res) => {
    try {
        const {className, day, time} = req.body;
        const teacherID = req.user.userID;

        const newClass = await Class.create({className, day, time, teacherID});

        res.status(201).json({
            message: 'Class created successfully',
            data: newClass
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error creating class'});
    }
})

// available classes
router.get('/classes/available', verifyJwt, async (req, res) => {
    try {
        const userID = req.user.userID;
        const user = await User.findById(userID).populate('joinedClasses');

        const joinedClassIds = user.joinedClasses.map((cls) => cls._id);

        const availableClasses = await Class.find({
            _id: {$nin: joinedClassIds},
        }).populate('teacherID', 'fullName');

        res.status(200).json({data: availableClasses});
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error getting data'});
    }
})

//  joined classes
router.get('/classes/joined', verifyJwt, async (req, res) => {
    try {
        const userID = req.user.userID;

        const user = await User.findById(userID).populate({
            path: 'joinedClasses',
            populate: {
                path: 'teacherID',
                select: 'fullName'
            }
        });

        res.status(200).json({data: user.joinedClasses});
    } catch (error) {
        res.status(500).json({message: 'Error fetching joined classes', error});
    }
});

//  join class
router.post('/classes/join', verifyJwt, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { classID } = req.body;

        const user = await User.findById(userID);
        const classToJoin = await Class.findById(classID);

        if (!classToJoin) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (user.joinedClasses.includes(classID)) {
            return res.status(400).json({ message: 'You have already joined this class' });
        }

        user.joinedClasses.push(classID);
        await user.save();

        classToJoin.studentsCount += 1;
        await classToJoin.save();

        res.status(200).json({ message: 'Class joined successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error joining class', error });    }
});


export {router}
