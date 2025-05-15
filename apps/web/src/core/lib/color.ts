export class ColorUtils {
  /**
   * Generates a random color based on a base color
   * @param baseColor Base color in hexadecimal format
   * @returns New random color
   */
  static getRandomColor(baseColor: string): string {
    // Different strategies for generating random colors
    const strategies = [
      // Complementary color
      () => this.getComplementaryColor(baseColor),
      // Color with similar hue but different saturation/lightness
      () => this.getColorWithVariation(baseColor),
      // Completely random but harmonious color
      () => this.getHarmonizedRandomColor(baseColor),
    ];

    // Choose a random strategy
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    if (strategy) {
      return strategy();
    }
    throw new Error('No valid strategy found for generating a random color');
  }

  /**
   * Gets the complementary color of a hexadecimal color
   * @param hexColor Color in hex format
   * @returns Complementary color
   */
  static getComplementaryColor(hexColor: string): string {
    // Make sure the color has the correct format
    if (!hexColor.startsWith('#')) {
      hexColor = '#' + hexColor;
    }

    // Convert to RGB
    let r = Number.parseInt(hexColor.slice(1, 3), 16);
    let g = Number.parseInt(hexColor.slice(3, 5), 16);
    let b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Calculate the complementary (invert the values)
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // Convert back to hexadecimal
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Gets a color with variations in saturation and lightness
   * but maintaining a similar hue
   * @param hexColor Color in hex format
   * @returns New color with variations
   */
  private static getColorWithVariation(hexColor: string): string {
    // Make sure the color has the correct format
    if (!hexColor.startsWith('#')) {
      hexColor = '#' + hexColor;
    }

    // Convert to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Convert to HSL
    const [h, s, l] = this.rgbToHsl(r, g, b);

    // Vary the saturation and lightness
    const newS = Math.min(1, Math.max(0, s + (Math.random() * 0.4 - 0.2))); // ±20%
    const newL = Math.min(0.9, Math.max(0.1, l + (Math.random() * 0.4 - 0.2))); // ±20%

    // Convert back to RGB
    const [newR, newG, newB] = this.hslToRgb(h, newS, newL);

    // Convert to hexadecimal
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG)
      .toString(16)
      .padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  }

  /**
   * Gets a random color but harmonized with the base color
   * @param hexColor Color in hex format
   * @returns New harmonized random color
   */
  private static getHarmonizedRandomColor(hexColor: string): string {
    // Make sure the color has the correct format
    if (!hexColor.startsWith('#')) {
      hexColor = '#' + hexColor;
    }

    // Convert to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Convert to HSL
    const [h] = this.rgbToHsl(r, g, b);

    // Generate a new harmonious hue (±60° or ±30°)
    const shifts = [30, 60, 120, 180, 240, 300];
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    const newH = (h + (shift ?? 0)) % 360;

    // Generate random but harmonious saturation and lightness
    const newS = 0.4 + Math.random() * 0.6; // 40-100%
    const newL = 0.3 + Math.random() * 0.4; // 30-70%

    // Convert back to RGB
    const [newR, newG, newB] = this.hslToRgb(newH, newS, newL);

    // Convert to hexadecimal
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG)
      .toString(16)
      .padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  }

  /**
   * Converts RGB to HSL
   * @param r Red component (0-255)
   * @param g Green component (0-255)
   * @param b Blue component (0-255)
   * @returns [h, s, l] where h is 0-360, s and l are 0-1
   */
  private static rgbToHsl(
    r: number,
    g: number,
    b: number,
  ): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return [h, s, l];
  }

  /**
   * Converts HSL to RGB
   * @param h Hue (0-360)
   * @param s Saturation (0-1)
   * @param l Lightness (0-1)
   * @returns [r, g, b] where r, g, b are 0-255
   */
  private static hslToRgb(
    h: number,
    s: number,
    l: number,
  ): [number, number, number] {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, (h / 360 + 1 / 3) % 1);
      g = hue2rgb(p, q, (h / 360) % 1);
      b = hue2rgb(p, q, (h / 360 - 1 / 3 + 1) % 1);
    }

    return [r * 255, g * 255, b * 255];
  }
}
