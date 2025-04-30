import { extractPackagingInfo } from '@/server/ai/lib/packaging';

export async function POST(req: Request) {
  const { messages, currentInfo } = await req.json();

  try {
    // Extract packaging info from the user's message
    const updatedInfo = await extractPackagingInfo(
      messages,
      currentInfo
    );

    return Response.json({ updatedInfo });
  } catch (error) {
    console.error('Error extracting info:', error);
    return Response.json(
      { error: 'Failed to extract information' },
      { status: 500 }
    );
  }
}
