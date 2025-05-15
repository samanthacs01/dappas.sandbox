import useTextureContext from '@/core/store/texture-store/hook';
import whitePaperTexture from '@/modules/canva/components/3d-view/texture/cardboard.png';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const DEFAULT_TEXTURES: Record<string, string> = {
  'green-paper':
    'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1024',
  kraft:
    'https://plus.unsplash.com/premium_photo-1674654419441-86439073da99?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyZGJvYXJkJTIwdGV4dHVyZXxlbnwwfHwwfHx8MA%3D%3D',
  'white-paper': whitePaperTexture,
};

// Create fallback texture only once

// Create a texture cache

interface TextZoneData {
  text?: string;
  fontSize?: number;
  color?: string;
}

interface Box3DModelProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

const BoxModel: React.FC<Box3DModelProps> = ({ onLoadingChange }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const lastTexturePropsRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    state: {
      currentTexture,
      currentDimensions: { width, height, depth },
      textZones,
    },
  } = useTextureContext();
  const textureCache: Map<string, THREE.Texture> = new Map();
  const FALLBACK_TEXTURE: THREE.Texture = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Create a simple pattern
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e0e0e0';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 10, 10);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  })();

  // Usar useEffect para notificar los cambios de estado de carga
  useEffect(() => {
    console.log('Loading state in Box3DModel:', isLoading);
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const textureUrl = useMemo(() => {
    // Siempre activar el estado de carga cuando cambia el URL de la textura
    setIsLoading(true);

    return (
      DEFAULT_TEXTURES[currentTexture] ||
      (DEFAULT_TEXTURES['green-paper'] as string)
    );
  }, [currentTexture]);

  // Load base texture once for the current URL
  const baseTexture = useMemo(() => {
    try {
      // Try to get from cache first
      if (textureCache.has(textureUrl)) {
        const cachedTexture = textureCache.get(textureUrl);
        // If we have a cached texture, we're not loading anymore
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
        return cachedTexture;
      }

      // Otherwise load and cache it
      const textureLoader = new THREE.TextureLoader();

      // Create a promise to handle the loading state
      const loadTexture = () => {
        return new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(
            textureUrl,
            (loadedTexture) => {
              textureCache.set(textureUrl, loadedTexture);
              setIsLoading(false);
              resolve(loadedTexture);
            },
            (xhr) => {
              console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
              console.warn('Failed to load texture:', error);
              setIsLoading(false);
              resolve(FALLBACK_TEXTURE);
            },
          );
        });
      };

      // Start loading but return fallback immediately
      // The texture will update when loaded
      loadTexture().then((texture) => {
        // Update materials once texture is loaded
        if (meshRef.current && meshRef.current.material) {
          const materials = Array.isArray(meshRef.current.material)
            ? meshRef.current.material
            : [meshRef.current.material];

          materials.forEach((material) => {
            // Assert the material type to access the 'map' property
            if (
              material instanceof THREE.MeshStandardMaterial ||
              material instanceof THREE.MeshBasicMaterial
            ) {
              material.map = texture;
              material.needsUpdate = true;
            }
          });
        }
      });

      return FALLBACK_TEXTURE;
    } catch (error) {
      console.warn('Failed to load texture:', error);
      setIsLoading(false);
      return FALLBACK_TEXTURE;
    }
  }, [textureUrl]);

  // Create or update textures with text for each face
  const updateMaterialsWithText = useMemo(() => {
    // Create a unique string key based on current texture state
    const textureStateKey = JSON.stringify({
      textureUrl,
      textZones,
    });

    // Skip if nothing has changed
    if (lastTexturePropsRef.current === textureStateKey) {
      return false;
    }

    // Si hay cambios en las zonas de texto, establecer cargando a true
    if (lastTexturePropsRef.current !== null) {
      setIsLoading(true);
    }

    lastTexturePropsRef.current = textureStateKey;
    return true;
  }, [textureUrl, textZones]);

  // Create textures with text overlays
  useEffect(() => {
    if (!updateMaterialsWithText || !meshRef.current || !baseTexture) return;

    const zoneFaces = ['right', 'left', 'top', 'bottom', 'front', 'back'];

    // Create materials only when needed
    const materials = zoneFaces
      .map((zone, i) => {
        const zoneData = textZones[zone] as TextZoneData | undefined;

        // Skip text rendering if no text is present
        if (!zoneData?.text) {
          return new THREE.MeshStandardMaterial({ map: baseTexture });
        }

        // Create canvas for text overlay
        const canvas: HTMLCanvasElement | null =
          typeof document !== 'undefined'
            ? document.createElement('canvas')
            : null;
        if (!canvas) return;

        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        if (!ctx) return new THREE.MeshStandardMaterial({ map: baseTexture });

        // Draw base texture
        try {
          if (baseTexture.image) {
            ctx.drawImage(baseTexture.image, 0, 0, canvas.width, canvas.height);
          } else {
            throw new Error('Base texture image not available');
          }
        } catch (error) {
          console.warn('Failed to draw texture on canvas:', error);
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw text
        if (zoneData.text) {
          ctx.font = `${zoneData.fontSize || 24}px Arial`;
          ctx.fillStyle = zoneData.color || '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const x = canvas.width / 2;
          const y = canvas.height / 2;

          // Add white background behind text
          const textWidth = ctx.measureText(zoneData.text).width;
          const padding = 10;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(
            x - textWidth / 2 - padding,
            y - (zoneData.fontSize || 24) / 2 - padding,
            textWidth + padding * 2,
            (zoneData.fontSize || 24) + padding * 2,
          );

          ctx.fillStyle = zoneData.color || '#000000';
          ctx.fillText(zoneData.text, x, y);
        }

        // Create new texture
        const newTexture = new THREE.CanvasTexture(canvas);
        newTexture.needsUpdate = true;

        // Dispose previous material's texture if it exists
        const currentMaterial = materialsRef.current[i];
        if (
          currentMaterial?.map &&
          currentMaterial.map !== baseTexture &&
          currentMaterial.map !== FALLBACK_TEXTURE
        ) {
          currentMaterial.map.dispose();
        }

        const material = new THREE.MeshStandardMaterial({ map: newTexture });
        materialsRef.current[i] = material;
        return material;
      })
      .filter(Boolean) as THREE.MeshStandardMaterial[];

    // Apply materials to mesh
    if (meshRef.current) {
      meshRef.current.material = materials;
    }

    // Finish loading after materials are applied
    setTimeout(() => {
      setIsLoading(false);
    }, 300);

    // Cleanup function
    return () => {
      materials.forEach((material) => {
        if (
          material?.map &&
          material?.map !== baseTexture &&
          material?.map !== FALLBACK_TEXTURE
        ) {
          material.map.dispose();
        }
        material?.dispose();
      });
    };
  }, [baseTexture, updateMaterialsWithText, textZones]);

  // Add gentle rotation animation
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slow rotation for better visualization
    }
  });

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      materialsRef.current.forEach((material) => {
        if (
          material?.map &&
          material.map !== FALLBACK_TEXTURE &&
          material.map !== baseTexture
        ) {
          material.map.dispose();
        }
        if (material) {
          material.dispose();
        }
      });
    };
  }, [baseTexture]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[width, height, depth]} />
    </mesh>
  );
};

export default React.memo(BoxModel);
