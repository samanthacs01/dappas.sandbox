'use client';
import React from 'react';
import EditorPanel from '@/modules/canva/components/3d-view/editor-panel';
import AdjustmentPanel from '@/modules/canva/components/3d-view/adjustament-panel';
import ModelViewer from '@/modules/canva/components/3d-view/model-viewer';
import { dotPattern } from '@/modules/canva/components/3d-view/dot-style';

const Canva3DViewContainer = () => {
  return (
    <div className={'min-h-screen text-white flex flex-col'} style={dotPattern}>
      <div
        className={
          'flex flex-1 overflow-hidden relative w-full justify-end gap-4'
        }
      >
        <EditorPanel />
        <ModelViewer />
        <AdjustmentPanel />
      </div>
    </div>
  );
};

export default Canva3DViewContainer;
