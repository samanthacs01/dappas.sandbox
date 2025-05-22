export function generateId() {
  return crypto.randomUUID();
}

// Helper function to calculate position based on named position
export const calculatePosition = (
  position: string,
  layerWidth: number,
  layerHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } => {
  switch (position) {
    case 'center':
      return {
        x: (canvasWidth - layerWidth) / 2,
        y: (canvasHeight - layerHeight) / 2,
      };
    case 'top-left':
      return { x: 0, y: 0 };
    case 'top-right':
      return { x: canvasWidth - layerWidth, y: 0 };
    case 'bottom-left':
      return { x: 0, y: canvasHeight - layerHeight };
    case 'bottom-right':
      return { x: canvasWidth - layerWidth, y: canvasHeight - layerHeight };
    default:
      // Default to top-left if position is unknown
      console.warn(`Unknown position: ${position}. Defaulting to top-left.`);
      return { x: 0, y: 0 };
  }
};
