import { PrintableProduct } from '../types/printable-product';
import { getFileFromUrl } from '../utils/file';
import { insertImageIntoPdf } from '../utils/pdf';

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
      width: product.printableArea.width,
      height: product.printableArea.height,
      x: product.printableArea.x,
      y: product.printableArea.y,
    });
    return modifiedPdf;
  };

  return { getPrintableProductPdf };
};

export default usePrintableProduct;
