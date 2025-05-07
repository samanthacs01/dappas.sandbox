"use client";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { FunctionComponent } from "react";
import { useDropzone } from "react-dropzone";
import { UploadBoxProps } from "./types";

const UploadButton: FunctionComponent<UploadBoxProps> = ({
  label,
  required,
  disabled,
  accept,
  error,
  ...rest
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    disabled,
    accept,
    ...rest,
  });

  const hasError = isDragReject || error;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="upload-button">
        {required ? <span>{label} *</span> : label}
      </Label>
      <div
        className={
          "bg-primary-foreground rounded-lg flex-col justify-center items-center inline-flex h-auto p-2"
        }
        {...getRootProps()}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-4 border border-dashed w-full rounded-lg h-full cursor-pointer p-2",
            isDragActive && "bg-secondary",
            isDragReject && "border-destructive/40 border-2"
          )}
        >
          <div
            className={"flex items-center gap-4 w-full flex-row justify-start"}
          >
            <Button type="button">Choose files to upload</Button>
            <Label className="text-sm font-medium cursor-pointer hover:underline">
              or drag and drop them here
            </Label>
          </div>
          <input {...getInputProps()} />
        </div>
      </div>
      {acceptedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {acceptedFiles.map((file) => (
            <div key={file.name} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {file.size} bytes
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasError && error && (
        <Label className="text-destructive text-xs">{rest.helperText}</Label>
      )}
    </div>
  );
};

export default UploadButton;
