import type {
  ProcessingOptions,
  ProcessingResult,
  ImageMetadata,
} from '../types/image.types';

/**
 * Interface for image processing operations
 *
 * SOLID Principles:
 * - Interface Segregation: Focused interface for processing operations
 * - Dependency Inversion: Depend on abstraction, not concrete implementation
 */
export interface IImageProcessor {
  /**
   * Process an image file according to the provided options
   * @param file - The image file to process
   * @param options - Processing configuration
   * @returns Promise resolving to the processing result
   */
  process(file: File, options: ProcessingOptions): Promise<ProcessingResult>;

  /**
   * Extract metadata from an image file
   * @param file - The image file
   * @returns Promise resolving to image metadata
   */
  extractMetadata(file: File): Promise<ImageMetadata>;

  /**
   * Validate if a file is a supported image format
   * @param file - The file to validate
   * @returns true if the file is a supported image
   */
  isValidImage(file: File): boolean;
}

/**
 * Interface for image optimization operations
 */
export interface IImageOptimizer {
  /**
   * Optimize an image while maintaining visual quality
   * Uses psychovisual optimization techniques
   * @param imageData - The image bitmap data
   * @param format - Target format for optimization
   * @param quality - Base quality level
   * @returns Promise resolving to optimized blob
   */
  optimize(
    imageData: ImageBitmap,
    format: string,
    quality: number
  ): Promise<Blob>;

  /**
   * Calculate optimal quality based on image characteristics
   * @param imageData - The image bitmap data
   * @returns Recommended quality value
   */
  calculateOptimalQuality(imageData: ImageBitmap): number;
}
