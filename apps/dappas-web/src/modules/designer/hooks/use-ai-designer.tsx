'use client';

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
        console.log('image', image);
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
          color: colors[Math.floor(Math.random() * colors.length)] ?? '',
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
      const targetWidth = width / 3;
      const targetHeight = height / 3;
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
Act as a graphic designer specialized in packaging. Create a high-quality PNG image to be used as a visual decorator for flat rectangular packaging surfaces like cups, boxes, or bags. The image must fill the entire canvas uniformly, without borders, padding, or unused space.
Choose one background color from the following: ${colors.join(', ')}. Then choose one accent color from the same list (but different from the background) to use for a decorative geometric pattern. Use only one accent color per image. Ensure strong visual contrast between background and accent.
Do not include text, logos, or typography. The design must consist only of clean, consistent, modern geometric elements like lines, diagonals, chevrons, zigzags, bands, grids, or frames. Make sure the pattern is continuous, balanced across the image, and fully fills the canvas horizontally and vertically.
The style should align with the following brand attributes: ${styles.join(', ')}. The output should be a PNG image with a minimum resolution of ${resolution}px`;
};

export default useAIDesigner;
