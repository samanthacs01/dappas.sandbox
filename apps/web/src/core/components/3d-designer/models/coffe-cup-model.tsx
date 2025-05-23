import { useGLTF, useTexture, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useMemo } from 'react';
import {
  Bone,
  Group,
  Mesh,
  MeshStandardMaterial,
  SkinnedMesh,
  SRGBColorSpace,
  CanvasTexture,
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
  textureUrl,
  playRotation = true,
  playAnimation = false,
  ...props
}: CoffeeCupModelProps) {
  const group = useRef<Group>(null);
  const skinnedMeshRef = useRef<SkinnedMesh>(null);

  const { nodes, materials, animations } = useGLTF(
    '/models/CoffeeCup.glb',
  ) as unknown as GLTFResult;

  // ————— Smooth shading: recalcular normales y desactivar flatShading —————
  useEffect(() => {
    // Circle mesh
    nodes.Circle.geometry.computeVertexNormals();
    materials['Material.001'].flatShading = false;
    materials['Material.001'].needsUpdate = true;

    // Skinned mesh
    nodes.Circle001.geometry.computeVertexNormals();
    materials['Material.001'].flatShading = false;
    materials['Material.001'].needsUpdate = true;
  }, [nodes, materials]);
  // ————————————————————————————————————————————————————————————————

  const { actions, names } = useAnimations(animations, group);

  const defaultTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);

  if (textureUrl) {
    useTexture.preload(textureUrl);
  }

  // Always call useTexture unconditionally to comply with React Hooks rules
  const externalTexture = useTexture(textureUrl || '');
  const hasExternalTexture = Boolean(textureUrl);
  const activeTexture =
    hasExternalTexture && externalTexture ? externalTexture : defaultTexture;

  useEffect(() => {
    if (!activeTexture) return;
    if (textureUrl && externalTexture) {
      activeTexture.flipY = true;
      activeTexture.rotation = Math.PI;
      activeTexture.center.set(0.5, 0.5);
    }
    activeTexture.colorSpace = SRGBColorSpace;
    Object.entries(materials).forEach(([key, mat]) => {
      if (key.startsWith('Material.001')) {
        mat.map = activeTexture;
        mat.needsUpdate = true;
        mat.toneMapped = false;
        mat.transparent = false;
        mat.opacity = 1;
      }
    });
  }, [activeTexture, materials, textureUrl, externalTexture]);

  useEffect(() => {
    if (animations.length > 0 && actions) {
      if (playAnimation) {
        const firstAnimation = names[0];
        if (actions[firstAnimation]) {
          actions[firstAnimation].reset().fadeIn(0.5).play();
        }
      } else {
        Object.values(actions).forEach((a) => {
          if (a) a.fadeOut(0.5);
        });
      }
    }
  }, [playAnimation, actions, names, animations]);

  useFrame((state) => {
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
          material={materials['Material.001']}
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
            material={materials.Material}
            skeleton={nodes.Circle001.skeleton}
          />
          <primitive object={nodes.Bone} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/CoffeeCup.glb');
