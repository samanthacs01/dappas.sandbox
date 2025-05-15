import RHFColorPicker from '@/core/commons/form-inputs/rhf-color-picker';
import RHFUploadButton from '@/core/commons/form-inputs/rhf-upload-button';

const ManualAttachmentForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6 md:mb-10">
        <img
          src={'/assistant-logo.svg'}
          alt="assistant"
          width={24}
          height={24}
        />
        <h4>
          Now I need some visual assets to be able to generate design
          suggestions for you. Fill in your brand colors and upload your logo to
          continue.
        </h4>
      </div>

      <RHFColorPicker name="colors" label="Brand colors" />
      <div className="flex">
        <RHFUploadButton
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
