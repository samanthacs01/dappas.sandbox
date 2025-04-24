'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export const revalidateServerTags = async (tag: string | string[]) => { 
  if (Array.isArray(tag)) {
    for (const t of tag) {
      revalidateTag(t);
    }
    return;
  }
  revalidateTag(tag);
};

export const revalidateServerPath = async (
  path: string,
  type: 'page' | 'layout',
) => {
  revalidatePath(path, type);
};
