import express from 'express'
import {createLostItem,getAllLostItems,getLostItemById,changeVisibilityLostItem,myLostItems,deleteLostItem} from '../controllers/lostItem.controller.js'

const router=express.Router()

router.post('/lost',createLostItem)
router.get('/lost',getAllLostItems)
router.get('/lost/:id',getLostItemById)
router.get('/lost/my',myLostItems)
router.patch('/lost/:id/:status',changeVisibilityLostItem)
router.delete('/lost/:id',deleteLostItem)

export default router