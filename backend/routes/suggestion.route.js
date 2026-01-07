import express from 'express';
import {getSuggestions} from '../controllers/suggestion.controller.js';
const router=express.Router()

router.get('/:category', (req, res, next) => {
    getSuggestions(req, res).catch(next);
});

export default router