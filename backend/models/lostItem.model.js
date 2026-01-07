import mongoose from 'mongoose'

const lostItemSchema= new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    dateLost: {
        type: Date,
        required: true,
    },
    publicDescription: {
        type: String,
    },
    privateNotes: {
        type: String, 
    },
    imagePath: {
        type: String, 
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

export const LostItem=mongoose.model('LostItems',lostItemSchema)

