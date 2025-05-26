'use client';

import { useDesignerStore } from '@/modules/designer/store/designer';
import AddCartForm from './add-cart-form';

const AddToCartContainer = () => {
  const activeTexture = useDesignerStore((state) => state.activeTexture);
  return (
    <AddCartForm
      product={{
        id: '1',
        name: 'Coffee Cup',
        description: 'Coffee Cup',
        image: activeTexture,
        price: 0.05,
        quantity: 250,
      }}
    />
  );
};

export default AddToCartContainer;
