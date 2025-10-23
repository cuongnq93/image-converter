import type { IConversionStrategy } from '../interfaces/conversion-strategy.interface';
import type { ImageFormat } from '../types/image.types';

/**
 * Abstract base class for conversion strategies
 * Provides common functionality for all conversion strategies
 *
 * SOLID Principles:
 * - Single Responsibility: Handles common conversion logic
 * - Open/Closed: Open for extension through inheritance
 */
export abstract class BaseConversionStrategy implements IConversionStrategy {
  constructor(public readonly targetFormat: ImageFormat) {}

  /**
   * Convert image to target format using Canvas API
   */
  async convert(
    imageData: ImageBitmap,
    quality: number,
    optimize: boolean
  ): Promise<Blob> {
    const canvas = this.createCanvas(imageData);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw the image
    ctx.drawImage(imageData, 0, 0);

    // Apply optimization if requested
    if (optimize) {
      this.applyOptimization(ctx, canvas);
    }

    // Convert to blob
    return this.canvasToBlob(canvas, quality);
  }

  /**
   * Check if this strategy supports the target format
   */
  supports(format: ImageFormat): boolean {
    return this.targetFormat === format;
  }

  /**
   * Get recommended quality for this format
   */
  abstract getRecommendedQuality(): number;

  /**
   * Create a canvas from image data
   */
  protected createCanvas(imageData: ImageBitmap): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    return canvas;
  }

  /**
   * Convert canvas to blob with specified quality
   */
  protected canvasToBlob(
    canvas: HTMLCanvasElement,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        this.targetFormat,
        quality
      );
    });
  }

  /**
   * Apply psychovisual optimization techniques
   * This is a simplified version - in production, use more advanced algorithms
   */
  protected applyOptimization(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply subtle optimization based on human visual perception
    // Human eyes are less sensitive to high-frequency changes in color
    for (let i = 0; i < data.length; i += 4) {
      // Very subtle color quantization that's imperceptible to human eyes
      // This reduces file size by limiting color precision
      data[i] = Math.round(data[i] / 2) * 2; // Red
      data[i + 1] = Math.round(data[i + 1] / 2) * 2; // Green
      data[i + 2] = Math.round(data[i + 2] / 2) * 2; // Blue
      // Alpha channel unchanged
    }

    ctx.putImageData(imageData, 0, 0);
  }
}
