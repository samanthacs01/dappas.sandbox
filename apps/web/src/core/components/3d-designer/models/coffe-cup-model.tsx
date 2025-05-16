import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Circle: THREE.Mesh;
    Circle001: THREE.SkinnedMesh;
    Bone: THREE.Bone;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    ['Material.001']: THREE.MeshStandardMaterial;
  };
};

interface CoffeeCupModelProps {
  textureUrl?: string;
}

export function CoffeeCupModel({
  textureUrl = '/images/textures/texture1.png',
  ...props
}: CoffeeCupModelProps) {
  const group = useRef<THREE.Group>(null);

  const { nodes, materials } = useGLTF(
    '/models/CoffeeCup.glb',
  ) as unknown as GLTFResult;

  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.flipY = true;
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.rotation = Math.PI;
      texture.center.set(0.5, 0.5);

      if (materials.Material) {
        materials.Material.map = texture;
        materials.Material.needsUpdate = true;
      }
    }
  }, [texture, materials]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Circle"
          castShadow
          receiveShadow
          geometry={nodes.Circle.geometry}
          material={materials.Material}
        />
        <group
          name="Armature"
          position={[0, 1.419, -0.782]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.658}
        >
          <skinnedMesh
            name="Circle001"
            geometry={nodes.Circle001.geometry}
            material={materials['Material.001']}
            skeleton={nodes.Circle001.skeleton}
          />
          <primitive object={nodes.Bone} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/CoffeeCup.glb');
