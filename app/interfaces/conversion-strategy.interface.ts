import type { ImageFormat, ProcessingResult } from '../types/image.types';

/**
 * Strategy Pattern Interface
 * Each conversion strategy implements this interface to provide
 * format-specific conversion logic
 *
 * SOLID Principles:
 * - Single Responsibility: Each strategy handles one format conversion
 * - Open/Closed: New strategies can be added without modifying existing code
 * - Liskov Substitution: All strategies are interchangeable
 */
export interface IConversionStrategy {
  /**
   * The target format this strategy converts to
   */
  readonly targetFormat: ImageFormat;

  /**
   * Convert an image to the target format
   * @param imageData - The source image data
   * @param quality - Quality setting (0-1) for lossy formats
   * @param optimize - Whether to apply optimization
   * @returns Promise resolving to the converted blob
   */
  convert(
    imageData: ImageBitmap,
    quality: number,
    optimize: boolean
  ): Promise<Blob>;

  /**
   * Check if this strategy supports the given format
   * @param format - The image format to check
   */
  supports(format: ImageFormat): boolean;

  /**
   * Get the recommended quality settings for this format
   */
  getRecommendedQuality(): number;
}
