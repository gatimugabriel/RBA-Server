import mongoose, {Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    role: { type: Number, required: true, default: 4 },
    password: { type: String, required: true },
    ghUsername: { type: String },

    joinedClasses: [{type: Schema.Types.ObjectId, ref: 'Class'}],
}, { timestamps: true });

const ClassSchema = new mongoose.Schema({
    className: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    teacherID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentsCount: {type: Number, default: 0}
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Class = mongoose.model('Class', ClassSchema);

export { User, Class }
