const Project = require('../models/projects');
const { matchedData } = require('express-validator');

// Crear un proyecto
const createProject = async (req, res, next) => {
  try {
    const body = matchedData(req);

    //Verificar si ya existe un proyecto con el mismo nombre
    const existingProject = await Project.findOne({
      name: body.name,
      $or: [{ createdBy: req.user.id }, { company: req.user.company }]
    });

    if (existingProject) {
      return res.status(409).json({ error: 'El proyecto ya existe para este usuario o compañía' });
    }

    const project = await Project.create({
      ...body,
      createdBy: req.user.id,
      company: req.user.company
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// Obtener todos los proyectos del usuario o su empresa
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { company: req.user.company }],
    }).populate('client'); // Opcional: incluir datos del cliente
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// Obtener un proyecto por ID
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('client');
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Editar un proyecto
const updateProject = async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Archivar (soft delete)
const archiveProject = async (req, res, next) => {
  try {
    await Project.delete({ _id: req.params.id });
    res.json({ message: 'Proyecto archivado' });
  } catch (err) {
    next(err);
  }
};

// Hard delete
const deleteProject = async (req, res, next) => {
  try {
    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    next(err);
  }
};

// Ver proyectos archivados
const getArchivedProjects = async (req, res, next) => {
  try {
    const projects = await Project.findDeleted({
      $or: [
        { createdBy: req.user.id },
        { company: req.user.company }
      ]
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// Restaurar proyecto archivado
const restoreProject = async (req, res, next) => {
  try {
    await Project.restore({ _id: req.params.id });
    res.json({ message: 'Proyecto restaurado' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  archiveProject,
  deleteProject,
  getArchivedProjects,
  restoreProject
};