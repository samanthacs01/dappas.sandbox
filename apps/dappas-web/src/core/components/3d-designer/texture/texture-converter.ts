'use client';

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
} from '@/server/models/texture';

export class TextureConverter {
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
   * Validates the received configuration
   * @param config Configuration to validate
   * @throws Error if the configuration is not valid
   */
  static validateConfig(config: AITextureConfig): void {
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
   * Type guards to verify layer types
   */
  static isBackgroundLayer(layer: AILayer): layer is AIBackgroundLayer {
    return layer.type === 'background' && typeof layer.color === 'string';
  }

  static isPatternLayer(layer: AILayer): layer is AIPatternLayer {
    return layer.type === 'pattern' && typeof layer.url === 'string';
  }

  static isImageLayer(layer: AILayer): layer is AIImageLayer {
    return layer.type === 'image' && typeof layer.url === 'string';
  }

  static isTextLayer(layer: AILayer): layer is AITextLayer {
    return layer.type === 'text' && typeof layer.text === 'string';
  }

  static isGradientLayer(layer: AILayer): layer is AIGradientLayer {
    return layer.type === 'gradient' && Array.isArray(layer.colors);
  }
}
