import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema({
    folder: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Folder'
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        maxlength: 20,
    },
    content: {
        type: String,
        required: true
    },
    user_created_at: {
        type: Date,
        required: true
    }
}, { timestamps: true })

NoteSchema.pre('save', function (next) {
    console.log('hsdfjsdkl')
    if (this.content && this.content.length > 0) {
        const plainText = this.content.replace(/<[^>]*>/g, '');
        this.description = plainText.substring(0, 20);
    }
    next();
});

NoteSchema.index({ folder: 1, title: 1 }, { unique: true })

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema)

export default Note