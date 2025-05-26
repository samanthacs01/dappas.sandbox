'use server'

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { GeneratedFile, generateText, GenerateTextResult, ToolSet } from 'ai';

export const generateImage = async (prompt: string): Promise<GeneratedFile> => {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      providerOptions: {
        google: { responseModalities: ['TEXT','IMAGE'] },
      },
      prompt
    });

    console.log('result', result);

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

const getImageFromResponse = (response: GenerateTextResult<ToolSet, never>) => {
  const image = response.files.find((file) =>
    file.mimeType.startsWith('image/'),
  );
  return image ?? null;
};
