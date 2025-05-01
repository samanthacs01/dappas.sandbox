import { ComponentToken } from '../types/chat';

export function extractComponentTags(input: string): {
  cleanedText: string;
  extractedTags: ComponentToken[];
} {
  const tagRegex = /<(PackageSelector|UploadFile)\s*\/>/g;
  const extractedTags: ComponentToken[] =
    (input.match(tagRegex) as ComponentToken[]) || [];
  const cleanedText = input.replace(tagRegex, '').trim();

  return { cleanedText, extractedTags };
}
