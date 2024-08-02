import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    role: { type: Number, required: true, default: 4 },
    password: { type: String, required: true },

    ghUsername: { type: String },  
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);

export { User }
