import mongoose from 'mongoose'

const AuditLogSchema=new mongoose.Schema({

  entityType: { type: String, enum: ["LostItem", "FoundItem"], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' , required: true },
  action: { type: String, enum: ["CREATE", "UPDATE", "DELETE", "CLAIM", "DEACTIVATE"], required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  timestamp: { type: Date, default: Date.now }

})

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema)
