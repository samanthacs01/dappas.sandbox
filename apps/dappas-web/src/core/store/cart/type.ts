export type CartProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

export type CartStoreType = {
  showCart: boolean;
  products: CartProduct[];
  totalPrice: number;
  setShowCart: (show: boolean) => void;
  addProduct: (product: CartProduct) => void;
  removeProduct: (id: string) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};
