import mongoose from "mongoose"
import Note from "./note.model";

const FolderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true})

FolderSchema.index({user: 1, name: 1}, {unique: true})

FolderSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const folderId = this._id;
    await Note.deleteMany({ folder: folderId });
    next();
});

const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema)

export default Folder