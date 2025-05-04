const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Esquema de proyecto
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    company: { type: String }
  },
  { timestamps: true }
);

// Soft delete
ProjectSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('projects', ProjectSchema);