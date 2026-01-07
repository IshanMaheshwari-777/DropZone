import mongoose from 'mongoose'

const AuditLogSchema=new mongoose.Schema({
    entityType: {
        type: String,
        required: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema)
