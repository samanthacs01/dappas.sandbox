
import DesignerPreview from '../components/preview/designer-preview';
import DesignerSidebar from '../components/sidebar/designer-sidebar';
import { getProductById } from '../utils/products';

const ProductDesigner = async ({ productId }: { productId: string }) => {
  const product = await getProductById(productId);

  return (
    <div className="w-full max-h-[calc(100vh_-_64px)] lg:max-h-screen lg:h-[calc(100vh_-_64px)] overflow-y-auto p-3">
      <div className="flex flex-col lg:flex-row w-full h-full gap-2">
        <DesignerSidebar />
        {product && <DesignerPreview product={product} />}
      </div>
    </div>
  );
};

export default ProductDesigner;
