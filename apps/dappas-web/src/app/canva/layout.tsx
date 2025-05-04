import React from 'react';
import CanvasNavButtons from '@/modules/canva/components/objects/canvas-nav-buttons';
import TextureProvider from '@/store/texture-store/provider';

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TextureProvider>
      <div className="h-screen relative">
        {children}
        <CanvasNavButtons />
      </div>
    </TextureProvider>
  );
}
