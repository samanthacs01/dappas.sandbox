import { PrintableProduct } from '../types/product';

// mocked impressible product service
export const getProductById = (id: string): PrintableProduct => {
  console.log('getProductById', id);
  return {
    id: 'coffee-cup',
    printable: {
      id: 'CoffeeCup',
      name: 'CoffeeCup',
      templateSrc: '/products/paper-cup/12on-single-wall-cup.pdf',
      // this is the size of the image in mm
      // 192.5mm x 128.5mm
      layers: [
        {
          id: 'coffee-cup',
          name: 'Coffee Cup',
          size: {
            width: 192.5,
            height: 128.5,
          },
          position: {
            x: 29,
            y: 119,
          },
        },
      ],
    },
    model: {
      id: 'CoffeeCupModel',
      name: 'CoffeeCupModel',
      src: '/models/CoffeeCup.glb',
      layers: [
        {
          id: 'coffee-cup',
          name: 'Coffee Cup',
          size: {
            width: 192.5,
            height: 128.5,
          },
          position: {
            x: 0,
            y: 0,
          },
        },
        {
          id: 'coffee-cup',
          name: 'Coffee Cup',
          size: {
            width: 1000,
            height: 100,
          },
          position: {
            x: 100,
            y: 100,
          },
        },
      ],
    },
    metadata: {},
  };
};
