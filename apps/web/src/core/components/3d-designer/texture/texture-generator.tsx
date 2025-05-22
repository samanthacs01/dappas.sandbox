import { ColorUtils } from '@/core/lib/color';
import { MathUtils } from '@/core/lib/math';
import { calculatePosition } from '@/core/lib/texture';
import { generateId } from '@/core/lib/utils';
import {
  AIBackgroundLayer,
  AIGradientLayer,
  AIImageLayer,
  AIPatternLayer,
  AITextLayer,
  AITextureConfig,
  Layer,
  TextureBuilderConfig,
} from '@/server/models/texture';
import {
  renderBackgroundLayer,
  renderGradientLayer,
  renderImageLayer,
  renderPatternLayer,
  renderTextLayer,
} from './renders';
import { TextureConverter } from './texture-converter';

/**
 * TextureGenerator Class
 *
 * This class is responsible for converting a JSON sent by the AI
 * into a texture configuration that can be rendered.
 */
export class TextureGenerator {
  private static colorManagement = ColorUtils;
  private static mathUtils = MathUtils;
  private static textureConverter = TextureConverter;

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
    this.textureConverter.validateConfig(baseConfig);

    // Create three random variants
    const variants: TextureBuilderConfig[] = [];

    for (let i = 0; i < variantsQuantity; i++) {
      // Create a random variant with emphasis on color
      const variant = this.createRandomVariant(baseConfig);
      variants.push(this.textureConverter.fromJSON(variant));
    }

    return variants;
  }

  /**
   * Generates three random variants of a texture configuration
   * with emphasis on color changes
   * @param jsonConfig JSON with the base texture configuration
   * @param colors Array of colors to use in the variant
   * @param images Array of images to use in the variant
   * @param numberVariants Number of variants to generate
   * @returns Array with three variant texture configurations
   */
  public static async generateVariantsByParams(
    jsonConfig: AITextureConfig | string,
    colors: string[],
    images: string[],
    numberVariants?: number,
  ): Promise<TextureBuilderConfig[]> {
    
    const variantsQuantity = numberVariants ? numberVariants : 3;
    // If a string is received, try to parse it as JSON
    const baseConfig: AITextureConfig =
      typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;

    // Validate the base configuration
    this.textureConverter.validateConfig(baseConfig);

    // Create three random variants
    const variants: TextureBuilderConfig[] = [];

    for (let i = 0; i < variantsQuantity; i++) {
      // Create a random variant with emphasis on color
      const variant = await this.createRandomVariantByParams(
        baseConfig,
        colors,
        images,
      );
      variants.push(this.textureConverter.fromJSON(variant));
    }

    return variants;
  }

  /**
   * Creates a random variant with emphasis on color changes
   * @param baseConfig Base configuration
   * @returns Configuration with random variations
   */
  private static async createRandomVariantByParams(
    baseConfig: AITextureConfig,
    colors: string[],
    images: string[],
  ): Promise<AITextureConfig> {
    const variant: AITextureConfig = {
      id: generateId(),
      width: baseConfig.width,
      height: baseConfig.height,
      layers: [],
    };

    // Generate background layers
    // Pick one or two colors from the provided colors
    // Pick 1 or 2 random colors from the array (not just the first ones)
    let backgroundColors: string[] = [];
    if (colors && colors.length > 0) {
      const count = Math.random() < 0.7 ? 2 : 1; // 70% chance to select 2, 30% chance to select 1
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      backgroundColors = shuffled.slice(0, Math.min(count, shuffled.length));
    } else {
      backgroundColors = [this.colorManagement.getRandomColor('#ffffff')];
    }
    if (backgroundColors.length === 1) {
      // Single color: full background
      const backgroundLayer: AIBackgroundLayer = {
        type: 'background',
        color: backgroundColors[0],
        width: baseConfig.width,
        height: baseConfig.height,
        position: 'top',
        zIndex: 1,
      };
      variant.layers.push(backgroundLayer);
    } else if (backgroundColors.length === 2) {
      // Two colors: split top and bottom
      const halfHeight = baseConfig.height / 2;
      const topLayer: AIBackgroundLayer = {
        type: 'background',
        color: backgroundColors[0],
        width: baseConfig.width,
        height: halfHeight,
        position: 'top',
        zIndex: 1,
      };
      const bottomLayer: AIBackgroundLayer = {
        type: 'background',
        color: backgroundColors[1],
        width: baseConfig.width,
        height: halfHeight,
        position: 'bottom',
        zIndex: 1,
      };
      variant.layers.push(topLayer, bottomLayer);
    }

    // Generate image layers one per images
    if (images && images.length > 0) {
      const imageLayerPromises = images.map(
        (imageSrc) =>
          new Promise<AIImageLayer>((resolve) => {
            const img = new window.Image();
            img.src = imageSrc;

            // Default target width and height
            const targetWidth = baseConfig.width / 4;
            const targetHeight = baseConfig.height / 4;

            img.onload = () => {
              // Calculate the aspect ratio
              const aspectRatio = img.naturalWidth / img.naturalHeight;
              let width = targetWidth;
              let height = targetHeight;
              if (aspectRatio > 1) {
                width = targetWidth;
                height = targetWidth / aspectRatio;
              } else {
                height = targetHeight;
                width = targetHeight * aspectRatio;
              }
              const imageLayer: AIImageLayer = {
                type: 'image',
                url: imageSrc,
                width,
                height,
                position: 'center',
                zIndex: 1,
              };
              resolve(imageLayer);
            };
            img.onerror = () => {
              // fallback if image fails to load
              resolve({
                type: 'image',
                url: imageSrc,
                width: targetWidth,
                height: targetHeight,
                position: 'center',
                zIndex: 1,
              });
            };
          }),
      );
      // Wait for all images to load and push layers
      const imageLayers = await Promise.all(imageLayerPromises);
      variant.layers.push(...imageLayers);
    }

    return variant;
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
      if (this.textureConverter.isBackgroundLayer(layer)) {
        // Change the background color
        const backgroundLayer = layer as AIBackgroundLayer;
        (newLayer as AIBackgroundLayer).color =
          this.colorManagement.getRandomColor(backgroundLayer.color);
      } else if (this.textureConverter.isTextLayer(layer)) {
        // Change the text color
        const textLayer = layer as AITextLayer;
        if (textLayer.color) {
          (newLayer as AITextLayer).color = this.colorManagement.getRandomColor(
            textLayer.color,
          );
        }
      } else if (this.textureConverter.isGradientLayer(layer)) {
        // Change the gradient colors
        const gradientLayer = layer as AIGradientLayer;
        const newColors = gradientLayer.colors.map((colorStop) => ({
          offset: colorStop.offset,
          color: this.colorManagement.getRandomColor(colorStop.color),
        }));
        (newLayer as AIGradientLayer).colors = newColors;
      }

      // Possibility of modifying other aspects (low probability)
      if (Math.random() < 0.4) {
        // Modify opacity
        if (layer.opacity !== undefined && layer.opacity > 0.3) {
          newLayer.opacity = this.mathUtils.addVariation(
            layer.opacity,
            0.2,
            0.2,
            1,
          );
        }
      }

      if (Math.random() < 0.2) {
        // Modify position if it doesn't have a named position
        if (!layer.position) {
          // Add a random variation to the position
          if (layer.x !== undefined) {
            newLayer.x = this.mathUtils.addVariation(
              layer.x,
              15,
              0,
              baseConfig.width || 512,
            );
          }
          if (layer.y !== undefined) {
            newLayer.y = this.mathUtils.addVariation(
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
            newLayer.width = this.mathUtils.addVariation(
              layer.width,
              0.15,
              50,
              baseConfig.width || 512,
            );
          }
          if (layer.height !== undefined) {
            newLayer.height = this.mathUtils.addVariation(
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
        if (this.textureConverter.isImageLayer(layer)) {
          const imageLayer = newLayer as AIImageLayer;
          imageLayer.rotation =
            (imageLayer.rotation || 0) + this.mathUtils.getRandomInt(-20, 20);
        } else if (this.textureConverter.isPatternLayer(layer)) {
          const patternLayer = newLayer as AIPatternLayer;
          patternLayer.scale =
            (patternLayer.scale || 1) * (0.8 + Math.random() * 0.4); // 0.8 to 1.2 times the original scale
        } else if (this.textureConverter.isTextLayer(layer)) {
          const textLayer = newLayer as AITextLayer;
          textLayer.fontSize = Math.round(
            (textLayer.fontSize || 24) * (0.9 + Math.random() * 0.2),
          ); // 0.9 to 1.1 times the original size
        } else if (
          this.textureConverter.isGradientLayer(layer) &&
          (layer as AIGradientLayer).gradientType === 'linear'
        ) {
          const gradientLayer = newLayer as AIGradientLayer;
          gradientLayer.angle =
            ((gradientLayer.angle || 0) + this.mathUtils.getRandomInt(15, 60)) %
            360;
        }
      }

      variant.layers.push(newLayer);
    }

    return variant;
  }

  /**
   * Function to convert the texture to a Blob
   * @param canvas Canvas element containing the texture
   * @param format Image format (png, jpeg, webp)
   * @param quality Image quality (0-1)
   * @returns Promise that resolves with the Blob
   */

  public static async textureToUrl(
    canvas: HTMLCanvasElement,
    format: 'png' | 'jpeg' | 'webp' = 'png',
    quality = 1,
    scale = 1,
  ): Promise<string> {
    let outputCanvas = canvas;
    if (scale > 1) {
      outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width * scale;
      outputCanvas.height = canvas.height * scale;
      const ctx = outputCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, outputCanvas.width, outputCanvas.height);
      }
    }

    const promiseBlob = new Promise<Blob>((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        `image/${format === 'jpeg' ? 'jpeg' : format}`,
        quality,
      );
    });

    const blob = await promiseBlob;
    return URL.createObjectURL(blob);
  }

  /**
   * Helper function to export the texture as an image
   * @param canvas Canvas element containing the texture
   * @param filename Name for the downloaded file
   * @param format Image format (png, jpeg, webp)
   */

  public static exportTextureAsImage(
    canvas: HTMLCanvasElement,
    filename = 'texture.png',
    format: 'png' | 'jpeg' | 'webp' = 'png',
  ): void {
    const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;

    const dataUrl = canvas.toDataURL(mimeType, 0.9);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static async renderLayer(ctx: CanvasRenderingContext2D, layer: Layer) {
    if (!layer.visible) return;

    //Recalculating the position
    if (layer.position) {
      const { x, y } = calculatePosition(
        layer.position,
        layer.width,
        layer.height,
        ctx.canvas.width,
        ctx.canvas.height,
      );
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
  }
}
