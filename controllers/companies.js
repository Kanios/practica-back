const Company = require('../models/companies');
const User = require('../models/users');

const createCompany = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await Company.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Nombre de compañía ya existe' });

    const company = await Company.create({
      name,
      createdBy: req.user._id
    });

    // Asignar la compañía al usuario actual
    const user = await User.findById(req.user._id);
    user.company = company.name;
    await user.save();

    res.status(201).json({ message: 'Compañía creada y asignada', company });
  } catch (err) {
    next(err);
  }
};
/**
 * Añade un usuario ya existente a la compañía del usuario actual
 */
const inviteExistingUser = async (req, res, next) => {
    try {
      const { email } = req.body;
      const inviter = await User.findById(req.user._id);
  
      if (!inviter.company) {
        return res.status(403).json({ error: 'No tienes compañía asignada' });
      }
  
      const invited = await User.findOne({ email });
      if (!invited) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      invited.company = inviter.company;
      await invited.save();
  
      res.json({ message: `Usuario añadido a la compañía ${inviter.company}` });
    } catch (err) {
      next(err);
    }
};

module.exports = { createCompany, inviteExistingUser };