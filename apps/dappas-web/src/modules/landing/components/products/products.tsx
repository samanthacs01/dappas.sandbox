'use client';

import { Product } from '@/server/shopify/types';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import ProductCard from './product-card';

type ProductsProps = {
  products: Product[];
};

const Products = ({ products }: ProductsProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true }); // 20% visible

  return (
    <div className="flex flex-col gap-y-20 p-8 bg-white w-full" ref={ref}>
      <h2 className="text-2xl font-semibold w-full lg:w-[220px]">
        Explore products and add your brand
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Products;