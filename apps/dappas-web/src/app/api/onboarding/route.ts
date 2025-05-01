import { PackagingInfo } from '@/server/schemas/brand';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { chatAssistantContext } from '../../../server/ai/prompts';

// Allow responses up to 2 minutes
export const maxDuration = 120;

export async function POST(req: Request) {
  const { messages, packagingInfo } = await req.json();

  // Current packaging info state
  const currentInfo: PackagingInfo = packagingInfo || {};

  // Create a system prompt that guides the AI
  const systemPrompt = `${chatAssistantContext}

Current information:
${Object.entries(currentInfo)
  .filter(([, value]) => value)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Guide the conversation to collect missing information in a friendly, conversational way.
Ask about one thing at a time. Don't overwhelm the user with multiple questions.
Information to collect: product type, brand name, logo, color preferences, style preferences, description.

If the user asks to generate a design and you have at least the product, the brand and the logo information, tell them you're ready to generate a design.`;

  // Use streamText to generate a response
  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages,
    system: systemPrompt,
    // toolChoice: 'required',
    // maxSteps: 2,
    // tools: {
    //   packageInfo,
    //   uploadFile,
    // },
  });

  return result.toDataStreamResponse();
}
