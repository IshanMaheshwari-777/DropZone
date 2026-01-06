import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connectDB.js';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import lostItemRoutes from './routes/lostItem.route.js';
import cookieParser from 'cookie-parser';
import foundItemRoutes from './routes/foundItem.route.js';
const app = express();
const PORT = process.env.PORT || 6001;
import cron from 'node-cron';
import { deactivateOldPosts } from './utils/autoDeactivate.js';
import LostItem from './models/lostItem.model.js';
app.use(cors({origin:"*"}))
app.use(express.json());
app.use(cookieParser());

app.use("/auth",userRoutes)
app.use("/",foundItemRoutes)
app.use("/",lostItemRoutes)
app.get('/suggestions/:category',async (req,res)=>{
    try {
        const { category } = req.params;
        const suggestions = await LostItem.find({ category, status: 'ACTIVE' }).populate('postedBy', 'name email');
        return res.status(200).json({ suggestions });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})
app.get('/health',(req,res)=>{
    res.status(200).send("API is running")
})


cron.schedule("0 0 * * *", async () => {
  console.log("Running auto-deactivation job...");
  await deactivateOldPosts();
});

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server running on port ${PORT}`);
})
