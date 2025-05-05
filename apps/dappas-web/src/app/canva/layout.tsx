import TextureProvider from '@/store/texture-store/provider';
import React from 'react';

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TextureProvider>
      <div className="h-screen relative">{children}</div>
    </TextureProvider>
  );
}
