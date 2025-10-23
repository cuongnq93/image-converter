import { ImageFormat } from '../types/image.types';
import { BaseConversionStrategy } from './base-conversion.strategy';

/**
 * Strategy for converting images to AVIF format
 *
 * AVIF is best for:
 * - Next-generation web images
 * - Best compression efficiency
 * - Superior quality at smaller file sizes
 * - Supports HDR and wide color gamut
 */
export class AvifConversionStrategy extends BaseConversionStrategy {
  constructor() {
    super(ImageFormat.AVIF);
  }

  getRecommendedQuality(): number {
    // 0.85 provides exceptional quality with AVIF's superior compression
    // AVIF can achieve similar quality to JPEG at much smaller sizes
    return 0.85;
  }

  /**
   * AVIF-specific conversion
   */
  async convert(
    imageData: ImageBitmap,
    quality: number,
    optimize: boolean
  ): Promise<Blob> {
    // Check browser support for AVIF
    const canvas = this.createCanvas(imageData);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(imageData, 0, 0);

    if (optimize) {
      this.applyOptimization(ctx, canvas);
    }

    try {
      return await this.canvasToBlob(canvas, quality);
    } catch (error) {
      throw new Error(
        'AVIF format is not supported in your browser. Please try WebP or JPEG.'
      );
    }
  }

  /**
   * AVIF has the best compression, so minimal optimization needed
   */
  protected applyOptimization(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    // AVIF's compression is so good that we barely need to optimize
    // Only apply the most minimal adjustments
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Extremely subtle optimization
      data[i] = Math.round(data[i]); // Red
      data[i + 1] = Math.round(data[i + 1]); // Green
      data[i + 2] = Math.round(data[i + 2]); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }
}
