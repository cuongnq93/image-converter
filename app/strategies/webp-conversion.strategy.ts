import { ImageFormat } from '../types/image.types';
import { BaseConversionStrategy } from './base-conversion.strategy';

/**
 * Strategy for converting images to WebP format
 *
 * WebP is best for:
 * - Modern web applications
 * - Superior compression with good quality
 * - Supports both lossy and lossless compression
 * - Supports transparency
 */
export class WebpConversionStrategy extends BaseConversionStrategy {
  constructor() {
    super(ImageFormat.WEBP);
  }

  getRecommendedQuality(): number {
    // 0.90 provides excellent quality with superior compression for WebP
    // WebP's compression algorithm is more efficient than JPEG
    return 0.9;
  }

  /**
   * WebP-specific conversion with advanced optimization
   */
  protected applyOptimization(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // WebP has excellent compression, so we can be more conservative
    // Apply minimal optimization that's completely imperceptible
    for (let i = 0; i < data.length; i += 4) {
      // Very subtle quantization
      data[i] = Math.round(data[i] / 1.5) * 1.5; // Red
      data[i + 1] = Math.round(data[i + 1] / 1.5) * 1.5; // Green
      data[i + 2] = Math.round(data[i + 2] / 1.5) * 1.5; // Blue
      // Preserve alpha for transparency
    }

    ctx.putImageData(imageData, 0, 0);
  }
}
