import {
  BackgroundLayer,
  GradientLayer,
  ImageLayer,
  Layer,
  NamedPosition,
  PatternLayer,
  TextLayer,
  TextureBuilderConfig,
} from '@/server/3d/texture';
import { generateId } from './utils';

// Function to calculate position based on named position
export function calculatePosition(
  position: NamedPosition | undefined,
  layerWidth: number,
  layerHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } {
  if (!position) {
    return { x: 0, y: 0 }; // Default position
  }

  let x = 0;
  let y = 0;

  // Calculate x position
  if (position.includes('left')) {
    x = 0;
  } else if (position.includes('right')) {
    x = canvasWidth - layerWidth;
  } else if (
    position === 'center' ||
    position === 'top' ||
    position === 'bottom'
  ) {
    x = (canvasWidth - layerWidth) / 2;
  }

  // Calculate y position
  if (position.includes('top')) {
    y = 0;
  } else if (position.includes('bottom')) {
    y = canvasHeight - layerHeight;
  } else if (
    position === 'center' ||
    position === 'left' ||
    position === 'right'
  ) {
    y = (canvasHeight - layerHeight) / 2;
  }

  return { x, y };
}

// Builder class for creating texture configurations
export class TextureBuilder {
  private config: TextureBuilderConfig;

  /**
   * Creates a new TextureBuilder
   * @param width Canvas width
   * @param height Canvas height
   */
  constructor(width: number, height: number) {
    this.config = {
      id: `${generateId()}`,
      width,
      height,
      layers: [],
    };
  }

  /**
   * Helper method to calculate position
   * @param position Named position
   * @param layerWidth Layer width
   * @param layerHeight Layer height
   * @param x Explicit X coordinate (optional)
   * @param y Explicit Y coordinate (optional)
   * @returns Calculated position coordinates
   */
  private getPositionCoordinates(
    position: NamedPosition | undefined,
    layerWidth: number,
    layerHeight: number,
    x?: number,
    y?: number,
  ): { x: number; y: number } {
    // If explicit coordinates are provided, use them
    if (typeof x === 'number' && typeof y === 'number') {
      return { x, y };
    }

    // Otherwise calculate based on named position
    return calculatePosition(
      position,
      layerWidth,
      layerHeight,
      this.config.width,
      this.config.height,
    );
  }

  /**
   * Adds a background layer to the texture
   * @param options Background layer options
   * @returns This builder instance for chaining
   */
  addBackgroundLayer(
    options: Omit<BackgroundLayer, 'type' | 'id'> & {
      position?: NamedPosition;
    },
  ) {
    const {
      position,
      width,
      height,
      x: explicitX,
      y: explicitY,
      ...rest
    } = options;

    // Calculate position coordinates
    const { x, y } = this.getPositionCoordinates(
      position,
      width,
      height,
      explicitX,
      explicitY,
    );

    const layer: BackgroundLayer = {
      id: `layer-${this.config.layers.length}`,
      type: 'background',
      x,
      y,
      width,
      height,
      position,
      ...rest,
    };
    this.config.layers.push(layer);
    return this;
  }

  /**
   * Adds a pattern layer to the texture
   * @param options Pattern layer options
   * @returns This builder instance for chaining
   */
  addPatternLayer(
    options: Omit<PatternLayer, 'type' | 'id'> & { position?: NamedPosition },
  ) {
    const {
      position,
      width,
      height,
      x: explicitX,
      y: explicitY,
      ...rest
    } = options;

    // Calculate position coordinates
    const { x, y } = this.getPositionCoordinates(
      position,
      width,
      height,
      explicitX,
      explicitY,
    );

    const layer: PatternLayer = {
      id: `layer-${this.config.layers.length}`,
      type: 'pattern',
      x,
      y,
      width,
      height,
      position,
      ...rest,
    };
    this.config.layers.push(layer);
    return this;
  }

  /**
   * Adds an image layer to the texture
   * @param options Image layer options
   * @returns This builder instance for chaining
   */
  addImageLayer(
    options: Omit<ImageLayer, 'type' | 'id'> & { position?: NamedPosition },
  ) {
    const {
      position,
      width,
      height,
      x: explicitX,
      y: explicitY,
      ...rest
    } = options;

    // Calculate position coordinates
    const { x, y } = this.getPositionCoordinates(
      position,
      width,
      height,
      explicitX,
      explicitY,
    );

    const layer: ImageLayer = {
      id: `layer-${this.config.layers.length}`,
      type: 'image',
      x,
      y,
      width,
      height,
      position,
      ...rest,
    };
    this.config.layers.push(layer);
    return this;
  }

  /**
   * Adds a text layer to the texture
   * @param options Text layer options
   * @returns This builder instance for chaining
   */
  addTextLayer(
    options: Omit<TextLayer, 'type' | 'id'> & { position?: NamedPosition },
  ) {
    const {
      position,
      width,
      height,
      x: explicitX,
      y: explicitY,
      ...rest
    } = options;

    // Calculate position coordinates
    const { x, y } = this.getPositionCoordinates(
      position,
      width,
      height,
      explicitX,
      explicitY,
    );

    const layer: TextLayer = {
      id: `layer-${this.config.layers.length}`,
      type: 'text',
      x,
      y,
      width,
      height,
      position,
      ...rest,
    };
    this.config.layers.push(layer);
    return this;
  }

  /**
   * Adds a gradient layer to the texture
   * @param options Gradient layer options
   * @returns This builder instance for chaining
   */
  addGradientLayer(
    options: Omit<GradientLayer, 'type' | 'id'> & { position?: NamedPosition },
  ) {
    const {
      position,
      width,
      height,
      x: explicitX,
      y: explicitY,
      ...rest
    } = options;

    // Calculate position coordinates
    const { x, y } = this.getPositionCoordinates(
      position,
      width,
      height,
      explicitX,
      explicitY,
    );

    const layer: GradientLayer = {
      id: `layer-${this.config.layers.length}`,
      type: 'gradient',
      x,
      y,
      width,
      height,
      position,
      ...rest,
    };
    this.config.layers.push(layer);
    return this;
  }

  /**
   * Updates an existing layer by id
   * @param id Layer id to update
   * @param updates Partial updates to apply
   * @returns This builder instance for chaining
   */
  updateLayer(id: string, updates: Partial<Layer>) {
    this.config.layers = this.config.layers.map((layer) =>
      layer.id === id ? ({ ...layer, ...updates } as Layer) : layer,
    );
    return this;
  }

  /**
   * Removes a layer by id
   * @param id Layer id to remove
   * @returns This builder instance for chaining
   */
  removeLayer(id: string) {
    this.config.layers = this.config.layers.filter((layer) => layer.id !== id);
    return this;
  }

  /**
   * Reorders layers based on an array of ids
   * @param orderedIds Array of layer ids in the desired order
   * @returns This builder instance for chaining
   */
  reorderLayers(orderedIds: string[]) {
    const layerMap = new Map(
      this.config.layers.map((layer) => [layer.id, layer]),
    );
    this.config.layers = orderedIds
      .filter((id) => layerMap.has(id))
      .map((id) => layerMap.get(id)!);
    return this;
  }

  /**
   * Gets the current configuration
   * @returns The current texture configuration
   */
  getConfig(): TextureBuilderConfig {
    return { ...this.config };
  }
}
