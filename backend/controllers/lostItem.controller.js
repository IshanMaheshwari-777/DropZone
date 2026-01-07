import {LostItem}  from "../models/lostItem.model.js";
import { AuditLog } from "../models/AuditLog.model.js";
import fs from 'fs';
import cloudinary from '../utils/cloudinary.js';
export const createLostItem = async (req, res) => {
    const { title, category, location, dateLost, publicDescription, privateNotes } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Image is required for lost items');
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "dropzone/lost-items",
    });

    // fs.unlinkSync(req.file.path);

    const lostItem = await LostItem.create({
        postedBy: req.user._id,
        title,
        category,
        location,
        dateLost,
        publicDescription,
        privateNotes,
        imagePath: uploadResult.secure_url,
    });

    await AuditLog.create({
        entityType: 'LostItem',
        entityId: lostItem._id,
        action: 'CREATE',
        performedBy: req.user._id,
    });

    res.status(201).json(lostItem);
};


export const getLostItems = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const query = { deletedAt: null, isActive: true };
    if (category) {
        query.category = category;
    }

    const lostItems = await LostItem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('postedBy', 'name');

    const total = await LostItem.countDocuments(query);

    res.json({
        data: lostItems,
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};

export const getLostItemById = async (req, res) => {
    const lostItem = await LostItem.findById(req.params.id).populate('postedBy', 'name');

    if (lostItem && !lostItem.deletedAt) {
        // Hide private notes if not owner
        if (!req.user || lostItem.postedBy._id.toString() !== req.user._id.toString()) {
            lostItem.privateNotes = undefined;
        }
        res.json(lostItem);
    } else {
        res.status(404);
        throw new Error('Lost item not found');
    }
};

export const deactivateLostItem = async (req, res) => {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem || lostItem.deletedAt) {
        res.status(404);
        throw new Error('Lost item not found');
    }

    if (lostItem.postedBy.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this item');
    }

    lostItem.isActive = false;
    await lostItem.save();

    await AuditLog.create({
        entityType: 'LostItem',
        entityId: lostItem._id,
        action: 'DEACTIVATE',
        performedBy: req.user._id,
    });

    res.json(lostItem);
};

export const getMyLostItems = async (req, res) => {
    const lostItems = await LostItem.find({ postedBy: req.user._id, deletedAt: null })
        .sort({ createdAt: -1 });
    res.json(lostItems);
};
export const deleteLostItem = async (req, res) => {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem || lostItem.deletedAt) {
        res.status(404);
        throw new Error('Lost item not found');
    }

    if (lostItem.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this item');
    }

    lostItem.deletedAt = Date.now();
    await lostItem.save();

    await AuditLog.create({
        entityType: 'LostItem',
        entityId: lostItem._id,
        action: 'DELETE',
        performedBy: req.user._id,
    });

    res.json({ message: 'Lost item removed' });
};