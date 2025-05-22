import RHFSelect from '@/core/components/commons/form-inputs/rhf-select';
import RHFTextField from '@/core/components/commons/form-inputs/rhf-text-field';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { ChevronRight } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { BrandBasicInfoSchema, BrandBasicInfoType } from './schemas';

type Props = {
  onSuccess?: () => void;
};

const ManualCompanyInfoForm: React.FC<Props> = ({ onSuccess }) => {
  const brand = useDesignerStore((state) => state.brand);
  const setBrand = useDesignerStore((state) => state.setBrand);
  const methods = useForm<BrandBasicInfoType>({
    defaultValues: {
      name: brand.name || '',
      industry: brand.industry || '',
      website: brand.website || '',
      location: brand.location || '',
    },
    resolver: zodResolver(BrandBasicInfoSchema),
  });

  const onSubmit = (data: BrandBasicInfoType) => {
    const urlParsed = `https://${data.website}`;
    setBrand({ ...brand, ...data, website: urlParsed });
    onSuccess?.();
  };

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        <div className="w-full space-y-10 flex gap-6">
          <div className="flex items-start">
            <ChatAssistantIcon
              width={16}
              height={16}
              className="min-w-4 min-h-4 mt-1"
            />
          </div>
          <div className="flex flex-col space-y-1.5 grow">
            <h4 className="pb-8 text-reveal">
              First, tell me about your company
            </h4>
            <div
              className="animate-reveal-y flex flex-col  space-y-1.5"
              style={{ '--delay': '0.2s' } as React.CSSProperties}
            >
              <RHFTextField
                name="name"
                label="Company Name"
                placeholder="Enter company name"
                labelOrientation="horizontal"
                className="rounded-none"
              />
              <RHFSelect
                name="industry"
                label="Industry"
                placeholder="Select an industry"
                options={[{ label: 'Coffee Shop/Café', value: 'coffee-shop' }]}
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
        </div>
        <Button type="submit" className="rounded-none font-light">
          Continue <ChevronRight />
        </Button>
      </form>
    </FormProvider>
  );
};

export default ManualCompanyInfoForm;
