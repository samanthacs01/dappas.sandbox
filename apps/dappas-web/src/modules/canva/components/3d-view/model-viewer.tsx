'use client';

import Box3DModel from '@/core/components/models/box-3d-model';
import {
    ContactShadows,
    OrbitControls,
    PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import Loader from '../../../../core/components/commons/loader/loader';

const ModelViewer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      setShowLoader(true);
    } else {
      timer = setTimeout(() => {
        setShowLoader(false);
      }, 300);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  const handleLoadingChange = (loading: boolean) => {
    console.log('Loading state changed:', loading);
    setIsLoading(loading);
  };

  return (
    <div className="w-[60%] h-full min-h-screen relative">
      {/* Overlay de carga que no interrumpe el Canvas */}
      {showLoader && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}

      <Canvas
        style={{ height: '100vh' }}
        shadows
        fallback={<div>Loading...</div>}
      >
        {/* Background color for the canvas */}
        {/* Reduced ambient light intensity */}
        <ambientLight intensity={0.5} />

        {/* Key light from top-right */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow={true}
          shadow-mapSize={[1024, 1024]}
        />

        {/* Fill light from bottom-left */}
        <directionalLight
          position={[-5, -2, -5]}
          intensity={0.3}
          color="#b3daff"
        />

        {/* Rim light from behind */}
        <pointLight position={[-5, 5, -5]} intensity={0.9} color="#fff6e0" />

        <PerspectiveCamera makeDefault position={[0, 0, 8]} />

        <Box3DModel onLoadingChange={handleLoadingChange} />

        {/* Subtle ground shadow to enhance depth perception */}
        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.4}
          scale={20}
          blur={2}
          far={4.5}
        />

        <OrbitControls
          autoRotate
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotateSpeed={isLoading ? 0.1 : 1}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
