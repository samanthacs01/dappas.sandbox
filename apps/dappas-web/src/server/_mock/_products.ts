import { Product } from '../product/types/product';

// Mocks simples para diferentes categorías de productos
export const electronicsProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone Premium',
    description:
      'A modern smartphone with a large display and high performance.',
    price: 699.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Laptop Pro',
    description: 'A powerful laptop for professionals and content creators.',
    price: 1299.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    description:
      'Noise-cancelling over-ear headphones with premium sound quality.',
    price: 199.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'Smart Watch',
    description:
      'Track your fitness and stay connected with this stylish smart watch.',
    price: 249.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with exceptional sound quality.',
    price: 89.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
];

export const clothingProducts: Product[] = [
  {
    id: 6,
    name: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear.',
    price: 19.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 7,
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch comfort.',
    price: 49.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 8,
    name: 'Winter Jacket',
    description:
      'Warm and stylish winter jacket with water-resistant exterior.',
    price: 129.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
];

export const homeProducts: Product[] = [
  {
    id: 9,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe.',
    price: 79.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 10,
    name: 'Robot Vacuum',
    description: 'Smart robot vacuum with mapping technology and app control.',
    price: 299.99,
    imageUrl: 'https://via.placeholder.com/150',
  },
];

// Estructura original de categoría única como en tu ejemplo
export const mockProducts: {
  category: {
    name: string;
    products: Product[];
  };
} = {
  category: {
    name: 'Electronics',
    products: [
      {
        id: 1,
        name: 'Smartphone',
        description: 'A modern smartphone with a large display.',
        price: 699.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 2,
        name: 'Laptop',
        description: 'A powerful laptop for professionals.',
        price: 1299.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones.',
        price: 199.99,
        imageUrl: 'https://via.placeholder.com/150',
      },
    ],
  },
};

export const extendedMockProducts = [
  {
    name: 'Electronics',
    products: electronicsProducts,
  },
  {
    name: 'Clothing',
    products: clothingProducts,
  },
  {
    name: 'Home & Kitchen',
    products: homeProducts,
  },
];
