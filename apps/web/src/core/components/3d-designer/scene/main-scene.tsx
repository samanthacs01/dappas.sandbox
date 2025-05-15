import {
  BakeShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC, PropsWithChildren, Suspense } from 'react';
type MainSceneProps = PropsWithChildren;

const MainScene: FC<MainSceneProps> = ({ children }) => {
  return (
    <div className="h-full overflow-hidden bg-gradient-to-b bg-white">
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <PerspectiveCamera
          makeDefault
          position={[0, 1, 5]}
          fov={45}
          near={0.1}
          far={100}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={10}
        />

        <Suspense fallback={null}>
          {children}

          <Environment preset="city" background={false} />

          <BakeShadows />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MainScene;
