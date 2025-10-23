import { ImageFormat } from '../types/image.types';
import { BaseConversionStrategy } from './base-conversion.strategy';

/**
 * Strategy for converting images to PNG format
 *
 * PNG is best for:
 * - Images requiring transparency
 * - Graphics, logos, and illustrations
 * - Lossless compression needed
 */
export class PngConversionStrategy extends BaseConversionStrategy {
  constructor() {
    super(ImageFormat.PNG);
  }

  getRecommendedQuality(): number {
    // PNG is lossless, quality parameter doesn't affect it
    // But we return 1.0 for consistency
    return 1.0;
  }

  /**
   * PNG-specific conversion - preserves transparency
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

    // Draw with transparency support
    ctx.drawImage(imageData, 0, 0);

    if (optimize) {
      this.applyPngOptimization(ctx, canvas);
    }

    // PNG ignores quality parameter, but we pass it for API consistency
    return this.canvasToBlob(canvas, 1.0);
  }

  /**
   * Apply PNG-specific optimization
   */
  private applyPngOptimization(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Reduce color depth slightly for better compression
    // This is barely noticeable to human eyes
    for (let i = 0; i < data.length; i += 4) {
      // Quantize to reduce unique colors (better compression)
      data[i] = Math.round(data[i] / 4) * 4; // Red
      data[i + 1] = Math.round(data[i + 1] / 4) * 4; // Green
      data[i + 2] = Math.round(data[i + 2] / 4) * 4; // Blue
      // Keep alpha channel precise for transparency
    }

    ctx.putImageData(imageData, 0, 0);
  }
}
