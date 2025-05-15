export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64 string'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export const getFileFromUrl = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileName = url.split('/').pop() || 'file';
  return new File([blob], fileName, { type: blob.type });
};

