import RHFColorPicker from '@/core/components/commons/form-inputs/rhf-color-picker';
import ChatAssistantIcon from '@/core/components/commons/icons/chat-assistant';
import RHFUploadLogo from '@/modules/designer/components/fields/rhf-upload-logo';
import { useDesignerStore } from '@/modules/designer/store/designer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { ChevronRight } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { ColorsLogoSchema, ColorsLogoType } from './schemas';

type Props = {
  onSuccess?: () => void;
  onGenerateDesign?: () => void;
};

const ManualAttachmentForm: React.FC<Props> = ({ onSuccess, onGenerateDesign }) => {
  const brand = useDesignerStore((state) => state.brand);
  const setBrand = useDesignerStore((state) => state.setBrand);
  const methods = useForm<ColorsLogoType>({
    defaultValues: {
      colors: brand.colors || [],
      logo: brand.logo,
    },
    resolver: zodResolver(ColorsLogoSchema),
  });

  const onSubmit = (data: ColorsLogoType) => {
    setBrand({ ...brand, ...data });
    onSuccess?.();
  };

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        <div className="flex flex-col w-full">
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
                suggestions for you. Fill in your brand colors and upload your
                logo to continue.
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
          {(brand.colors ?? []).length > 0 && (
            <div className="w-full space-y-10 flex gap-6 pt-10">
              <div className="flex items-start gap-6">
                <ChatAssistantIcon
                  width={16}
                  height={16}
                  className="min-w-4 min-h-4 mt-1"
                />
              </div>
              <h4>
                Great, now im ready to generate some more elaborate design
                suggestions for you!
              </h4>
            </div>
          )}
        </div>
        {(brand.colors ?? []).length > 0 ? (
          <Button
            type="submit"
            className="rounded-none font-light"
            onClick={onGenerateDesign}
          >
            Generate Designs <ChevronRight />
          </Button>
        ) : (
          <Button
            type="submit"
            className="rounded-none font-light"

          >
            Continue <ChevronRight />
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default ManualAttachmentForm;
