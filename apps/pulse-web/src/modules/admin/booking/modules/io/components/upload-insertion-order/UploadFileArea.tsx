'use client';

import { CircularLoading } from '@/core/components/common/loading/circular-loading';
import { Button } from '@/core/components/ui/button';
import { DialogFooter } from '@/core/components/ui/dialog';
import { Label } from '@/core/components/ui/label';
import { Progress } from '@/core/components/ui/progress';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { convertTo2DArray } from '@/core/lib/array';
import { revalidateServerTags } from '@/core/lib/cache';
import { paths } from '@/core/lib/routes';
import { cn } from '@/core/lib/utils';
import { createInsertionOrder } from '@/server/services/booking';
import { UploadedDocument } from '@/server/types/booking';
import { CloudUpload, FileUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useMemo, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { UploadedFileTable } from './UploadedFileTable';

type UploadFileAreaProps = {
  onClose: VoidFunction;
};

export const UploadFileArea: FC<UploadFileAreaProps> = ({ onClose }) => {
  const router = useRouter();
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  const handleFileUpload = (acceptedFiles: FileWithPath[]) => {
    const newDocuments: UploadedDocument[] = [
      ...uploadedDocuments,
      ...acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      })),
    ];

    setUploadedDocuments(newDocuments);
  };

  const removeDocument = (fileToRemove: FileWithPath) => {
    setUploadedDocuments((currentDocuments) =>
      currentDocuments.filter((doc) => doc.file !== fileToRemove),
    );
  };

  const hasDocuments = useMemo(
    () => !!uploadedDocuments.length,
    [uploadedDocuments.length],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { 'application/pdf': ['.pdf'] },
      onDrop: handleFileUpload,
      disabled: loading,
    });

  const uploadDocuments = async () => {
    setLoading(true);
    const totalDocuments = uploadedDocuments.length;

    try {
      const uploadBashes = convertTo2DArray(uploadedDocuments, 10);

      for (let index = 0; index < uploadBashes.length; index++) {
        const formData = new FormData();
        uploadBashes[index].forEach((doc) => {
          formData.append('files', doc.file);
        });
        const res = await createInsertionOrder(formData);
        if (!res.success) {
          throw new Error();
        }

        setPercent((10 * (index + 1) * 100) / totalDocuments);
      }

      onClose();
      setLoading(false);
      toast.success('Files uploaded successfully');
      await revalidateServerTags('drafts');
      await revalidateServerTags('draft-information');
      router.push(paths.booking.drafts.root);
    } catch (e) {
      toast.error('Failed to upload files');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col  gap-4">
        <div
          className={cn(
            'bg-primary-foreground rounded-lg flex-col justify-center items-center inline-flex h-96 p-4',
            hasDocuments && 'h-auto p-2',
            loading && 'opacity-60',
          )}
          {...getRootProps()}
        >
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-4 border border-dashed w-full rounded-lg h-full cursor-pointer',
              isDragActive && 'bg-secondary',
              isDragReject && 'border-destructive/40 border-2',
              hasDocuments && 'h-auto',
            )}
          >
            <CloudUpload
              className={cn('w-10 h-10', hasDocuments && 'hidden')}
            />
            <div
              className={cn(
                'flex flex-col items-center gap-4 w-full',
                hasDocuments && 'flex-row justify-start',
              )}
            >
              <Button disabled={loading}>Choose files to upload</Button>
              <Label
                className={cn(
                  'text-sm font-medium cursor-pointer',
                  !loading && 'hover:underline',
                )}
              >
                or drag and drop them here
              </Label>
            </div>
            <input {...getInputProps()} data-cy="upload-file-input" />
          </div>
        </div>
        <ScrollArea
          className={cn('max-h-72', !uploadedDocuments.length && 'hidden')}
        >
          <UploadedFileTable
            data={uploadedDocuments}
            removeDocument={removeDocument}
            disabled={loading}
          />
        </ScrollArea>
      </div>
      <DialogFooter>
        <div className="flex flex-col w-full gap-4">
          <div
            className={cn('hidden gap-2 transition-all ', loading && 'flex')}
          >
            <div>
              <FileUp className="h-8 w-8" />
            </div>
            <div className="w-full space-y-1">
              <Label className="text-base font-semibold">Uploading files</Label>
              <Progress value={percent} data-cy="upload-file-progress-bar" />
              <Label className="text-muted-foreground text-sm font-normal">
                {percent.toFixed(2)}% Completed
              </Label>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <Button
              variant={'outline'}
              onClick={onClose}
              disabled={loading}
              data-cy="upload-file-cancel-button"
            >
              Cancel
            </Button>
            <Button
              disabled={!uploadedDocuments.length || loading}
              onClick={uploadDocuments}
              data-cy="upload-file-upload-button"
            >
              Upload files
              <CircularLoading loading={loading} />
            </Button>
          </div>
        </div>
      </DialogFooter>
    </>
  );
};
