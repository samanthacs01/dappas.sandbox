import RHFCombobox from '@/core/components/common/form-inputs/rhf-combobox';
import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import RHFUploadButton from '@/core/components/common/form-inputs/rhf-upload-button';
import { Button } from '@/core/components/ui/button';
import { getRemainingMonths } from '@/core/lib/date';
import { getProductionsNomenclator } from '@/server/services/nomenclator';
import { ComboBoxOption } from '@/server/types/combo-box';
import { NewExpenseDTO } from '@/server/types/expenses';
import { Loader2 } from 'lucide-react';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  onClose: () => void;
  loading: boolean;
  isRegister?: boolean;
  isEditing?: boolean;
};

const NewExpenseForm: FunctionComponent<Props> = ({
  loading,
  onClose,
  isRegister,
  isEditing,
}) => {
  const { setValue, formState, watch } = useFormContext<NewExpenseDTO>();
  const [options, setOptions] = useState<ComboBoxOption[]>([]);
  const files = watch('files');

  const isValidForm = useMemo(
    () => formState.isValid && formState.isDirty,
    [formState.isValid, formState.isDirty],
  );

  const getProductions = async () => {
    const data = await getProductionsNomenclator();
    if (data) {
      setOptions(data);
    }
  };

  useEffect(() => {
    getProductions();
  }, []);

  const handleOnSetFiles = useCallback((acceptedFiles: File[]) => {
    const filesAccepted =
      files?.length > 0 ? [...files, ...acceptedFiles] : acceptedFiles;

    return setValue('files', filesAccepted, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow p-6 rounded-lg ">
        <RHFCombobox
          name="production_id"
          options={options}
          label={'Production'}
          placeholder="Select the production"
          disabled={isRegister}
          required
          valueType="number"
        />
        <RHFCombobox
          name="month"
          options={getRemainingMonths()}
          label={'Month'}
          placeholder="Select the month"
          required
        />
        <RHFTextField
          name="total_deduction"
          placeholder="E.g: 564"
          label="Total deduction"
          type="number"
          required
        />

        <div className="col-span-2">
          <RHFUploadButton
            name="files"
            label="Upload expenses files*"
            onDrop={handleOnSetFiles}
            accept={{
              'application/pdf': ['.pdf'],
              'application/image': ['.jpg', '.jpeg', '.png', '.webp', '.heic'],
            }}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading || !isValidForm}>
          {loading ? (
            <span className="flex gap-1 w-24 justify-center">
              <Loader2 className="animate-spin" />
            </span>
          ) : isRegister ? (
            'Register expense'
          ) : isEditing ? (
            'Save changes'
          ) : (
            'Create expense'
          )}
        </Button>
      </div>
    </>
  );
};

export default NewExpenseForm;
