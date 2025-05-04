const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Esquema de usuario para MongoDB
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Se oculta por defecto al hacer queries
    name: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    company: { type: String },
    verified: { type: Boolean, default: false }, // Si ha validado su correo
    validationCode: { type: String } // Código de validación por correo
  },
  { timestamps: true }
);

// Añade borrado lógico al esquema
UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

// Exporta el modelo con el nombre "users"
module.exports = mongoose.model('users', UserSchema);