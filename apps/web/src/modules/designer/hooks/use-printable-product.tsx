import { getFileFromUrl } from '@/core/lib/file';
import { insertImageIntoPdf } from '@/core/lib/pdf';
import { mmToPt } from '@/core/lib/units';
import { PrintableProduct } from '../../designer/types/printable-product';

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

    const pdf = await getFileFromUrl(product.printableTemplateSrc);
    const modifiedPdf = await insertImageIntoPdf(pdf, image, {
      width: mmToPt(product.printableArea.width),
      height: mmToPt(product.printableArea.height),
      x: product.printableArea.x,
      y: product.printableArea.y,
    });
    return modifiedPdf;
  };

  return { getPrintableProductPdf };
};

export default usePrintableProduct;
