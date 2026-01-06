import mongoose from 'mongoose'

const lostItemSchema=new mongoose.Schema({

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
  dateLost:{
      type: Date,
      required: true
  },
  publicDescription:{
      type: String,
      required: true
  },
  privateNotes:{
      type: String,
      required: true
  },
  imagePath:{
      type: String,
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

export const LostItem=mongoose.model('LostItems',lostItemSchema)

