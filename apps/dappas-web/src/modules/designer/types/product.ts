/**
 * Basic size configuration with width and height
 */
export type Size = {
  width: number;
  height: number;
};

/**
 * Position configuration with x and y coordinates
 */
export type Position = {
  x: number;
  y: number;
};

/**
 * Base layer containing identification, name, size and position information
 */
export interface BaseLayer {
  id: string;
  name: string;
  size: Size;
  position: Position;
}

/**
 * Model configuration with layer information
 */
export interface ModelConfig {
  id: string;
  name: string;
  src: string;
  layers: BaseLayer[];
}

/**
 * Printable configuration with layer information
 */
export interface PrintableConfig {
  id: string;
  name: string;
  templateSrc: string;
  layers: BaseLayer[];
}

/**
 * Complete printable product type
 */
export interface PrintableProduct {
  id: string;
  printable: PrintableConfig;
  model: ModelConfig;
  metadata: Record<string, unknown>;
}
