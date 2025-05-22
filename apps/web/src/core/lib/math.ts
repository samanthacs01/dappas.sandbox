export class MathUtils {
  /**
   * Adds a variation to a numeric value
   * @param value Original value
   * @param factor Variation factor (percentage or absolute value)
   * @param min Minimum allowed value
   * @param max Maximum allowed value
   * @returns Value with variation
   */
  static addVariation(
    value: number,
    factor: number,
    min: number,
    max: number,
  ): number {
    // Determine if the factor is a percentage or an absolute value
    const isPercentage = factor <= 1;

    // Calculate the variation
    let variation;
    if (isPercentage) {
      variation = value * factor * (Math.random() * 2 - 1); // Between -factor% and +factor%
    } else {
      variation = (Math.random() * 2 - 1) * factor; // Between -factor and +factor
    }

    // Apply the variation and limit to the range
    const newValue = Math.round(value + variation);
    return Math.max(min, Math.min(newValue, max));
  }

  /**
   * Generates a random integer between min and max (both inclusive)
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random integer
   */
  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
