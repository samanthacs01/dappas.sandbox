'use client';

import { PDFDocument } from 'pdf-lib';

type InsertImageOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
}
/**
 * Inserts an image into a PDF file at the specified coordinates and size.
 * @param {File} pdfFile - The PDF file to insert the image into.
 * @param {File} imageFile - The image file to insert into the PDF.
 * @param {InsertImageOptions} options - The options for inserting the image.
 * @returns {Promise<Blob>} - A promise that resolves to a Blob representing the modified PDF.
 */
export async function insertImageIntoPdf(pdfFile: File, imageFile: File, options: InsertImageOptions): Promise<Blob> {
  if (!pdfFile || !imageFile) {
    throw new Error('The PDF and image files are required');
  }
  if (pdfFile.type !== 'application/pdf') {
    throw new Error('The PDF file is not valid');
  }
  if (!['image/png', 'image/jpeg'].includes(imageFile.type)) {
    throw new Error('The image file is not valid');
  }
  if (options.x < 0 || options.y < 0 || options.width <= 0 || options.height <= 0) {
    throw new Error('Invalid coordinates or size');
  }

  const pdfBytes = pdfFile instanceof File ? await pdfFile.arrayBuffer() : pdfFile;
  const imageBytes = await imageFile.arrayBuffer();

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);

  // Support for PNG and JPEG images
  let image;
  if (imageFile.type === 'image/png') {
    image = await pdfDoc.embedPng(imageBytes);
  } else if (imageFile.type === 'image/jpeg') {
    image = await pdfDoc.embedJpg(imageBytes);
  } else {
    throw new Error('Unsupported image type');
  }

  page.drawImage(image, {
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
  });

  const newPdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(newPdfBytes)], { type: 'application/pdf' });
}

export async function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
