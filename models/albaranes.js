const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Esquema de albarán
const DeliveryNoteSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['hours', 'materials'], required: true },
    entries: [
      {
        name: String,
        quantity: Number,
        unit: String
      }
    ],
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    company: { type: String },
    signed: { type: Boolean, default: false },
    signatureUrl: { type: String },
    pdfUrl: { type: String }
  },
  { timestamps: true }
);

DeliveryNoteSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('albaranes', DeliveryNoteSchema);