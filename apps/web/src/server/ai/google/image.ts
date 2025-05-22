import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { GeneratedFile, generateText, GenerateTextResult, ToolSet } from 'ai';

export const generateImage = async (system: string, prompt: string): Promise<GeneratedFile> => {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    });

    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      providerOptions: {
        google: { responseModalities: ['IMAGE'] },
      },
      prompt,
      system
    });
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
