import { dotPattern } from '@/core/components/commons/patterns/dot-pattern';
import CanvasPreviewAdjustmentsPanel from '../components/canvas-preview/canvas-preview-adjustament-panel';
import CanvasPreviewEditorPanel from '../components/canvas-preview/canvas-preview-edittor-panel';
import CanvasPreviewModelView from '../components/canvas-preview/canvas-preview-model-view';

const CanvasPreviewContainer = () => {
  return (
    <div className={'min-h-screen text-white flex flex-col'} style={dotPattern}>
      <div
        className={
          'flex flex-1 overflow-hidden relative w-full justify-end gap-4'
        }
      >
        <CanvasPreviewEditorPanel />
        <CanvasPreviewModelView />
        <CanvasPreviewAdjustmentsPanel />
      </div>
    </div>
  );
};

export default CanvasPreviewContainer;
