'use client';

import { Canvas, FabricImage } from 'fabric';
import { useEffect, useRef } from 'react';

const CanvaDemo = () => {
  const canvasRef = useRef<Canvas | null>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const c = new Canvas('canvas', {
      width: width,
      height: height, // 80% of screen height
      backgroundColor: 'white',
    });

    canvasRef.current = c;

    const loadTShirt = async () => {
      const image = await FabricImage.fromURL(
        '/images/t-shirt/white-front.png'
      );
      // Scale image to fit nicely on canvas
      const scaleX = width / 1.5 / image.width;
      const scaleY = height / 1.5 / image.height;
      const scale = Math.min(scaleX, scaleY);

      image.scale(scale);

      // Center the image on canvas
      image.set({
        left: width / 2,
        top: height / 2,
        originX: 'center',
        originY: 'center',
        // Block movement and manipulation
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockSkewingX: true,
        lockSkewingY: true,
        hasControls: false,
        hasBorders: false,
      });

      c.add(image);
    };

    loadTShirt();

    return () => {
      c.dispose();
    };
  }, []);

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file: File = e.target.files[0];
      const url: string = URL.createObjectURL(file);

      FabricImage.fromURL(url)
        .then((image: FabricImage) => {
          if (!canvasRef.current) return;

          const maxWidth: number = canvasRef.current.width / 3;
          const maxHeight: number = canvasRef.current.height / 3;

          if (image.width > maxWidth || image.height > maxHeight) {
            const scaleX: number = maxWidth / image.width;
            const scaleY: number = maxHeight / image.height;
            const scale: number = Math.min(scaleX, scaleY);
            image.scale(scale);
          }

          image.set({
            left: canvasRef.current.width / 2,
            top: canvasRef.current.height / 2,
            originX: 'center',
            originY: 'center',
          });

          canvasRef.current.add(image);
          canvasRef.current.setActiveObject(image);
          canvasRef.current.renderAll();
          URL.revokeObjectURL(url);
        })
        .catch((error: Error) => {
          console.error('Error loading image:', error);
        });
    }
  };

  return (
    <div>
      <label className="absolute bottom-2 right-2 z-10 text-white border border-gray-50 bg-black bg-opacity-10 px-4 py-2 rounded-lg hover:bg-black/80 cursor-pointer">
        Upload your design
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadFile}
        />
      </label>

      <canvas id="canvas" />
    </div>
  );
};

export default CanvaDemo;
