import { getImageDimensions } from '@/core/lib/image';
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
  logo: File;
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
    const patterns: string[] = [];

    for (let key = 0; key < nVariants; key++) {
      const pattern: TextureBuilderConfig = {
        id: `variant-${key}`,
        width,
        height,
        layers: [],
      };
      try {
        const prompt = getPatternsPrompt(colors, styles, `${width}x${height}`);

        const image = await generateImage(prompt);

        if (image) {
          pattern.layers.push({
            id: `image-pattern-${key}`,
            type: 'image',
            imageUrl: `data:${image.mimeType};base64,${image.base64}`,
            width: width,
            height: height,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true,
            zIndex: 0,
          });
        }
      } catch (e) {
        console.error(e);
        pattern.layers.push({
          id: `error-pattern-${key}`,
          type: 'background',
          color: colors[Math.floor(Math.random() * colors.length)],
          width: width,
          height: height,
          x: 0,
          y: 0,
          opacity: 1,
          visible: true,
          zIndex: 0,
        });
      }
      const logoUrl = URL.createObjectURL(logo);
      const size = await getImageDimensions(logo);
      const aspectRatio = size.width / size.height;
      const targetWidth = width / 4;
      const targetHeight = height / 4;
      let imgWidth = targetWidth;
      let imgHeight = targetHeight;
      if (aspectRatio > 1) {
        imgWidth = targetWidth;
        imgHeight = targetWidth / aspectRatio;
      } else {
        imgHeight = targetHeight;
        imgWidth = targetHeight * aspectRatio;
      }

      if (logo) {
        pattern.layers.push({
          id: `logo-${key}`,
          type: 'image',
          imageUrl: logoUrl,
          width: imgWidth,
          height: imgHeight,
          x: (width - imgWidth) / 2,
          y: (height - imgHeight) / 2,
          position: 'center',
          opacity: 1,
          visible: true,
          zIndex: 2,
        });
      }

      const texture = await generateTextureFromConfig(pattern);
      patterns.push(texture);
    }

    return patterns;
  };

  return { generateAITextures };
};

const getPatternsPrompt = (
  colors: string[],
  styles: string[],
  resolution: string,
) => {
  return `
Act as a graphic designer specialized in packaging. Generate visual decorators in SVG or PNG format for flat rectangular packaging (some may also be used on curved surfaces like cups, but you don’t need to apply any distortion).

Design Rules:
- Select a background color from this list ${colors.join(', ')}
- Not add any text or logos to the design.
- The design must consist only of a visual pattern or decorative geometric figure (such as lines, diagonals, chevrons, bands, zigzags, frames, etc.) in a single accent color from this list ${colors.join(', ')}
- The style must be clean, professional, and modern—suitable for products like cups, boxes, or bags.
- The user brand styles are ${styles.join(', ')}.
- The output format must be SVG (preferred) or PNG with a transparent background and a minimum resolution of ${resolution} px.
    `;
};

export default useAIDesigner;
