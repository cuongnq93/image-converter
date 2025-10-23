import type { IConversionStrategy } from '../interfaces/conversion-strategy.interface';
import { ImageFormat } from '../types/image.types';
import { JpegConversionStrategy } from '../strategies/jpeg-conversion.strategy';
import { PngConversionStrategy } from '../strategies/png-conversion.strategy';
import { WebpConversionStrategy } from '../strategies/webp-conversion.strategy';
import { AvifConversionStrategy } from '../strategies/avif-conversion.strategy';
import { GifConversionStrategy } from '../strategies/gif-conversion.strategy';
import { BmpConversionStrategy } from '../strategies/bmp-conversion.strategy';

/**
 * Factory Pattern Implementation
 * Creates appropriate conversion strategy based on target format
 *
 * SOLID Principles:
 * - Single Responsibility: Only responsible for creating strategies
 * - Open/Closed: Can add new strategies without modifying existing code
 * - Dependency Inversion: Returns interface, not concrete implementation
 */
export class ConversionStrategyFactory {
  private static strategies: Map<ImageFormat, IConversionStrategy> = new Map([
    [ImageFormat.JPEG, new JpegConversionStrategy()],
    [ImageFormat.PNG, new PngConversionStrategy()],
    [ImageFormat.WEBP, new WebpConversionStrategy()],
    [ImageFormat.AVIF, new AvifConversionStrategy()],
    [ImageFormat.GIF, new GifConversionStrategy()],
    [ImageFormat.BMP, new BmpConversionStrategy()],
  ]);

  /**
   * Get the appropriate conversion strategy for the target format
   * @param format - The target image format
   * @returns The conversion strategy for the format
   * @throws Error if format is not supported
   */
  static getStrategy(format: ImageFormat): IConversionStrategy {
    const strategy = this.strategies.get(format);

    if (!strategy) {
      throw new Error(`Unsupported image format: ${format}`);
    }

    return strategy;
  }

  /**
   * Check if a format is supported
   * @param format - The format to check
   * @returns true if the format is supported
   */
  static isFormatSupported(format: ImageFormat): boolean {
    return this.strategies.has(format);
  }

  /**
   * Get all supported formats
   * @returns Array of supported image formats
   */
  static getSupportedFormats(): ImageFormat[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Register a new strategy (for extensibility)
   * Allows adding custom strategies at runtime
   * @param format - The image format
   * @param strategy - The conversion strategy
   */
  static registerStrategy(
    format: ImageFormat,
    strategy: IConversionStrategy
  ): void {
    this.strategies.set(format, strategy);
  }
}
