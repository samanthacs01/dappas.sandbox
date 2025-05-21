export type ObjectDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type TextZone = {
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
};

// Named position type for positioning layers
export type NamedPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type Position = NamedPosition | { x: number; y: number };

// Base layer interface - common properties for all layer types
export interface BaseLayer {
  id: string; // Unique identifier for the layer
  type: string; // Type of layer (background, pattern, image, etc.)
  visible: boolean; // Whether the layer is visible
  opacity: number; // Layer opacity (0-1)
  x: number; // X position
  y: number; // Y position
  width: number; // Layer width
  height: number; // Layer height
  zIndex: number; // Layer order (lower values are rendered first)
  position?: Position; // Named position (optional)
}

// Base properties for all layers
export interface AILayerBase {
  visible?: boolean; // Whether the layer is visible
  opacity?: number; // Layer opacity (0-1)
  width?: number; // Layer width
  height?: number; // Layer height
  zIndex?: number; // Layer order (lower values are rendered first)
  position?: Position; // Named position (e.g., "top", "center")
}

// Background layer
export interface AIBackgroundLayer extends AILayerBase {
  type: 'background'; // Layer type identifier
  color: string; // Background color in hex format
}

// Pattern layer
export interface AIPatternLayer extends AILayerBase {
  type: 'pattern'; // Layer type identifier
  url: string; // URL to the pattern image
  repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'; // Pattern repeat mode
  scale?: number; // Pattern scale factor
}

// Image layer
export interface AIImageLayer extends AILayerBase {
  type: 'image'; // Layer type identifier
  url: string; // URL to the image
  rotation?: number; // Rotation in degrees
  flipX?: boolean; // Whether to flip horizontally
  flipY?: boolean; // Whether to flip vertically
}

// Text layer
export interface AITextLayer extends AILayerBase {
  type: 'text'; // Layer type identifier
  text: string; // Text content
  fontFamily?: string; // Font family
  fontSize?: number; // Font size in pixels
  fontWeight?: string; // Font weight (e.g., "normal", "bold")
  color?: string; // Text color in hex format
  align?: 'left' | 'center' | 'right'; // Text alignment
}

// Gradient layer
export interface AIGradientLayer extends AILayerBase {
  type: 'gradient'; // Layer type identifier
  gradientType?: 'linear' | 'radial'; // Gradient type
  colors: Array<{ offset: number; color: string }>; // Color stops
  angle?: number; // Angle for linear gradients (in degrees)
}

// Union type for all layer types
export type AILayer =
  | AIBackgroundLayer
  | AIPatternLayer
  | AIImageLayer
  | AITextLayer
  | AIGradientLayer;

// Main structure for the JSON that the AI will send
export interface AITextureConfig {
  id: string; // Unique identifier for the texture
  width: number; // Canvas width (default: 512)
  height: number; // Canvas height (default: 512)
  layers: AILayer[]; // Array of layers
}

// Background layer - solid color background
export interface BackgroundLayer extends BaseLayer {
  type: 'background';
  color: string; // Background color in hex format
}

// Pattern layer - repeating pattern
export interface PatternLayer extends BaseLayer {
  type: 'pattern';
  patternUrl: string; // URL to the pattern image
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'; // Pattern repeat mode
  scale: number; // Pattern scale factor
}

// Image layer - single image
export interface ImageLayer extends BaseLayer {
  type: 'image';
  imageUrl: string; // URL to the image
  rotation?: number; // Rotation in degrees (optional)
  flipX?: boolean; // Whether to flip horizontally (optional)
  flipY?: boolean; // Whether to flip vertically (optional)
}

// Text layer - text content
export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string; // Text content
  fontFamily: string; // Font family
  fontSize: number; // Font size in pixels
  fontWeight: string; // Font weight (e.g., "normal", "bold")
  color: string; // Text color in hex format
  align: 'left' | 'center' | 'right'; // Text alignment
}

// Gradient layer - color gradient
export interface GradientLayer extends BaseLayer {
  type: 'gradient';
  gradientType: 'linear' | 'radial'; // Gradient type
  colors: Array<{ offset: number; color: string }>; // Color stops
  angle?: number; // Angle for linear gradients (in degrees)
}

// Union type for all layer types
export type Layer =
  | BackgroundLayer
  | PatternLayer
  | ImageLayer
  | TextLayer
  | GradientLayer;

// Configuration for the texture builder
export interface TextureBuilderConfig {
  id: string; // Unique identifier for the texture
  width: number; // Canvas width
  height: number; // Canvas height
  layers: Layer[]; // Array of layers
}
