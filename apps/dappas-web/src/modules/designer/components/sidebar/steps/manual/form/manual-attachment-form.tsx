'use client';

import { RHFBadgeOverflow } from '@/core/components/commons/form-inputs/rhf-badge-overflow';
import RHFColorPicker from '@/core/components/commons/form-inputs/rhf-color-picker';
import RHFSelect from '@/core/components/commons/form-inputs/rhf-select';
import RHFTextField from '@/core/components/commons/form-inputs/rhf-text-field';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import { styleOptions } from '@/core/mocks/styles-options';
import RHFUploadLogo from '@/modules/designer/components/fields/rhf-upload-logo';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { ChevronRight, Loader } from 'lucide-react';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ColorsLogoSchema, ManualInfoType } from './schemas';

type Props = {
  onGenerateDesign?: (data: ManualInfoType) => void;
};

const ManualAttachmentForm: React.FC<Props> = ({
  onGenerateDesign,
}) => {
  const brand = useDesignerStore((state) => state.brand);
  const setBrand = useDesignerStore((state) => state.setBrand);
  const isDesigning = useDesignerStore((state) => state.isDesigning);

  const ref = useRef<HTMLDivElement>(null);
  const methods = useForm<ManualInfoType>({
    defaultValues: {
      colors: brand.colors || [],
      logo: brand.logo,
      styles: brand.styles || [],
      industry: brand.industry,
      name: brand.name,
    },
    resolver: zodResolver(ColorsLogoSchema),
  });

  const onSubmit = (data: ManualInfoType) => {
    setBrand({ ...brand, ...data });
    onGenerateDesign?.(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        <div className="flex flex-col w-full grow overflow-y-auto pb-6">
          <div className="w-full space-y-10 flex gap-6 relative ">
            <div className="flex items-start gap-6 absolute ">
              <ChatAssistantIcon
                width={16}
                height={16}
                className="min-w-4 min-h-4 mt-1"
              />
            </div>

            <div className="flex flex-col space-y-10 grow">
              <h4 className="text-reveal pl-8">
                Now I need some visual assets to be able to generate design
                suggestions for you. Fill in your brand colors and upload your
                logo to continue.
              </h4>

              <div
                className="animate-reveal-y flex flex-col  space-y-4"
                style={{ '--delay': '0.8s' } as React.CSSProperties}
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
                  options={[
                    { label: 'Coffee Shop/Café', value: 'coffee-shop' },
                  ]}
                  labelOrientation="horizontal"
                  className="rounded-none"
                />
                <RHFColorPicker name="colors" label="Brand colors" />

                <RHFUploadLogo
                  name="logo"
                  label="Logotype"
                  placeholder={'Drop your logo here or Choose File'}
                  labelOrientation="horizontal"
                />

                <RHFBadgeOverflow
                  label="Brand Styles"
                  name="styles"
                  options={styleOptions}
                  maxVisible={4}
                  badgeContainerClassName="border border-black p-4 max-w-[350px]"
                />
              </div>
            </div>
          </div>
          {(brand.colors ?? []).length > 0 && (
            <div className="w-full space-y-10 flex gap-6 pt-10">
              <div className="flex items-start gap-6">
                <ChatAssistantIcon
                  width={16}
                  height={16}
                  className="min-w-4 min-h-4 mt-1"
                />
              </div>
              <h4 className="text-reveal">
                Great, now im ready to generate some more elaborate design
                suggestions for you!
              </h4>
            </div>
          )}
          <div ref={ref} />
        </div>

        <Button
          type="submit"
          className="rounded-none font-light"
          disabled={isDesigning}
        >
          Generate designs{' '}
          {isDesigning ? <Loader className="animate-spin" /> : <ChevronRight />}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ManualAttachmentForm;
