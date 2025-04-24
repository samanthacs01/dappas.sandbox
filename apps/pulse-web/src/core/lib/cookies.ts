'use server'

import { cookies, headers, type UnsafeUnwrappedCookies, type UnsafeUnwrappedHeaders } from 'next/headers';

export const getToken = () => {
  try {
    return ((cookies() as unknown as UnsafeUnwrappedCookies).get(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? '')?.value || '');
  } catch (e) {
    console.log('error getting token', e)
    return ''
  }
}

export const removeCookies = () => {
  try {
    (cookies() as unknown as UnsafeUnwrappedCookies).delete(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? '')
  } catch (e) {
    console.log('error removing token', e)
  }
}

export const getTokenHeader = () => {
  const headersList = (headers() as unknown as UnsafeUnwrappedHeaders)
  try {
    return {
      Cookie: headersList.get('Cookie') ?? '',
    }
  } catch (e) {
    console.log('error getting token', e)
    return { Cookie: '' }
  }
}

