import { create } from 'zustand';
import { CartStoreType } from './type';

export const useDesignerStore = create<CartStoreType>((set) => ({
  showCart: false,
  products: [],
  totalPrice: 0,
  setShowCart: (show) => set(() => ({ showCart: show })),
  addProduct: (product) =>
    set((state) => {
      // if the product already exists, update the quantity
      const existingProduct = state.products.find((p) => p.id === product.id);
      if (existingProduct) {
        return {
          products: state.products.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + product.quantity }
              : p,
          ),
          totalPrice: state.totalPrice + product.price * product.quantity,
        };
      }
      // if the product does not exist, add it to the cart
      return {
        products: [...state.products, product],
        totalPrice: state.totalPrice + product.price * product.quantity,
      };
    }),
  removeProduct: (id) =>
    set((state) => {
      const productToRemove = state.products.find((p) => p.id === id);
      if (!productToRemove) return state;
      return {
        products: state.products.filter((p) => p.id !== id),
        totalPrice:
          state.totalPrice - productToRemove.price * productToRemove.quantity,
      };
    }),
  updateProductQuantity: (id, quantity) =>
    set((state) => {
      const productToUpdate = state.products.find((p) => p.id === id);
      if (!productToUpdate) return state;
      const priceDifference =
        (quantity - productToUpdate.quantity) * productToUpdate.price;
      return {
        products: state.products.map((p) =>
          p.id === id ? { ...p, quantity } : p,
        ),
        totalPrice: state.totalPrice + priceDifference,
      };
    }),
  clearCart: () =>
    set(() => ({
      products: [],
      totalPrice: 0,
    })),
}));
