import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';

const CameraInfo = () => {
  const [cameraInfo, setCameraInfo] = useState({
    position: new Vector3(),
    rotation: new Vector3(),
    fov: 45,
  });

  useFrame((state) => {
    const camera = state.camera as ThreePerspectiveCamera;
    setCameraInfo({
      position: camera.position.clone(),
      rotation: new Vector3(
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z,
      ),
      fov: camera.fov,
    });
  });

  return (
    <Html
      prepend
      center={false}
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
      }}
    >
      <div className="bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm font-mono">
        <h3 className="text-yellow-400 mb-2">Camera Info (Blender Style)</h3>
        <div>
          <strong>Position:</strong>
          <br />
          X: {cameraInfo.position.x.toFixed(3)}
          <br />
          Y: {cameraInfo.position.y.toFixed(3)}
          <br />
          Z: {cameraInfo.position.z.toFixed(3)}
        </div>
        <div className="mt-2">
          <strong>Rotation (rad):</strong>
          <br />
          X: {cameraInfo.rotation.x.toFixed(3)}
          <br />
          Y: {cameraInfo.rotation.y.toFixed(3)}
          <br />
          Z: {cameraInfo.rotation.z.toFixed(3)}
        </div>
        <div className="mt-2">
          <strong>FOV:</strong> {cameraInfo.fov.toFixed(1)}°
        </div>
      </div>
    </Html>
  );
};

export default CameraInfo;
