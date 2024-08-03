import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const verifyJwt = async (req, res, next) => {
    const headers = req.headers.authorization || req.header("Authorization")
    const token = headers && headers.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userID: decoded.userID, role: decoded.role};
        next();
    } catch (error) {
        console.log('error', error)
        res.status(401).json({message: 'Unauthorized'});
    }
};

export {verifyJwt}
