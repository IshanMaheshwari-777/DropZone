import express from 'express';
import {createFoundItem,
    getFoundItems,
    getFoundItemById,
    claimFoundItem,
    deleteFoundItem} from '../controllers/foundItem.controller.js';
import {z} from 'zod';
import validate from '../middlewares/validate.js';
import {protect} from '../middlewares/isauthenticated.js';
import {admin} from '../middlewares/isauthenticated.js';
import upload from '../middlewares/uploadmiddleware.js';
const router=express.Router()
const createFoundItemSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        category: z.string(),
        location: z.string(),
        dateFound: z.string(),
        description: z.string().optional(),
    }),
});
router.route('/')
    .post(protect, upload.single('image'), validate(createFoundItemSchema), (req, res, next) => {
        createFoundItem(req, res).catch(next);
    })
    .get((req, res, next) => {
        getFoundItems(req, res).catch(next);
    });

router.route('/:id')
    .get((req, res, next) => {
        getFoundItemById(req, res).catch(next);
    });

router.route('/:id/claim')
    .patch(protect, (req, res, next) => {
        claimFoundItem(req, res).catch(next);
    });

router.route('/:id')
    .delete(protect, admin, (req, res, next) => {
        deleteFoundItem(req, res).catch(next);
    });

export default router;