import mongoose from "mongoose";
    

const foundItemSchema=new mongoose.Schema({

    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    dateFound:{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    imagePath:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    deletedAt:{
        type: Date,
        default: Date.now
    }
},{timestamps:true})

export const FoundItem=mongoose.model('FoundItems',foundItemSchema)

    



