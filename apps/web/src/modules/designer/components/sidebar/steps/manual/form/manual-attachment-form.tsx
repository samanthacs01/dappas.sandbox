import { RHFBadgeOverflow } from '@/core/components/commons/form-inputs/rhf-badge-overflow';
import RHFColorPicker from '@/core/components/commons/form-inputs/rhf-color-picker';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import { styleOptions } from '@/core/mocks/styles-options';
import RHFUploadLogo from '@/modules/designer/components/fields/rhf-upload-logo';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ColorsLogoSchema, ColorsLogoType } from './schemas';

type Props = {
  onSuccess?: () => void;
  onGenerateDesign?: () => void;
  onGenerateLocalDesign?: () => void;
};

const ManualAttachmentForm: React.FC<Props> = ({
  onSuccess,
  onGenerateLocalDesign,
  onGenerateDesign,
}) => {
  const brand = useDesignerStore((state) => state.brand);
  const setBrand = useDesignerStore((state) => state.setBrand);
  const ref = useRef<HTMLDivElement>(null);
  const methods = useForm<ColorsLogoType>({
    defaultValues: {
      colors: brand.colors || [],
      logo: brand.logo,
      styles: brand.styles || [],
    },
    resolver: zodResolver(ColorsLogoSchema),
  });

  const onSubmit = (data: ColorsLogoType) => {
    setBrand({ ...brand, ...data });
    onSuccess?.();
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        <div className="flex flex-col w-full grow overflow-y-auto pb-6">
          <div className="w-full space-y-10 flex gap-6">
            <div className="flex items-start gap-6">
              <ChatAssistantIcon
                width={16}
                height={16}
                className="min-w-4 min-h-4 mt-1"
              />
            </div>

            <div className="flex flex-col space-y-10 grow">
              <h4 className="text-reveal">
                Now I need some visual assets to be able to generate design
                suggestions for you. Fill in your brand colors and upload your
                logo to continue.
              </h4>

              <div
                className="animate-reveal-y flex flex-col  space-y-10"
                style={{ '--delay': '0.8s' } as React.CSSProperties}
              >
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
                  badgeContainerClassName="border border-black p-4"
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
        {(brand.colors ?? []).length > 0 ? (
          <Button
            type="button"
            className="rounded-none font-light"
            onClick={onGenerateDesign}
          >
            Generate designs <ChevronRight />
          </Button>
        ) : (
          <Button
            type="submit"
            className="rounded-none font-light"
            onClick={onGenerateLocalDesign}
          >
            Continue <ChevronRight />
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default ManualAttachmentForm;
