'use server';

import { authOptions } from "@/core/lib/auth";
import { getServerSession } from "next-auth";

export const fetchWithAuth = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const newInit = { ...init };
  newInit.headers = newInit.headers
    ? new Headers(newInit.headers)
    : new Headers();

  // Add Authorization header
  const session = await getServerSession(authOptions)

  if (session?.user.token) {
    newInit.headers.append('Authorization', `Bearer ${session.user.token}`);
  }

  return fetch(`${input}`, newInit);
};
