import RHFSelect from '@/core/components/commons/form-inputs/rhf-select';
import RHFTextField from '@/core/components/commons/form-inputs/rhf-text-field';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';

const ManualCompanyInfoForm = () => {
  return (
    <div className="w-full space-y-10 flex gap-6">
      <div className="flex items-start">
        <ChatAssistantIcon
          width={16}
          height={16}
          className="min-w-4 min-h-4 mt-1"
        />
      </div>
      <div className="flex flex-col space-y-1.5 grow">
        <h4 className='pb-8'>First, tell me about your company</h4>
        <RHFTextField
          name="companyName"
          label="Company Name"
          placeholder="Enter company name"
          labelOrientation="horizontal"
          className="rounded-none"
        />
        <RHFSelect
          name="industry"
          label="Industry"
          placeholder="Select an industry"
          options={[]}
          labelOrientation="horizontal"
          className="rounded-none"
        />
        <RHFTextField
          name="location"
          placeholder="Enter location"
          label="Location"
          labelOrientation="horizontal"
          className="rounded-none"
        />
        <RHFTextField
          name="website"
          placeholder="Enter website"
          label="Website"
          labelOrientation="horizontal"
          className="rounded-none"
        />
      </div>
    </div>
  );
};

export default ManualCompanyInfoForm;
