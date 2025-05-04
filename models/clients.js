const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Esquema de cliente
const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cif: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    company: { type: String }
  },
  { timestamps: true }
);

// Soft delete
ClientSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('clients', ClientSchema);