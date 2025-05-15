import RHFColorPicker from '@/core/components/commons/form-inputs/rhf-color-picker';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import RHFUploadLogo from '@/modules/designer/components/fields/rhf-upload-logo';

const ManualAttachmentForm = () => {
  return (
    <div className="w-full space-y-10 flex gap-6">
      <div className="flex items-start gap-6">
        <ChatAssistantIcon
          width={16}
          height={16}
          className="min-w-4 min-h-4 mt-1"
        />
      </div>

      <div className="flex flex-col space-y-10 grow">
        <h4>
          Now I need some visual assets to be able to generate design
          suggestions for you. Fill in your brand colors and upload your logo to
          continue.
        </h4>
        <RHFColorPicker name="colors" label="Brand colors" />

        <RHFUploadLogo
          name="logo"
          label="Logotype"
          placeholder={'Drop your logo here or Choose File'}
          labelOrientation="horizontal"
        />
      </div>
    </div>
  );
};

export default ManualAttachmentForm;
