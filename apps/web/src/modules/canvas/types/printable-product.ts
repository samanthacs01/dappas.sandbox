export type PrintableProduct = {
  id: string;
  printableTemplateSrc: string;
  printableArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  model: {
    name: string;
    src: string;
  };
  metadata: Record<string, string>;
};
