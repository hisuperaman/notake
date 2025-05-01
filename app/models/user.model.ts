import mongoose from "mongoose"
import Folder from "./folder.model";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    recentNotes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Note',
        }
    ]
}, { timestamps: true })

UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const userId = this._id;
    await Folder.deleteMany({ user: userId });
    next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User