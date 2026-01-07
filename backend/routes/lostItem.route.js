import express from 'express'
import {createLostItem,
    getLostItems,
    getLostItemById,
    getMyLostItems,
    deactivateLostItem,
    deleteLostItem,} from '../controllers/lostItem.controller.js'
import {z} from 'zod';
import validate from '../middlewares/validate.js';
import {protect} from '../middlewares/isauthenticated.js';
import upload from '../middlewares/uploadmiddleware.js';
const router=express.Router()


const createLostItemSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        category: z.string(),
        location: z.string(),
        dateLost: z.string(),
        publicDescription: z.string().optional(),
        privateNotes: z.string().optional(),
    }),
});

router.route('/')
    .post(protect, upload.single('image'), validate(createLostItemSchema), (req, res, next) => {
        createLostItem(req, res).catch(next);
    })
    .get((req, res, next) => {
        getLostItems(req, res).catch(next);
    });

router.route('/my')
    .get(protect, (req, res, next) => {
        getMyLostItems(req, res).catch(next);
    });

router.route('/:id')
    .get((req, res, next) => {
        getLostItemById(req, res).catch(next);
    })
    .delete(protect, (req, res, next) => {
        deleteLostItem(req, res).catch(next);
    });

router.route('/:id/deactivate')
    .patch(protect, (req, res, next) => {
        deactivateLostItem(req, res).catch(next);
    });

export default router