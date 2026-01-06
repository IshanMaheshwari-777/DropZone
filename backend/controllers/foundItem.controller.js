import { FoundItem } from "../models/foundItem.model.js";

export const createFoundItem = async (req, res) => {
    try{
        const {postedBy,title,category,location,dateFound,description,imagePath,status}=req.body

        if (!title||!category||!location||!dateFound||!description){
            return res.status(400).json({message:"All fields are required"})
        }

        const newFoundItem=new FoundItem({
            postedBy,
            title,
            category,
            location,
            dateFound,
            description,
            imagePath,
            status
        })
        
        await newFoundItem.save()
        return res.status(201).json({message:"Found Item created successfully",foundItem:newFoundItem})


    }
    catch(err){
        console.log("Error in createFoundItem:", err);
        return res.status(500).json({message:"Server Error"})
    }
}

export const getAllFoundItems= async (req,res)=>{
    try{
        const {page=1,limit=10,category='All'}=req.query
        const skip=(page-1)*limit
        const foundItems=await FoundItem.find({status:"ACTIVE",category:category==='All'?{}:{category}}).populate('postedBy','name email').skip(parseInt(skip)).limit(parseInt(limit))
        return res.status(200).json({foundItems})
    }
    catch(err){
        console.log("Error in getAllFoundItems:", err);
        return res.status(500).json({message:"Server Error"})
    }
}

export const getFoundItemById= async (req,res)=>{
    try{
        const {id}=req.params
        const {page=1,limit=10,category='All'}=req.query
        const skip=(page-1)*limit
        const foundItem=await FoundItem.findById({id,category:category==='All'?{}:{category}}).populate('postedBy','name email').skip(parseInt(skip)).limit(parseInt(limit))
        if (!foundItem){
            return res.status(404).json({message:"Found Item not found"})
        }
        return res.status(200).json({foundItem})
    }
    catch(err){
        console.log("Error in getFoundItemById:", err);
        return res.status(500).json({message:"Server Error"})
    }
}

export const changeVisibilityFoundItem= async (req,res)=>{
    try{
        const {id,status}=req.params
        const foundItem=await FoundItem.findById(id)
        if (!foundItem){
            return res.status(404).json({message:"Found Item not found"})
        }
        foundItem.status=status
        await foundItem.save()
        return res.status(200).json({message:"Found Item status updated successfully"})
    }
    catch(err){
        console.log("Error in changeVisibilityFoundItem:", err);
        return res.status(500).json({message:"Server Error"})
    }
}

export const deleteFoundItem= async (req,res)=>{
    try{
        const {id}=req.params
        const foundItem=await FoundItem.findById(id)
        if (!foundItem){
            return res.status(404).json({message:"Found Item not found"})
        }
        await foundItem.remove()
        return res.status(200).json({message:"Found Item deleted successfully"})
    }
    catch(err){
        console.log("Error in deleteFoundItem:", err);
        return res.status(500).json({message:"Server Error"})
    }
}
