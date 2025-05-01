'use server';

import { google } from '@ai-sdk/google';
import { CoreMessage, generateObject } from 'ai';
import { PackagingInfo, PackagingInfoSchema } from '../../schemas/brand';

export async function extractPackagingInfo(
  messages: CoreMessage[],
  currentInfo: PackagingInfo
): Promise<PackagingInfo> {
  try {
    if (messages.length === 1) {
      return currentInfo;
    }
    let formattedMessage = '';
    messages.forEach((m) => {
      if (Array.isArray(m.content)) {
        m.content.forEach((c) => {
          if (c.type === 'text') {
            formattedMessage += `role: ${m.role},  message: ${c.text}\n`;
          }
        });
      }
    });

    const prompt = `
      You are analyzing a message history to extract details about a products packaging design.
	   • Extract information only from messages where the role is user.
	   • Messages from the role assistant are for context only — do not extract data from them.
	   • Only extract information that is explicitly stated by the user.
	   • Do not make assumptions or infer missing details.
	   • Only extract information that is explicitly mentioned. Don't make assumptions. If a field is not mentioned, leave it blank.
       • If the assistant asked the user to upload a file and the user responded with plain text instead, do not extract any information.

       Message to analyze:
       ${formattedMessage}
      `;
      
    // Generate structured data from the message
    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: PackagingInfoSchema,
      prompt,
    });

    // Merge with current info, keeping existing values if not in new extraction
    return {
      ...currentInfo,
      ...Object.fromEntries(
        Object.entries(object).filter(([, value]) => value !== undefined)
      ),
    };
  } catch (error) {
    console.error('Error extracting packaging info:', error);
    return currentInfo;
  }
}
