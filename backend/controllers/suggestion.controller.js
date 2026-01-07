import { FoundItem } from "../models/foundItem.model.js";

export const getSuggestions = async (req, res) => {
    const { category } = req.params;

    const suggestions = await FoundItem.aggregate([
        {
            $match: {
                category: category,
                status: 'available',
                
            },
        },
        {
            $group: {
                _id: '$location',
                count: { $sum: 1 },
            },
        },
        {
            $sort: { count: -1 },
        },
        {
            $limit: 3,
        },
    ]);

    res.json(suggestions);
};