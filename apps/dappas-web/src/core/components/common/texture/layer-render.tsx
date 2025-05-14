import { Layer } from '@/server/3d/texture';

// Helper function to load an image
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // To avoid CORS issues
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Render a background layer
const renderBackgroundLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer & { type: 'background'; color: string },
) => {
  const { x, y, width, height, color, opacity } = layer;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
};

// Render a pattern layer
const renderPatternLayer = async (
  ctx: CanvasRenderingContext2D,
  layer: Layer & {
    type: 'pattern';
    patternUrl: string;
    repeat: string;
    scale: number;
  },
) => {
  const { x, y, width, height, patternUrl, repeat, opacity, scale } = layer;

  try {
    const patternImage = await loadImage(patternUrl);

    ctx.save();
    ctx.globalAlpha = opacity;

    // Create a pattern
    const pattern = ctx.createPattern(patternImage, repeat);
    if (!pattern) return;

    // Apply scaling if needed
    if (scale !== 1) {
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      if (!patternCtx) return;

      patternCanvas.width = patternImage.width * scale;
      patternCanvas.height = patternImage.height * scale;

      patternCtx.scale(scale, scale);
      patternCtx.drawImage(patternImage, 0, 0);

      const scaledPattern = ctx.createPattern(patternCanvas, repeat);
      if (scaledPattern) {
        ctx.fillStyle = scaledPattern;
      }
    } else {
      ctx.fillStyle = pattern;
    }

    ctx.fillRect(x, y, width, height);
    ctx.restore();
  } catch (error) {
    console.error('Error loading pattern image:', error);
  }
};

// Render an image layer
const renderImageLayer = async (
  ctx: CanvasRenderingContext2D,
  layer: Layer & {
    type: 'image';
    imageUrl: string;
    rotation?: number;
    flipX?: boolean;
    flipY?: boolean;
  },
) => {
  const {
    x,
    y,
    width,
    height,
    imageUrl,
    opacity,
    rotation = 0,
    flipX = false,
    flipY = false,
  } = layer;

  try {
    const image = await loadImage(imageUrl);

    ctx.save();
    ctx.globalAlpha = opacity;

    // Handle rotation and flipping
    ctx.translate(x + width / 2, y + height / 2);

    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180);
    }

    if (flipX || flipY) {
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    }

    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  } catch (error) {
    console.error('Error loading image:', error);
  }
};

// Render a text layer
const renderTextLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer & {
    type: 'text';
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    align: string;
  },
) => {
  const {
    x,
    y,
    width,
    height,
    text,
    fontFamily,
    fontSize,
    fontWeight,
    color,
    align,
    opacity,
  } = layer;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = align as CanvasTextAlign;

  // Calculate vertical center
  const textHeight = fontSize;
  const textY = y + height / 2 + textHeight / 3; // Approximate vertical centering

  // Calculate horizontal position based on alignment
  let textX = x;
  if (align === 'center') {
    textX = x + width / 2;
  } else if (align === 'right') {
    textX = x + width;
  }

  ctx.fillText(text, textX, textY);
  ctx.restore();
};

// Render a gradient layer
const renderGradientLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer & {
    type: 'gradient';
    gradientType: string;
    colors: Array<{ offset: number; color: string }>;
    angle?: number;
  },
) => {
  const {
    x,
    y,
    width,
    height,
    gradientType,
    colors,
    opacity,
    angle = 0,
  } = layer;

  ctx.save();
  ctx.globalAlpha = opacity;

  let gradient;

  if (gradientType === 'linear') {
    // Calculate start and end points based on angle
    const angleRad = (angle * Math.PI) / 180;
    const startX = x + (Math.cos(angleRad + Math.PI) * width) / 2 + width / 2;
    const startY = y + (Math.sin(angleRad + Math.PI) * height) / 2 + height / 2;
    const endX = x + (Math.cos(angleRad) * width) / 2 + width / 2;
    const endY = y + (Math.sin(angleRad) * height) / 2 + height / 2;

    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  } else {
    // radial gradient
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.max(width, height) / 2;

    gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius,
    );
  }

  // Add color stops
  colors.forEach(({ offset, color }) => {
    gradient.addColorStop(offset, color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
};

// Helper function to calculate position based on named position
const calculatePosition = (
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

// Render a layer, recalculating positions if needed
export const renderLayer = async (
  ctx: CanvasRenderingContext2D,
  layer: Layer,
) => {
  if (!layer.visible) return;

  // Recalculate position if a named position is provided
  if (layer.position) {
    const { x, y } = calculatePosition(
      layer.position,
      layer.width,
      layer.height,
      ctx.canvas.width,
      ctx.canvas.height,
    );

    // Only update if the position has changed
    if (x !== layer.x || y !== layer.y) {
      layer = { ...layer, x, y };
    }
  }

  switch (layer.type) {
    case 'background':
      renderBackgroundLayer(
        ctx,
        layer as Layer & { type: 'background'; color: string },
      );
      break;
    case 'pattern':
      await renderPatternLayer(
        ctx,
        layer as Layer & { type: 'pattern'; color: string },
      );
      break;
    case 'image':
      await renderImageLayer(
        ctx,
        layer as Layer & { type: 'image'; src: string },
      );
      break;
    case 'text':
      renderTextLayer(ctx, layer as Layer & { type: 'text'; text: string });
      break;
    case 'gradient':
      renderGradientLayer(
        ctx,
        layer as Layer & {
          type: 'gradient';
          colors: Array<{ offset: number; color: string }>;
        },
      );
      break;
    default:
      console.warn(`Unknown layer type: ${(layer as Layer).type}`);
  }
};
