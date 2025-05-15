import RHFSelect from '@/core/commons/form-inputs/rhf-select';
import RHFTextField from '@/core/commons/form-inputs/rhf-text-field';

const ManualCompanyInfoForm = () => {
  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 mb-6 md:mb-10">
        <img
          src={'/assistant-logo.svg'}
          alt="assistant"
          width={24}
          height={24}
        />
        <h4>First, tell me about your company</h4>
      </div>

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
  );
};

export default ManualCompanyInfoForm;
