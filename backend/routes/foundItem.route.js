import express from 'express';
import {createFoundItem, getAllFoundItems, getFoundItemById, changeVisibilityFoundItem, deleteFoundItem} from '../controllers/foundItem.controller.js';

const router=express.Router()
router.post('/found',createFoundItem)
router.get('/found',getAllFoundItems)
router.get('/found/:id',getFoundItemById)
router.patch('/found/:id/:status',changeVisibilityFoundItem)
router.delete('/found/:id',deleteFoundItem)

export default router;