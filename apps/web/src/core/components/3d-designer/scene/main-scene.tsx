import {
  BakeShadows,
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC, PropsWithChildren, Suspense } from 'react';
import { ACESFilmicToneMapping } from 'three';

type MainSceneProps = PropsWithChildren;

const MainScene: FC<MainSceneProps> = ({ children }) => {
  return (
    <div className="h-full overflow-hidden bg-white">
      <Canvas
        shadows
        gl={{
          preserveDrawingBuffer: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 1, 6]}
          fov={35}
          near={0.1}
          far={100}
        />

        <ambientLight intensity={0.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-camera-near={0.1}
          shadow-camera-far={40}
        />

        <directionalLight
          position={[-5, -2, -5]}
          intensity={0.3}
          color="#b3daff"
        />

        <pointLight position={[-5, 5, -5]} intensity={0.7} color="#fff" />

        <pointLight position={[3, 3, 3]} intensity={0.5} color="#ffe0b3" />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={10}
        />

        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.6}
          scale={20}
          blur={1.5}
          far={4.5}
          resolution={1024}
          color="#000000"
        />

        <Suspense fallback={null}>
          {children}
          <BakeShadows />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MainScene;
