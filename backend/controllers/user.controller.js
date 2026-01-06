import {Users} from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register= async (req,res)=>{
    try{

        const {name,email,password}=req.body
        if (!name||!email||!password){
            return res.status(400).json({message:"All fields are required"})
        }
        const existing= await Users.findOne({email})
        if (existing){
            return res.status(400).json({message:"User already exists"})
        }
        const hashed= await bcrypt.hash(password,10)
        const newUser= new Users({
            name,
            email,
            passwordHash:hashed
        })
        await newUser.save()
        const token=jwt.sign({userId:newUser._id,role:newUser.role},process.env.JWT_SECRET,{expiresIn:'15d'})
        return res.status(201).json({message:"User registered successfully",token})
    }
    catch(err){
        return res.status(500).json({message:"Server Error"})
    }

}

export const login= async (req,res)=>{
    try{
        const {email,password}=req.body
        if (!email||!password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await Users.findOne({email})
        if (!user){
            return res.status(400).json({message:"Invalid credentials or User does not exist"})

        }

        const isMatch=await bcrypt.compare(password,user.passwordHash)
        if (!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token=jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'})
        return res.status(200).json({message:"Login successful",token})
    }
    catch(err){
        return res.status(500).json({message:"Server Error"})
    }
}
