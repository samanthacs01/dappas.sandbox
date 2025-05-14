import { TextureBuilder } from '@/core/lib/texture';
import {
  AIBackgroundLayer,
  AIGradientLayer,
  AIImageLayer,
  AILayer,
  AIPatternLayer,
  AITextLayer,
  AITextureConfig,
  Layer,
  NamedPosition,
  TextureBuilderConfig,
} from '@/server/3d/texture';

/**
 * TextureGenerator Class
 *
 * This class is responsible for converting a JSON sent by the AI
 * into a texture configuration that can be rendered.
 */
export class TextureGenerator {
  /**
   * Generates a texture configuration from a JSON
   * @param jsonConfig JSON with the texture configuration
   * @returns Texture configuration ready to render
   */
  public static fromJSON(
    jsonConfig: AITextureConfig | string,
  ): TextureBuilderConfig {
    // If a string is received, try to parse it as JSON
    const config: AITextureConfig =
      typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;

    // Validate the configuration
    this.validateConfig(config);

    // Default values
    const width = config.width || 512;
    const height = config.height || 512;

    // Create the builder
    const builder = new TextureBuilder(width, height);

    // Process each layer
    if (config.layers && Array.isArray(config.layers)) {
      // Sort layers by zIndex
      const sortedLayers = [...config.layers].sort(
        (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
      );

      // Process each layer
      for (const layer of sortedLayers) {
        this.processLayer(builder, layer, width, height);
      }
    }

    return builder.getConfig();
  }

  /**
   * Generates three random variants of a texture configuration
   * with emphasis on color changes
   * @param jsonConfig JSON with the base texture configuration
   * @returns Array with three variant texture configurations
   */
  public static generateVariants(
    jsonConfig: AITextureConfig | string,
    numberVariants?: number,
  ): TextureBuilderConfig[] {
    const variantsQuantity = numberVariants ? numberVariants : 3;
    // If a string is received, try to parse it as JSON
    const baseConfig: AITextureConfig =
      typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;

    // Validate the base configuration
    this.validateConfig(baseConfig);

    // Create three random variants
    const variants: TextureBuilderConfig[] = [];

    for (let i = 0; i < variantsQuantity; i++) {
      // Create a random variant with emphasis on color
      const variant = this.createRandomVariant(baseConfig);
      variants.push(this.fromJSON(variant));
    }

    return variants;
  }

  /**
   * Creates a random variant with emphasis on color changes
   * @param baseConfig Base configuration
   * @returns Configuration with random variations
   */
  private static createRandomVariant(
    baseConfig: AITextureConfig,
  ): AITextureConfig {
    const variant: AITextureConfig = {
      id: baseConfig.id,
      width: baseConfig.width,
      height: baseConfig.height,
      layers: [],
    };

    // Copy the layers and apply random changes
    for (const layer of baseConfig.layers) {
      const newLayer = { ...layer };

      // Always modify colors (high probability)
      if (this.isBackgroundLayer(layer)) {
        // Change the background color
        (newLayer as AIBackgroundLayer).color = this.getRandomColor(
          layer.color,
        );
      } else if (this.isTextLayer(layer) && layer.color) {
        // Change the text color
        (newLayer as AITextLayer).color = this.getRandomColor(layer.color);
      } else if (this.isGradientLayer(layer)) {
        // Change the gradient colors
        const newColors = layer.colors.map((colorStop) => ({
          offset: colorStop.offset,
          color: this.getRandomColor(colorStop.color),
        }));
        (newLayer as AIGradientLayer).colors = newColors;
      }

      // Possibility of modifying other aspects (low probability)
      if (Math.random() < 0.4) {
        // Modify opacity
        if (layer.opacity !== undefined && layer.opacity > 0.3) {
          newLayer.opacity = this.addVariation(layer.opacity, 0.2, 0.2, 1);
        }
      }

      if (Math.random() < 0.2) {
        // Modify position if it doesn't have a named position
        if (!layer.position) {
          // Add a random variation to the position
          if (layer.x !== undefined) {
            newLayer.x = this.addVariation(
              layer.x,
              15,
              0,
              baseConfig.width || 512,
            );
          }
          if (layer.y !== undefined) {
            newLayer.y = this.addVariation(
              layer.y,
              15,
              0,
              baseConfig.height || 512,
            );
          }
        }
      }

      if (Math.random() < 0.15) {
        // Modify size (except for backgrounds that cover the entire canvas)
        if (
          layer.type !== 'background' ||
          layer.width !== baseConfig.width ||
          layer.height !== baseConfig.height
        ) {
          if (layer.width !== undefined) {
            newLayer.width = this.addVariation(
              layer.width,
              0.15,
              50,
              baseConfig.width || 512,
            );
          }
          if (layer.height !== undefined) {
            newLayer.height = this.addVariation(
              layer.height,
              0.15,
              50,
              baseConfig.height || 512,
            );
          }
        }
      }

      // Layer-specific modifications (very low probability)
      if (Math.random() < 0.1) {
        if (this.isImageLayer(layer)) {
          const imageLayer = newLayer as AIImageLayer;
          imageLayer.rotation =
            (imageLayer.rotation || 0) + this.getRandomInt(-20, 20);
        } else if (this.isPatternLayer(layer)) {
          const patternLayer = newLayer as AIPatternLayer;
          patternLayer.scale =
            (patternLayer.scale || 1) * (0.8 + Math.random() * 0.4); // 0.8 to 1.2 times the original scale
        } else if (this.isTextLayer(layer)) {
          const textLayer = newLayer as AITextLayer;
          textLayer.fontSize = Math.round(
            (textLayer.fontSize || 24) * (0.9 + Math.random() * 0.2),
          ); // 0.9 to 1.1 times the original size
        } else if (
          this.isGradientLayer(layer) &&
          layer.gradientType === 'linear'
        ) {
          const gradientLayer = newLayer as AIGradientLayer;
          gradientLayer.angle =
            ((gradientLayer.angle || 0) + this.getRandomInt(15, 60)) % 360;
        }
      }

      variant.layers.push(newLayer);
    }

    return variant;
  }

  /**
   * Generates a random color based on a base color
   * @param baseColor Base color in hexadecimal format
   * @returns New random color
   */
  private static getRandomColor(baseColor: string): string {
    // Different strategies for generating random colors
    const strategies = [
      // Complementary color
      () => this.getComplementaryColor(baseColor),
      // Color with similar hue but different saturation/lightness
      () => this.getColorWithVariation(baseColor),
      // Completely random but harmonious color
      () => this.getHarmonizedRandomColor(baseColor),
    ];

    // Choose a random strategy
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    if (strategy) {
      return strategy();
    }
    throw new Error('No valid strategy found for generating a random color');
  }

  /**
   * Gets the complementary color of a hexadecimal color
   * @param hexColor Color in hex format
   * @returns Complementary color
   */
  private static getComplementaryColor(hexColor: string): string {
    // Make sure the color has the correct format
    if (!hexColor.startsWith('#')) {
      hexColor = '#' + hexColor;
    }

    // Convert to RGB
    let r = Number.parseInt(hexColor.slice(1, 3), 16);
    let g = Number.parseInt(hexColor.slice(3, 5), 16);
    let b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Calculate the complementary (invert the values)
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // Convert back to hexadecimal
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Gets a color with variations in saturation and lightness
   * but maintaining a similar hue
   * @param hexColor Color in hex format
   * @returns New color with variations
   */
  private static getColorWithVariation(hexColor: string): string {
    // Make sure the color has the correct format
    if (!hexColor.startsWith('#')) {
      hexColor = '#' + hexColor;
    }

    // Convert to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Convert to HSL
    const [h, s, l] = this.rgbToHsl(r, g, b);

    // Vary the saturation and lightness
    const newS = Math.min(1, Math.max(0, s + (Math.random() * 0.4 - 0.2))); // ±20%
    const newL = Math.min(0.9, Math.max(0.1, l + (Math.random() * 0.4 - 0.2))); // ±20%

    // Convert back to RGB
    const [newR, newG, newB] = this.hslToRgb(h, newS, newL);

    // Convert to hexadecimal
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG)
      .toString(16)
      .padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  }

  /**
   * Gets a random color but harmonized with the base color
   * @param hexColor Color in hex format
   * @returns New harmonized random color
   */
  private static getHarmonizedRandomColor(hexColor: string): string {
    // Make sure the color has the correct format
    if (!hexColor.startsWith('#')) {
      hexColor = '#' + hexColor;
    }

    // Convert to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Convert to HSL
    const [h] = this.rgbToHsl(r, g, b);

    // Generate a new harmonious hue (±60° or ±30°)
    const shifts = [30, 60, 120, 180, 240, 300];
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    const newH = (h + (shift ?? 0)) % 360;

    // Generate random but harmonious saturation and lightness
    const newS = 0.4 + Math.random() * 0.6; // 40-100%
    const newL = 0.3 + Math.random() * 0.4; // 30-70%

    // Convert back to RGB
    const [newR, newG, newB] = this.hslToRgb(newH, newS, newL);

    // Convert to hexadecimal
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG)
      .toString(16)
      .padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  }

  /**
   * Converts RGB to HSL
   * @param r Red component (0-255)
   * @param g Green component (0-255)
   * @param b Blue component (0-255)
   * @returns [h, s, l] where h is 0-360, s and l are 0-1
   */
  private static rgbToHsl(
    r: number,
    g: number,
    b: number,
  ): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return [h, s, l];
  }

  /**
   * Converts HSL to RGB
   * @param h Hue (0-360)
   * @param s Saturation (0-1)
   * @param l Lightness (0-1)
   * @returns [r, g, b] where r, g, b are 0-255
   */
  private static hslToRgb(
    h: number,
    s: number,
    l: number,
  ): [number, number, number] {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, (h / 360 + 1 / 3) % 1);
      g = hue2rgb(p, q, (h / 360) % 1);
      b = hue2rgb(p, q, (h / 360 - 1 / 3 + 1) % 1);
    }

    return [r * 255, g * 255, b * 255];
  }

  /**
   * Validates the received configuration
   * @param config Configuration to validate
   * @throws Error if the configuration is not valid
   */
  private static validateConfig(config: AITextureConfig): void {
    // Check that config is an object
    if (!config || typeof config !== 'object') {
      throw new Error('Configuration must be a valid object');
    }

    // Check that layers is an array
    if (!config.layers || !Array.isArray(config.layers)) {
      throw new Error('Configuration must contain an array of layers');
    }

    // Check each layer
    for (const layer of config.layers) {
      if (!layer.type) {
        throw new Error('Each layer must have a type');
      }

      // Check according to the layer type
      switch (layer.type) {
        case 'background':
          if (!this.isBackgroundLayer(layer)) {
            throw new Error(
              'Invalid background layer: must have a "color" property',
            );
          }
          break;
        case 'pattern':
          if (!this.isPatternLayer(layer)) {
            throw new Error(
              'Invalid pattern layer: must have a "url" property',
            );
          }
          break;
        case 'image':
          if (!this.isImageLayer(layer)) {
            throw new Error('Invalid image layer: must have a "url" property');
          }
          break;
        case 'text':
          if (!this.isTextLayer(layer)) {
            throw new Error('Invalid text layer: must have a "text" property');
          }
          break;
        case 'gradient':
          if (!this.isGradientLayer(layer)) {
            throw new Error(
              'Invalid gradient layer: must have a "colors" property',
            );
          }
          break;
        default:
          throw new Error(`Unknown layer type: ${(layer as Layer).type}`);
      }
    }
  }

  /**
   * Processes a layer and adds it to the builder
   * @param builder Texture builder
   * @param layer Layer to process
   * @param canvasWidth Canvas width
   * @param canvasHeight Canvas height
   */
  private static processLayer(
    builder: TextureBuilder,
    layer: AILayer,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    switch (layer.type) {
      case 'background':
        this.addBackgroundLayer(builder, layer, canvasWidth, canvasHeight);
        break;
      case 'pattern':
        this.addPatternLayer(builder, layer, canvasWidth, canvasHeight);
        break;
      case 'image':
        this.addImageLayer(builder, layer);
        break;
      case 'text':
        this.addTextLayer(builder, layer, canvasWidth);
        break;
      case 'gradient':
        this.addGradientLayer(builder, layer, canvasWidth, canvasHeight);
        break;
    }
  }

  /**
   * Adds a background layer to the builder
   * @param builder Texture builder
   * @param layer Background layer
   * @param canvasWidth Canvas width
   * @param canvasHeight Canvas height
   */
  private static addBackgroundLayer(
    builder: TextureBuilder,
    layer: AIBackgroundLayer,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    builder.addBackgroundLayer({
      visible: layer.visible !== undefined ? layer.visible : true,
      opacity: layer.opacity !== undefined ? layer.opacity : 1,
      x: layer.x !== undefined ? layer.x : 0,
      y: layer.y !== undefined ? layer.y : 0,
      width: layer.width !== undefined ? layer.width : canvasWidth,
      height: layer.height !== undefined ? layer.height : canvasHeight,
      zIndex: layer.zIndex !== undefined ? layer.zIndex : 0,
      color: layer.color,
      position: layer.position as NamedPosition | undefined,
    });
  }

  /**
   * Adds a pattern layer to the builder
   * @param builder Texture builder
   * @param layer Pattern layer
   * @param canvasWidth Canvas width
   * @param canvasHeight Canvas height
   */
  private static addPatternLayer(
    builder: TextureBuilder,
    layer: AIPatternLayer,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    builder.addPatternLayer({
      visible: layer.visible !== undefined ? layer.visible : true,
      opacity: layer.opacity !== undefined ? layer.opacity : 0.8,
      x: layer.x !== undefined ? layer.x : 0,
      y: layer.y !== undefined ? layer.y : 0,
      width: layer.width !== undefined ? layer.width : canvasWidth,
      height: layer.height !== undefined ? layer.height : canvasHeight,
      zIndex: layer.zIndex !== undefined ? layer.zIndex : 1,
      patternUrl: layer.url,
      repeat: layer.repeat || 'repeat',
      scale: layer.scale !== undefined ? layer.scale : 1,
      position: layer.position as NamedPosition | undefined,
    });
  }

  /**
   * Adds an image layer to the builder
   * @param builder Texture builder
   * @param layer Image layer
   * @param canvasWidth Canvas width
   * @param canvasHeight Canvas height
   */
  private static addImageLayer(
    builder: TextureBuilder,
    layer: AIImageLayer,
  ): void {
    // Default values for images
    const defaultWidth = 200;
    const defaultHeight = 200;

    builder.addImageLayer({
      visible: layer.visible !== undefined ? layer.visible : true,
      opacity: layer.opacity !== undefined ? layer.opacity : 1,
      x: layer.x !== undefined ? layer.x : 0,
      y: layer.y !== undefined ? layer.y : 0,
      width: layer.width !== undefined ? layer.width : defaultWidth,
      height: layer.height !== undefined ? layer.height : defaultHeight,
      zIndex: layer.zIndex !== undefined ? layer.zIndex : 2,
      imageUrl: layer.url,
      rotation: layer.rotation,
      flipX: layer.flipX,
      flipY: layer.flipY,
      position: layer.position as NamedPosition | undefined,
    });
  }

  /**
   * Adds a text layer to the builder
   * @param builder Texture builder
   * @param layer Text layer
   * @param canvasWidth Canvas width
   * @param canvasHeight Canvas height
   */
  private static addTextLayer(
    builder: TextureBuilder,
    layer: AITextLayer,
    canvasWidth: number,
  ): void {
    builder.addTextLayer({
      visible: layer.visible !== undefined ? layer.visible : true,
      opacity: layer.opacity !== undefined ? layer.opacity : 1,
      x: layer.x !== undefined ? layer.x : 0,
      y: layer.y !== undefined ? layer.y : 0,
      width: layer.width !== undefined ? layer.width : canvasWidth,
      height: layer.height !== undefined ? layer.height : 50,
      zIndex: layer.zIndex !== undefined ? layer.zIndex : 3,
      text: layer.text,
      fontFamily: layer.fontFamily || 'Arial',
      fontSize: layer.fontSize || 24,
      fontWeight: layer.fontWeight || 'normal',
      color: layer.color || '#000000',
      align: layer.align || 'center',
      position: layer.position as NamedPosition | undefined,
    });
  }

  /**
   * Adds a gradient layer to the builder
   * @param builder Texture builder
   * @param layer Gradient layer
   * @param canvasWidth Canvas width
   * @param canvasHeight Canvas height
   */
  private static addGradientLayer(
    builder: TextureBuilder,
    layer: AIGradientLayer,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    builder.addGradientLayer({
      visible: layer.visible !== undefined ? layer.visible : true,
      opacity: layer.opacity !== undefined ? layer.opacity : 1,
      x: layer.x !== undefined ? layer.x : 0,
      y: layer.y !== undefined ? layer.y : 0,
      width: layer.width !== undefined ? layer.width : canvasWidth,
      height: layer.height !== undefined ? layer.height : canvasHeight,
      zIndex: layer.zIndex !== undefined ? layer.zIndex : 0,
      gradientType: layer.gradientType || 'linear',
      colors: layer.colors,
      angle: layer.angle,
      position: layer.position as NamedPosition | undefined,
    });
  }

  /**
   * Type guards to verify layer types
   */
  private static isBackgroundLayer(layer: AILayer): layer is AIBackgroundLayer {
    return layer.type === 'background' && typeof layer.color === 'string';
  }

  private static isPatternLayer(layer: AILayer): layer is AIPatternLayer {
    return layer.type === 'pattern' && typeof layer.url === 'string';
  }

  private static isImageLayer(layer: AILayer): layer is AIImageLayer {
    return layer.type === 'image' && typeof layer.url === 'string';
  }

  private static isTextLayer(layer: AILayer): layer is AITextLayer {
    return layer.type === 'text' && typeof layer.text === 'string';
  }

  private static isGradientLayer(layer: AILayer): layer is AIGradientLayer {
    return layer.type === 'gradient' && Array.isArray(layer.colors);
  }

  /**
   * Adds a variation to a numeric value
   * @param value Original value
   * @param factor Variation factor (percentage or absolute value)
   * @param min Minimum allowed value
   * @param max Maximum allowed value
   * @returns Value with variation
   */
  private static addVariation(
    value: number,
    factor: number,
    min: number,
    max: number,
  ): number {
    // Determine if the factor is a percentage or an absolute value
    const isPercentage = factor <= 1;

    // Calculate the variation
    let variation;
    if (isPercentage) {
      variation = value * factor * (Math.random() * 2 - 1); // Between -factor% and +factor%
    } else {
      variation = (Math.random() * 2 - 1) * factor; // Between -factor and +factor
    }

    // Apply the variation and limit to the range
    const newValue = Math.round(value + variation);
    return Math.max(min, Math.min(newValue, max));
  }

  /**
   * Generates a random integer between min and max (both inclusive)
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random integer
   */
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
