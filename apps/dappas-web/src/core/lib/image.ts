export function getImageDimensions(
  file: File,
  fallbackSize: { width: number; height: number } = { width: 420, height: 420 },
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      if (e.target && e.target.result) {
        img.src = e.target.result as string;
      } else {
        resolve(fallbackSize);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
