import { PackagingInfo } from "@/server/schemas/brand";

export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error';

export type ComponentToken = '<PackageSelector/>' | '<UploadFile/>'

export type ComponentCallback = (object: Partial<PackagingInfo>) => void