'use client';

import { CameraControls } from '@react-three/drei';
import React from 'react';

const CameraPresets = ({
  cameraControlsRef,
}: {
  cameraControlsRef: React.RefObject<CameraControls>;
}) => {
  type Preset = {
    name: string;
    position: [number, number, number];
    target: [number, number, number];
  };

  const presets: Preset[] = [
    { name: 'Front', position: [0, 0, 5], target: [0, 0, 0] },
    { name: 'Back', position: [0, 0, -5], target: [0, 0, 0] },
    { name: 'Right', position: [5, 0, 0], target: [0, 0, 0] },
    { name: 'Left', position: [-5, 0, 0], target: [0, 0, 0] },
    { name: 'Top', position: [0, 5, 0], target: [0, 0, 0] },
    { name: 'Bottom', position: [0, -5, 0], target: [0, 0, 0] },
    { name: 'Perspective', position: [4, 2, 4], target: [0, 0, 0] },
  ];

  const setPreset = (preset: (typeof presets)[0]) => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(
        preset.position[0],
        preset.position[1],
        preset.position[2],
        preset.target[0],
        preset.target[1],
        preset.target[2],
        true,
      );
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg z-10">
      <h3 className="text-yellow-400 mb-2">Camera Presets</h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setPreset(preset)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-300">
          <p>• Mouse: Rotate view</p>
          <p>• Wheel: Zoom in/out</p>
          <p>• Middle Mouse + Drag: Pan</p>
        </div>
      </div>
    </div>
  );
};

export default CameraPresets;
