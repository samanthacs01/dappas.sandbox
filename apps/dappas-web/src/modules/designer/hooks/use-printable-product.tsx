'use client';

import { getFileFromUrl } from '@/core/lib/file';
import { insertImageIntoPdf } from '@/core/lib/pdf';
import { mmToPt } from '@/core/lib/units';
import { PrintableProduct } from '../types/product';

const usePrintableProduct = () => {
  const getPrintableProductPdf = async (
    product: PrintableProduct,
    imageSrc: string | File,
  ): Promise<Blob> => {
    let image = null;

    if (imageSrc instanceof File) {
      image = imageSrc;
    }
    if (typeof imageSrc === 'string') {
      image = await getFileFromUrl(imageSrc);
    }

    if (!image) {
      throw new Error('The image file can not be converted');
    }

    const pdf = await getFileFromUrl(product.printable.templateSrc);
    const modifiedPdf = await insertImageIntoPdf(pdf, image, {
      width: mmToPt(product.printable.layers?.[0]?.size?.width ?? 100),
      height: mmToPt(product.printable.layers?.[0]?.size?.height ?? 100),
      x: product.printable.layers?.[0]?.position?.x ?? 0,
      y: product.printable.layers?.[0]?.position?.y ?? 0,
    });
    return modifiedPdf;
  };

  return { getPrintableProductPdf };
};

export default usePrintableProduct;
