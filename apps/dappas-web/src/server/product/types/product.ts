export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
};

export type ProductCategory = {
  name: string;
  products: Product[];
};
