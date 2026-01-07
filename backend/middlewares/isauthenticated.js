import jwt from 'jsonwebtoken'
import {Users} from '../models/user.model.js'

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Users.findById(decoded.id).select('-passwordHash');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                code: 'UNAUTHORIZED',
                message: 'Not authorized, token failed',
                details: []
            });
        }
    }

    if (!token) {
        res.status(401).json({
            code: 'UNAUTHORIZED',
            message: 'Not authorized, no token',
            details: []
        });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            code: 'FORBIDDEN',
            message: 'Not authorized as an admin',
            details: []
        });
    }
};
