import { generateImage } from '@/server/ai/google/image';
import { TextureBuilderConfig } from '@/server/models/texture';
import useTextureDesigner from './use-texture-designer';

type GenerateNPatternsOptions = {
  nVariants: number;
  colors: string[];
  styles: string[];
  size: {
    width: number;
    height: number;
  };
  logo: string;
};

const useAIDesigner = () => {
  const { generateTextureFromConfig } = useTextureDesigner();

  const generateAITextures = async ({
    nVariants,
    colors,
    styles,
    size: { width, height },
    logo,
  }: GenerateNPatternsOptions): Promise<string[]> => {
    // select the 3 background colors from the colors array, pick n random colors without repeating
    const selectedColors = colors
      .sort(() => 0.5 - Math.random())
      .slice(0, nVariants);
    const patterns: string[] = [];

    if (selectedColors.length > 0) {
      selectedColors.forEach(async (color, key) => {
        const pattern: TextureBuilderConfig = {
          id: `variant-${key}`,
          width,
          height,
          layers: [
            {
              id: `background-${key}`,
              type: 'background',
              color,
              x: 0,
              y: 0,
              visible: true,
              opacity: 1,
              width: width,
              height: height,
              zIndex: 0,
            },
            {
              id: `logo-${key}`,
              type: 'image',
              position: 'center',
              width: 100,
              height: 100,
              x: width / 2 - 50,
              y: height / 2 - 50,
              visible: true,
              opacity: 1,
              imageUrl: logo,
              zIndex: 2,
            },
          ],
        };
        try {
          const prompt = getPatternsPrompt(
            colors,
            color,
            styles,
            `${width}x${height}`,
          );

          const image = await generateImage(
            'Act as a graphic designer specialized in packaging.',
            prompt,
          );

          if (image) {
            pattern.layers.push({
              id: `image-pattern-${key}`,
              type: 'image',
              imageUrl: image.base64,
              width: width,
              height: height,
              x: 0,
              y: 0,
              opacity: 1,
              visible: true,
              zIndex: 1,
            });
          }
        } catch (e) {
          console.error(e);
        }
        const texture = await generateTextureFromConfig(pattern);
        patterns.push(texture);
      });
    }

    return patterns;
  };

  return { generateAITextures };
};

const getPatternsPrompt = (
  colors: string[],
  bgColor: string,
  styles: string[],
  resolution: string,
) => {
  return `
Generate visual decorators in SVG or PNG format for flat rectangular packaging (some may also be used on curved surfaces like cups, but you don’t need to apply any distortion).

Design Rules:
- Do not apply any background color. I will provide the background color separately in the final design.
- The design must consist only of a visual pattern or decorative geometric figure (such as lines, diagonals, chevrons, bands, zigzags, frames, etc.) in a single accent color from this list ${colors.join(', ')}, take in account that the background color of the product is ${bgColor}.
- The style must be clean, professional, and modern—suitable for products like cups, boxes, or bags.
- The user brand styles are ${styles.join(', ')}.
- The design should consider that a centered logo will be placed on top, so leave a visually clear area (either empty or minimally interfered with).
- The output format must be SVG (preferred) or PNG with a transparent background and a minimum resolution of ${resolution} px.
    `;
};

export default useAIDesigner;
