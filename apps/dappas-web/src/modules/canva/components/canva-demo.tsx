'use client';

import {
  Canvas,
  FabricImage,
  FabricObject,
  loadSVGFromURL,
  Rect,
  util,
} from 'fabric';
import { useEffect, useRef, useState } from 'react';
import ColorSelector from './controls/color-selector';
import EditorSidebar from './controls/editor-sidebar';
import ViewMode from './controls/view-mode';

const CanvaDemo = () => {
  const canvasRef = useRef<Canvas | null>(null);
  const editableZoneRef = useRef<Rect | null>(null);
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [tShirtColor, setTShirtColor] = useState<string>('#000000');
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null
  );

  // Create editable zone function
  const createEditableZone = (canvas: Canvas) => {
    const width = canvas.width;
    const height = canvas.height;

    // Define editable zone size (adjust these values as needed)
    const zoneWidth = 300;
    const zoneHeight = 300;

    // Create a rectangle to represent the editable zone
    const editableZone = new Rect({
      left: width / 2 - zoneWidth / 2,
      top: height / 2 - zoneHeight / 2, // Position slightly above center
      width: zoneWidth,
      height: zoneHeight,
      fill: 'rgba(255, 255, 255, 0.1)',
      stroke: 'rgba(0, 0, 0, 0.3)',
      strokeDashArray: [5, 5],
      strokeWidth: 2,
      selectable: false,
      hoverCursor: 'default',
      excludeFromExport: true,
    });

    canvas.add(editableZone);
    editableZoneRef.current = editableZone;

    // Bring editable zone to the bottom layer
    canvas.renderAll();

    return editableZone;
  };

  // Function to enforce object boundaries within editable zone
  const enforceObjectBoundaries = (obj: FabricObject, zone: Rect) => {
    // We won't constrain the object's position anymore
    // Instead, make sure the editable zone acts as a clipping path

    if (canvasRef.current) {
      // Update the object's coordinates for proper rendering
      obj.setCoords();

      // If the object has the clipPath property, we don't need to modify it
      // This check is to avoid setting clipPath repeatedly
      if (!obj.clipPath) {
        // Create a clipPath based on the editable zone
        const clipPath = new Rect({
          width: zone.width,
          height: zone.height,
          left: -zone.width / 2,
          top: -zone.height / 2,
          absolutePositioned: false,
        });

        // Apply the clip path to the object with the correct transformation
        obj.clipPath = clipPath;

        // Set the clip path's absolute position relative to the editable zone
        obj.clipPath.absolutePositioned = true;

        // Position the clip path to match the editable zone
        obj.clipPath.set({
          left: zone.left,
          top: zone.top,
        });
      }

      // Ensure clip path stays in sync with the editable zone
      if (obj.clipPath && obj.clipPath instanceof Rect) {
        obj.clipPath.set({
          left: zone.left,
          top: zone.top,
          width: zone.width,
          height: zone.height,
        });
      }

      canvasRef.current.renderAll();
    }
  };

  const loadTShirtSvg = async () => {
    const { objects, options } = await loadSVGFromURL(
      viewMode === 'front'
        ? './images/t-shirt/t-shirt-white-front.svg'
        : './images/t-shirt/t-shirt-white-back.svg',
      (_, object) => {
        if (object.fill === 'currentColor') {
          object.set({
            fill: tShirtColor,
          });
        }
      }
    );
    if (objects && canvasRef.current) {
      const obj = util.groupSVGElements(objects as FabricObject[], options);
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const scaleX = width / 1.5 / obj.width;
      const scaleY = height / 1.5 / obj.height;
      const scale = Math.min(scaleX, scaleY);

      obj.scale(scale);
      obj.set({
        left: width / 2,
        top: height / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        fill: tShirtColor,
      });

      canvasRef.current.add(obj);
      canvasRef.current.renderAll();
    }
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const c = new Canvas('canvas', {
      width: width,
      height: height,
      backgroundColor: '#f0f0f0',
    });

    c.on('selection:created', (e: { selected?: FabricObject[] }) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
      }
    });

    c.on('selection:updated', (e: { selected?: FabricObject[] }) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
      }
    });

    c.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Handle object movement to enforce boundaries
    c.on('object:moving', (e) => {
      if (
        e.target &&
        editableZoneRef.current &&
        e.target !== editableZoneRef.current
      ) {
        enforceObjectBoundaries(e.target, editableZoneRef.current);
      }
    });

    // Handle object scaling to enforce boundaries
    c.on('object:scaling', (e) => {
      if (
        e.target &&
        editableZoneRef.current &&
        e.target !== editableZoneRef.current
      ) {
        enforceObjectBoundaries(e.target, editableZoneRef.current);
      }
    });

    // Handle object rotation to enforce boundaries
    c.on('object:rotating', (e) => {
      if (
        e.target &&
        editableZoneRef.current &&
        e.target !== editableZoneRef.current
      ) {
        enforceObjectBoundaries(e.target, editableZoneRef.current);
      }
    });
    // Handle keyboard events for deleting objects
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        canvasRef.current &&
        canvasRef.current.getActiveObject()
      ) {
        const activeObject = canvasRef.current.getActiveObject();

        // Don't delete the editable zone
        if (activeObject && activeObject !== editableZoneRef.current) {
          canvasRef.current.remove(activeObject);
          canvasRef.current.renderAll();
          setSelectedObject(null);
        }
      }
    };

    // Add the keyboard event listener
    window.addEventListener('keydown', handleKeyDown);

    canvasRef.current = c;

    return () => {
      c.dispose();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Setup undo/redo functionality
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const undoStack: string[] = [];
    let redoStack: string[] = [];

    // Save initial state
    const saveState = () => {
      // Don't save if we're still loading
      if (!canvas || canvas.getObjects().length === 0) return;

      // Save canvas state as JSON
      const json = JSON.stringify(canvas);
      undoStack.push(json);

      // Clear redo stack when a new action is performed
      redoStack = [];
    };

    // Save initial state
    saveState();

    // Save state after object modifications
    const events = [
      'object:added',
      'object:removed',
      'object:modified',
    ] as const;
    events.forEach((event) => {
      canvas.on(event, () => {
        // Don't save state for the editable zone
        const objects = canvas.getObjects();
        if (
          objects.length > 0 &&
          objects[objects.length - 1] !== editableZoneRef.current
        ) {
          saveState();
        }
      });
    });

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey && undoStack.length > 1) {
        e.preventDefault();

        // Save current state to redo stack
        const currentState = undoStack.pop() as string;
        redoStack.push(currentState);

        // Load previous state
        const prevState = undoStack[undoStack.length - 1];
        canvas.loadFromJSON(prevState, () => {
          canvas.renderAll();

          // Find and update editable zone reference
          canvas.getObjects().forEach((obj) => {
            if (obj instanceof Rect && obj.strokeDashArray?.length) {
              editableZoneRef.current = obj as Rect;
            }
          });
        });
      }

      // Redo: Ctrl+Shift+Z
      if (e.ctrlKey && e.shiftKey && e.key === 'Z' && redoStack.length > 0) {
        e.preventDefault();

        // Get last state from redo stack
        const nextState = redoStack.pop() as string;
        undoStack.push(nextState);

        // Load the state
        canvas.loadFromJSON(nextState, () => {
          canvas.renderAll();

          // Find and update editable zone reference
          canvas.getObjects().forEach((obj) => {
            if (obj instanceof Rect && obj.strokeDashArray?.length) {
              editableZoneRef.current = obj as Rect;
            }
          });
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      events.forEach((event) => {
        canvas.off(event);
      });
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      loadTShirtSvg().then(() => {
        if (canvasRef.current) {
          createEditableZone(canvasRef.current);
        }
      });
    }
  }, [viewMode, tShirtColor]);

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editableZoneRef.current) {
      const file: File = e.target.files[0];
      const url: string = URL.createObjectURL(file);

      FabricImage.fromURL(url)
        .then((image: FabricImage) => {
          if (!canvasRef.current || !editableZoneRef.current) return;

          const zoneBounds = editableZoneRef.current.getBoundingRect();
          const maxWidth: number = zoneBounds.width * 0.9;
          const maxHeight: number = zoneBounds.height * 0.9;

          if (image.width > maxWidth || image.height > maxHeight) {
            const scaleX: number = maxWidth / image.width;
            const scaleY: number = maxHeight / image.height;
            const scale: number = Math.min(scaleX, scaleY);
            image.scale(scale);
          }

          // Position the image in the center of the editable zone
          image.set({
            left: zoneBounds.left + zoneBounds.width / 2,
            top: zoneBounds.top + zoneBounds.height / 2,
            originX: 'center',
            originY: 'center',
          });

          canvasRef.current.add(image);
          canvasRef.current.setActiveObject(image);
          canvasRef.current.renderAll();
          URL.revokeObjectURL(url);
        })
        .catch((error: Error) => {
          console.error('Error loading image:', error);
        });
    }
  };

  return (
    <div>
      <label className="absolute bottom-2 right-2 z-10 text-white border border-gray-50 bg-black bg-opacity-10 px-4 py-2 rounded-lg hover:bg-black/80 cursor-pointer">
        Upload your design
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadFile}
        />
      </label>

      <canvas id="canvas" />
      <div className="absolute top-2 left-2 z-10">
        <ViewMode viewMode="front" setViewMode={setViewMode} />
        <ColorSelector
          selectedColor={tShirtColor}
          onSelectColor={setTShirtColor}
        />
      </div>
      <div className="absolute right-0 top-0 h-screen w-auto">
        <EditorSidebar
          onObjectChange={() => {}}
          selectedObject={selectedObject}
        />
      </div>
    </div>
  );
};

export default CanvaDemo;
