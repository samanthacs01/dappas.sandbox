'use client'
import React, { useEffect, useRef, useState } from 'react';
import useTextureContext from '@/store/texture-store/hook';

const AdjustmentsPanel: React.FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(false);
  const {
    state: {
      currentDimensions: { height, width, depth },
      availableTextures,
      currentTexture,
    },
    dispatch,
  } = useTextureContext();

  const handleOnSetCurrentTexture = (texture: string) => {
    dispatch({ type: 'CURRENT_TEXTURE', payload: texture });
  };

  useEffect(() => {
    const panelElement = panelRef.current;

    const handleInsideClick = () => {
      setActivePanel(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (panelElement && !panelElement.contains(event.target as Node)) {
        setActivePanel(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePanel(false);
      }
    };

    if (panelElement) {
      panelElement.addEventListener('click', handleInsideClick);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (panelElement) {
        panelElement.removeEventListener('click', handleInsideClick);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [panelRef]);

  return (
    <div
      ref={panelRef}
      className="w-fit absolute bottom-4 space-y-4 left-4 rounded-lg bg-gray-800 p-4 border-l border-gray-700"
    >
      <h3 className="text-lg font-medium">Dimensions</h3>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          activePanel ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) =>
                  dispatch({
                    type: 'CURRENT_DIMENSIONS',
                    payload: {
                      width: parseFloat(e.target.value),
                      height,
                      depth,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) =>
                  dispatch({
                    type: 'CURRENT_DIMENSIONS',
                    payload: {
                      width,
                      height: parseFloat(e.target.value),
                      depth,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                step="0.1"
                min="0.1"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Depth</label>
              <input
                type="number"
                value={depth}
                onChange={(e) =>
                  dispatch({
                    type: 'CURRENT_DIMENSIONS',
                    payload: {
                      width,
                      height,
                      depth: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Texture</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableTextures.map((texture: string) => (
                  <button
                    key={texture}
                    className={`p-2 rounded ${
                      currentTexture === texture
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => handleOnSetCurrentTexture(texture)}
                  >
                    {texture}
                  </button>
                ))}
              </div>
            </div>
            {/* <div>
              <h3 className="text-lg font-medium mb-4">Custom Image</h3>
              <label className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Upload className="inline-block w-4 h-4 mr-2" />
                Upload Image
              </label>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentsPanel;
