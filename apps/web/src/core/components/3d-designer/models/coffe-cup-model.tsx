import { useGLTF, useTexture, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import {
  Bone,
  Group,
  Mesh,
  MeshStandardMaterial,
  SkinnedMesh,
  SRGBColorSpace,
} from 'three';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Circle: Mesh;
    Circle001: SkinnedMesh;
    Bone: Bone;
  };
  materials: {
    Material: MeshStandardMaterial;
    ['Material.001']: MeshStandardMaterial;
  };
};

interface CoffeeCupModelProps {
  textureUrl?: string;
  playRotation?: boolean;
  playAnimation?: boolean;
}

export function CoffeeCupModel({
  textureUrl = '/images/textures/texture1.png',
  playRotation = true,
  playAnimation = false,
  ...props
}: CoffeeCupModelProps) {
  const group = useRef<Group>(null);
  const skinnedMeshRef = useRef<SkinnedMesh>(null);

  const { nodes, materials, animations } = useGLTF(
    '/models/CoffeeCup.glb',
  ) as unknown as GLTFResult;

  const { actions, names } = useAnimations(animations, group);
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.flipY = true;
      texture.colorSpace = SRGBColorSpace;

      texture.rotation = Math.PI;
      texture.center.set(0.5, 0.5);

      if (materials.Material) {
        materials.Material.map = texture;
        materials.Material.needsUpdate = true;
        materials.Material.toneMapped = false;
      }
    }
  }, [texture, materials]);

  // Handle animation playback control
  useEffect(() => {
    if (animations && animations.length > 0 && actions) {
      if (playAnimation) {
        // Play the first animation (or specify which one you want)
        const firstAnimationName = names[0];
        if (firstAnimationName && actions[firstAnimationName]) {
          actions[firstAnimationName].reset().fadeIn(0.5).play();
        }
      } else {
        // Stop all animations with fade out
        Object.values(actions).forEach((action) => {
          if (action) {
            action.fadeOut(0.5);
          }
        });
      }
    }
  }, [playAnimation, actions, names, animations]);

  useFrame((state) => {
    // Handle rotation control
    if (group.current && playRotation) {
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
            ref={skinnedMeshRef}
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
