const Client = require('../models/clients');
const { matchedData } = require('express-validator');

// Crear cliente
const createClient = async (req, res, next) => {
  try {
    const body = matchedData(req);
    const client = await Client.create({
      ...body,
      createdBy: req.user.id,
      company: req.user.company,
    });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
};

// Obtener todos los clientes del usuario o su empresa
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({
      $or: [{ createdBy: req.user.id }, { company: req.user.company }],
    });
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

// Obtener un cliente por ID
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

// Editar cliente
const updateClient = async (req, res, next) => {
  try {
    const body = matchedData(req);
    const client = await Client.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

// Archivar (soft delete)
const archiveClient = async (req, res, next) => {
  try {
    await Client.delete({ _id: req.params.id });
    res.json({ message: 'Cliente archivado' });
  } catch (err) {
    next(err);
  }
};

// Eliminar completamente (hard delete)
const deleteClient = async (req, res, next) => {
  try {
    await Client.deleteOne({ _id: req.params.id });
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    next(err);
  }
};

// Ver clientes archivados
const getArchivedClients = async (req, res, next) => {
  try {
    const clients = await Client.findDeleted({ createdBy: req.user.id });
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

// Restaurar cliente archivado
const restoreClient = async (req, res, next) => {
  try {
    await Client.restore({ _id: req.params.id });
    res.json({ message: 'Cliente restaurado' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  archiveClient,
  deleteClient,
  getArchivedClients,
  restoreClient
};