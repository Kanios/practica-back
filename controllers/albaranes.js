const Albaran = require('../models/albaranes');
const { matchedData } = require('express-validator');
const { uploadToIPFS } = require('../utils/handleUpload');
const { generatePdf } = require('../utils/handlePdf');
const fs = require('fs');
const path = require('path');


// Crear un nuevo albarán
const create = async (req, res, next) => {
  try {
    const body = matchedData(req); // Filtra los datos validados
    const albaran = await Albaran.create({
      ...body,
      createdBy: req.user.id,
      company: req.user.company
    });
    res.status(201).json(albaran);
  } catch (err) {
    next(err);
  }
};

// Obtener todos los albaranes del usuario o su empresa
const getAll = async (req, res, next) => {
  try {
    const notes = await Albaran.find({
      $or: [{ createdBy: req.user.id }, { company: req.user.company }]
    }).populate('project'); // Incluye los datos del proyecto asociado
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

// Obtener un albarán por ID con proyecto, cliente y usuario
const getById = async (req, res, next) => {
  try {
    const note = await Albaran.findById(req.params.id)
      .populate({
        path: 'project',
        populate: { path: 'client' } // <- esto es lo que faltaba
      })
      .populate({ path: 'createdBy', select: 'email company' });

    if (!note) return res.status(404).json({ message: 'Albarán no encontrado' });

    res.json(note);
  } catch (err) {
    next(err);
  }
};

// Archivar (soft delete)
const archive = async (req, res, next) => {
  try {
    await Albaran.delete({ _id: req.params.id });
    res.json({ message: 'Albarán archivado' });
  } catch (err) {
    next(err);
  }
};

// Eliminar definitivamente (solo si no está firmado)
const remove = async (req, res, next) => {
  try {
    const note = await Albaran.findOneWithDeleted({ _id: req.params.id });

    if (!note) return res.status(404).json({ message: 'No encontrado' });
    if (note.signed) return res.status(403).json({ message: 'No se puede eliminar firmado' });
    if (note.deleted !== true) {
      return res.status(403).json({ message: 'Debes archivar el albarán antes de eliminarlo' });
    }

    await Albaran.deleteOne({ _id: req.params.id });
    res.json({ message: 'Albarán eliminado permanentemente' });
  } catch (err) {
    next(err);
  }
};

// Restaurar un albarán archivado
const restore = async (req, res, next) => {
  try {
    await Albaran.restore({ _id: req.params.id });
    res.json({ message: 'Albarán restaurado' });
  } catch (err) {
    next(err);
  }
};

// Ver todos los albaranes archivados
const getArchived = async (req, res, next) => {
  try {
    const notes = await Albaran.findDeleted({ createdBy: req.user.id });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

// Firmar: genera PDF, sube firma y PDF a IPFS
const sign = async (req, res, next) => {
  try {
    const albaran = await Albaran.findById(req.params.id).populate('project');
    if (!albaran) return res.status(404).json({ message: 'Albarán no encontrado' });
    if (albaran.signed) return res.status(400).json({ message: 'Ya está firmado' });

    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ message: 'Firma requerida' });

    // Subir firma a IPFS
    const signatureUrl = await uploadToIPFS(base64);

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generar PDF con la firma
    const pdfUrlLocal = await generatePdf(albaran, buffer);
    const pdfPath = path.join(__dirname, '..', pdfUrlLocal);

    // Leer y subir PDF a IPFS
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
    const pdfUrlCloud = await uploadToIPFS(pdfBase64);

    // Guardar URLs
    albaran.signatureUrl = signatureUrl;
    albaran.pdfUrl = pdfUrlCloud;
    albaran.signed = true;
    await albaran.save();

    res.json({
      message: 'Albarán firmado',
      signatureUrl,
      pdfUrl: pdfUrlCloud
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  archive,
  remove,
  restore,
  getArchived,
  sign
};