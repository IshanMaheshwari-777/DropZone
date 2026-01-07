import { FoundItem } from "../models/foundItem.model.js";
import { AuditLog } from "../models/AuditLog.model.js";
export const createFoundItem = async (req, res) => {
    const { title, category, location, dateFound, description } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Image is required for found items');
    }

    const foundItem = await FoundItem.create({
        postedBy: req.user._id,
        title,
        category,
        location,
        dateFound,
        description,
        imagePath: `/uploads/${req.file.filename}`,
    });

    // Create Audit Log
    await AuditLog.create({
        entityType: 'FoundItem',
        entityId: foundItem._id,
        action: 'CREATE',
        performedBy: req.user._id,
    });

    res.status(201).json(foundItem);
};

export const getFoundItems = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const query = { deletedAt: null, status: 'available' };
    if (category) {
        query.category = category;
    }

    const foundItems = await FoundItem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('postedBy', 'name');

    const total = await FoundItem.countDocuments(query);

    res.json({
        data: foundItems,
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};

export const getFoundItemById = async (req, res) => {
    const foundItem = await FoundItem.findById(req.params.id).populate('postedBy', 'name');

    if (foundItem && !foundItem.deletedAt) {
        res.json(foundItem);
    } else {
        res.status(404);
        throw new Error('Found item not found');
    }
};

export const claimFoundItem = async (req, res) => {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem || foundItem.deletedAt) {
        res.status(404);
        throw new Error('Found item not found');
    }

    if (foundItem.postedBy.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this item');
    }

    foundItem.status = 'claimed';
    await foundItem.save();

    await AuditLog.create({
        entityType: 'FoundItem',
        entityId: foundItem._id,
        action: 'CLAIM',
        performedBy: req.user._id,
    });

    res.json(foundItem);
};

export const changeVisibilityFoundItem= async (req,res)=>{
    try{

        const {id,status}=req.params
        const foundItem=await FoundItem.findById(id)
        if (!foundItem){
            return res.status(404).json({message:"Found Item not found"})
        }
        foundItem.status=status
        const auditLog=new AuditLog({
            entityType:"FoundItem",
            entityId:foundItem._id,
            action:status=="INACTIVE" ? "DEACTIVATE" : "ACTIVATE",
            performedBy:foundItem.postedBy
        })
        await auditLog.save()
        await foundItem.save()
        return res.status(200).json({message:"Found Item status updated successfully"})
    }
    catch(err){
        console.log("Error in changeVisibilityFoundItem:", err);
        return res.status(500).json({message:"Server Error"})
    }
}

export const deleteFoundItem = async (req, res) => {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem || foundItem.deletedAt) {
        res.status(404);
        throw new Error('Found item not found');
    }

    foundItem.deletedAt = Date.now();
    await foundItem.save();

    await AuditLog.create({
        entityType: 'FoundItem',
        entityId: foundItem._id,
        action: 'DELETE',
        performedBy: req.user._id,
    });

    res.json({ message: 'Found item removed' });
};
