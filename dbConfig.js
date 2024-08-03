import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()
const DB_URL = process.env.MONGO_URI

const connectToMongoDB = async () => {
    try {

        console.log('Connecting to DB...');
        await mongoose.connect(DB_URL)
        console.log('Connected Successfully!');

    } catch (error) {
        console.error('Failed to connect', error);
        process.exit(1)
    }
}

export { connectToMongoDB }


