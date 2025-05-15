import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import DesignerPreview from '../components/preview/designer-preview';
import DesignerSidebar from '../components/sidebar/designer-sidebar';
import { useDesignerStore } from '../store/designer';
import { getProductById } from '../utils/products';

const ProductDesigner = () => {
  const [searchParams] = useSearchParams();
  const setActiveProduct = useDesignerStore((state) => state.setActiveProduct);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) {
      const product = getProductById(productId);
      setActiveProduct(product);
    }
  }, [searchParams, setActiveProduct]);

  return (
    <div className="w-full max-h-[calc(100vh_-_64px)] lg:max-h-screen lg:h-[calc(100vh_-_64px)] overflow-y-auto p-3">
      <div className="flex flex-col lg:flex-row w-full h-full gap-2">
        <DesignerSidebar />
        <DesignerPreview />
      </div>
    </div>
  );
};

export default ProductDesigner;
