const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF con los datos del albarán y su firma.
 * @param {Object} albaran - Documento de albarán (ya con populate de proyecto).
 * @param {Buffer} signatureBuffer - Firma en formato buffer (sin el encabezado base64).
 * @returns {Promise<string>} - URL pública del PDF generado.
 */
const generatePdf = async (albaran, signatureBuffer) => {
  const doc = new PDFDocument();

  // Nombre y ruta final del PDF
  const fileName = `albaran_${albaran._id}.pdf`;
  const filePath = path.join(__dirname, '..', 'public', fileName);

  // Ruta temporal donde se guardará la imagen de la firma
  const tmpPath = path.join(__dirname, '..', 'public', `firma_${albaran._id}.png`);

  // Guardamos el buffer como archivo PNG (temporal)
  fs.writeFileSync(tmpPath, signatureBuffer);

  // Crear el contenido del PDF
  doc.fontSize(18).text(`Albarán: ${albaran._id}`, { underline: true });
  doc.moveDown();

  doc.fontSize(12).text(`Tipo: ${albaran.type}`);
  doc.text(`Proyecto: ${albaran.project.name}`);
  doc.text(`Fecha: ${new Date(albaran.createdAt).toLocaleString()}`);
  doc.moveDown();

  doc.text('Entradas:');
  albaran.entries.forEach((e) => {
    doc.text(`- ${e.name}: ${e.quantity} ${e.unit}`);
  });

  // 🖊️ Añadir la firma como imagen en nueva página
  doc.addPage().image(tmpPath, {
    fit: [250, 250],
    align: 'center',
    valign: 'center'
  });

  doc.end();

  // Guardamos el PDF y luego borramos la imagen temporal
  return new Promise((resolve) => {
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    writeStream.on('finish', () => {
      fs.unlinkSync(tmpPath); // 🧹 Borra la imagen temporal
      resolve(`/public/${fileName}`);
    });
  });
};

module.exports = { generatePdf };