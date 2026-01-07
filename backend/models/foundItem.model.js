import mongoose from "mongoose";
    

const foundItemSchema=new mongoose.Schema({
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
    dateFound: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    imagePath: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        enum: ['available', 'claimed'],
        default: 'available',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

export const FoundItem=mongoose.model('FoundItems',foundItemSchema)

    



