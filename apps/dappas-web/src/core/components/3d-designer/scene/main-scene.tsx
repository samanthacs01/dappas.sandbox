'use client';

import CameraInfo from '@/core/components/3d-designer/scene/camera-info';
import {
  BakeShadows,
  CameraControls,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Loader2 } from 'lucide-react';
import React, { FC, PropsWithChildren, Suspense, useRef } from 'react';
import CameraPresets from './camera-preset';

type MainSceneProps = PropsWithChildren & {
  showCameraInfo?: boolean;
  enableCameraControls?: boolean;
};

const MainScene: FC<MainSceneProps> = ({
  children,
  showCameraInfo = true,
  enableCameraControls = true,
}) => {
  const cameraControlsRef = useRef<CameraControls>(null);

  return (
    <div className="bg-white relative overflow-hidden h-full">
      {/* Camera presets overlay - OUTSIDE Canvas */}
      {enableCameraControls && (
        <CameraPresets
          cameraControlsRef={
            cameraControlsRef as React.RefObject<CameraControls>
          }
        />
      )}

      <Canvas shadows gl={{ preserveDrawingBuffer: true, toneMapping: 0 }}>
        <PerspectiveCamera
          makeDefault
          position={[4, 2, 4]}
          fov={45}
          near={0.2}
          far={1000}
        />

        {enableCameraControls ? (
          <CameraControls
            ref={cameraControlsRef}
            makeDefault
            smoothTime={0.25}
            polarRotateSpeed={0.3}
            azimuthRotateSpeed={0.3}
            dollySpeed={0.3}
            truckSpeed={0.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minDistance={1}
            maxDistance={50}
          />
        ) : (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={10}
          />
        )}
        <ambientLight intensity={0.4} color="#ffffff" />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-camera-near={0.1}
          shadow-camera-far={40}
          shadow-radius={8}
        />

        <directionalLight
          position={[-5, -2, -5]}
          intensity={0.5}
          color="#b3daff"
        />

        <pointLight position={[-5, 5, -5]} intensity={0.6} color="#fff" />
        <pointLight position={[3, 3, 3]} intensity={0.2} color="#ffe0b3" />

        <hemisphereLight
          args={['#sky', '#ground', 0.5]}
          position={[0, 50, 0]}
        />

        {/* Camera information - INSIDE Canvas using Html component */}
        {showCameraInfo && <CameraInfo />}

        <Suspense
          fallback={
            <Html center>
              <Loader2 className="animate-spin size-10 text-blue-500" />
            </Html>
          }
        >
          {children}
        </Suspense>

        {/* Add some basic lighting for better visualization */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <BakeShadows />
      </Canvas>
    </div>
  );
};

export default MainScene;
