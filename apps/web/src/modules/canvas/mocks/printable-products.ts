import { PrintableProduct } from '../../designer/types/product';

export const printableProducts: PrintableProduct[] = [
  {
    id: '12oz-single-wall-cup',
    printable: {
      id: '12oz-single-wall-cup',
      name: '12oz Single Wall Cup',
      templateSrc: '/products/paper-cup/12oz-single-wall-cup.pdf',
      layers: [
        {
          id: 'coffee-cup',
          name: 'Coffee Cup',
          size: {
            width: 545.66929,
            height: 364.2519685,
          },
          position: {
            x: 29,
            y: 119,
          },
        },
      ],
    },
    model: {
      id: '12oz-single-wall-cup',
      name: '12oz-single-wall-cup',
      src: '',
      layers: [
        {
          id: 'coffee-cup',
          name: 'Coffee Cup',
          size: {
            width: 545.66929,
            height: 364.2519685,
          },
          position: {
            x: 0,
            y: 0,
          },
        },
      ],
    },
    metadata: {},
  },
];
