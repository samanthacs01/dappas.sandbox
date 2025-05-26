'use server';

import { createOpenAI } from '@ai-sdk/openai';
import {
  Experimental_GenerateImageResult,
  GeneratedFile,
  experimental_generateImage as generateImageExp
} from 'ai';

export const generateImage = async (prompt: string): Promise<GeneratedFile> => {
  try {
    const openai = createOpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const result = await generateImageExp({
      model: openai.image('gpt-image-1'),
      providerOptions: {
        openai: { quality: 'high' },
      },
      prompt,
    });

    console.log('result', result)

    const image = getImageFromResponse(result);
    if (!image) {
      throw new Error('No image found in response');
    }
    return image;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

const getImageFromResponse = (response: Experimental_GenerateImageResult) => {
  const image = response.images.find((file) =>
    file.mimeType.startsWith('image/'),
  );
  return image ?? null;
};
