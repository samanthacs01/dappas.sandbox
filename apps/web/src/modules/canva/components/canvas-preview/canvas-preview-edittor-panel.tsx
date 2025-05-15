import useTextureContext from '@/core/store/texture-store/hook';
import { TextZone } from '@/server/models/texture';
import React, { useEffect, useRef } from 'react';

const ZONES = {
  top: { label: 'Top', color: '#3b82f6' },
  left: { label: 'Left Side', color: '#10b981' },
  front: { label: 'Front', color: '#f59e0b' },
  right: { label: 'Right Side', color: '#ef4444' },
  back: { label: 'Back', color: '#8b5cf6' },
  bottom: { label: 'Bottom', color: '#ec4899' },
};

const CanvasPreviewEditorPanel: React.FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    state: { activeZone, textZones },
    dispatch,
  } = useTextureContext();

  const handleOnSetActiveZone = (zone: string) => {
    dispatch({ type: 'ACTIVE_ZONE', payload: zone });
  };

  const handleOnUpdateZoneText = (zone: string, text: string) => {
    dispatch({
      type: 'TEXT_ZONES',
      payload: { ...(textZones[zone] as TextZone), text },
    });
  };

  const handleOnUpdateZoneStyle = (zone: string, updates: object) => {
    dispatch({
      type: 'TEXT_ZONES',
      payload: { ...(textZones[zone] as TextZone), ...updates },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: 'ACTIVE_ZONE', payload: null });
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [panelRef, dispatch]);

  return (
    <div
      ref={panelRef}
      className="w-1/3  absolute h-fit rounded-lg top-4 left-4 flex flex-col bg-gray-800 border-r border-gray-700"
    >
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Text Zones</h2>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(ZONES).map(([zone, { label, color }]) => (
            <button
              key={zone}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeZone === zone
                  ? 'border-white bg-gray-700'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => handleOnSetActiveZone(zone)}
              style={{ borderColor: activeZone === zone ? color : undefined }}
            >
              <h3 className="text-lg font-medium mb-2">{label}</h3>
              <p className="text-sm text-gray-400 line-clamp-1 text-ellipsis">
                {textZones[zone]?.text || 'No text added'}
              </p>
            </button>
          ))}
        </div>

        {activeZone && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Content
              </label>
              <textarea
                value={textZones[activeZone]?.text || ''}
                onChange={(e) =>
                  handleOnUpdateZoneText(activeZone, e.target.value)
                }
                className="w-full h-24 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter text for this zone..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={textZones[activeZone]?.fontSize || 24}
                onChange={(e) =>
                  handleOnUpdateZoneStyle(activeZone, {
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="text-sm text-gray-400 mt-1">
                {textZones[activeZone]?.fontSize || 24}px
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={textZones[activeZone]?.color || '#000000'}
                onChange={(e) =>
                  handleOnUpdateZoneStyle(activeZone, { color: e.target.value })
                }
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPreviewEditorPanel;
