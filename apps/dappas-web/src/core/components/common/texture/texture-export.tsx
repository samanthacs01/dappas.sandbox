/**
 * Helper function to export the texture as an image
 * @param canvas Canvas element containing the texture
 * @param filename Name for the downloaded file
 * @param format Image format (png, jpeg, webp)
 */
export const exportTextureAsImage = (
  canvas: HTMLCanvasElement,
  filename = 'texture.png',
  format: 'png' | 'jpeg' | 'webp' = 'png',
): void => {
  // Determine MIME type based on format
  const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;

  // Create a data URL from the canvas
  const dataUrl = canvas.toDataURL(mimeType, 0.9);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;

  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Function to convert the texture to a Blob
 * @param canvas Canvas element containing the texture
 * @param format Image format (png, jpeg, webp)
 * @param quality Image quality (0-1)
 * @returns Promise that resolves with the Blob
 */
export const textureToBlob = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality = 0.9,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      `image/${format === 'jpeg' ? 'jpeg' : format}`,
      quality,
    );
  });
};
