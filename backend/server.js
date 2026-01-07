import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import lostItemRoutes from './routes/lostItem.route.js';
import cookieParser from 'cookie-parser';
import foundItemRoutes from './routes/foundItem.route.js';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import { deactivateOldPosts } from './utils/autoDeactivate.js';
import suggestionroutes from './routes/suggestion.route.js';

const app = express();
const PORT = process.env.PORT || 6001;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use((req, res, next) => {
    req.id = uuidv4();
    next();
});
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({origin:"*"}))
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  }, express.static(path.join(__dirname, '../uploads')));
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))
app.use("/auth",userRoutes)
app.use("/found",foundItemRoutes)
app.use("/lost",lostItemRoutes)

app.use('/suggestions', suggestionroutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Server Error',
        details: err.details || []
    });
});


cron.schedule("0 0 * * *", async () => {
  console.log("Running auto-deactivation job...");
  await deactivateOldPosts();
});

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server running on port ${PORT}`);
})
