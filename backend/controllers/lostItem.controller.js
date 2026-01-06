import { LostItem } from "../models/lostItem.model.js";

export const createLostItem=async(req,res)=>{
    try{
        const {postedBy,title,category,location,dateLost,publicDescription,privateNotes,}=req.body
        if (!title||!category||!location||!dateLost||!publicDescription||!privateNotes){
            return res.status(400).json({message:"All fields are required"})
        }

        const newLostItem=new LostItem({
            postedBy,
            title,
            category,
            location,
            dateLost,
            publicDescription,
            privateNotes
        })

        await newLostItem.save()
        return res.status(201).json({message:"Lost Item created successfully",lostItem:newLostItem})
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error",error:err.message})
    }
}


export const getAllLostItems=async (req,res)=>{
    try{
        const lostItems=await LostItem.find({status:'ACTIVE'}).populate('postedBy','name email')
        return res.status(200).json({lostItems})
    }
    catch(err){
        return res.status(500).json({message:'Internal server error',error:err.message})
    }
}

export const getLostItemById=async (req,res)=>{
    try {
        const { id } = req.params
        const lostItem = await LostItem.findById(id).populate('postedBy', 'name email')
        if (!lostItem) {
            return res.status(404).json({ message: 'Lost Item not found' })
        }
        return res.status(200).json({ lostItem })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const changeVisibilityLostItem=async (req,res)=>{
    try{
        const {id,status}=req.params
        const lostItem=await LostItem.findById(id)
        if (!lostItem) {
            return res.status(404).json({ message: 'Lost Item not found' })
        }
        lostItem.status = status
        await lostItem.save()
        return res.status(200).json({ message: 'Lost Item visibility updated successfully', lostItem })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const myLostItems= async (req,res)=>{
    try {
        const { id } = req.params
        const lostItem = await LostItem.findById(id).populate('postedBy', 'name email')
        if (!lostItem) {
            return res.status(404).json({ message: 'Lost Item not found' })
        }
        return res.status(200).json({ lostItem })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteLostItem=async (req,res)=>{
    try {
        const { id } = req.params
        const lostItem = await LostItem.findById(id)
        if (!lostItem) {
            return res.status(404).json({ message: 'Lost Item not found' })
        }
        await lostItem.remove()
        return res.status(200).json({ message: 'Lost Item deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}