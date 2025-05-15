'use client'

export const getFileFromUrl = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileName = url.split('/').pop() || 'file';
  return new File([blob], fileName, { type: blob.type });
};
