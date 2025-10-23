import { ImageFormat } from '../types/image.types';
import { BaseConversionStrategy } from './base-conversion.strategy';

/**
 * Strategy for converting images to JPEG format
 *
 * JPEG is best for:
 * - Photographs with many colors
 * - Images where small quality loss is acceptable
 * - Smaller file sizes
 */
export class JpegConversionStrategy extends BaseConversionStrategy {
  constructor() {
    super(ImageFormat.JPEG);
  }

  getRecommendedQuality(): number {
    // 0.85 provides excellent quality with good compression
    // Based on research, human eyes can't perceive much difference above 0.85
    return 0.85;
  }

  /**
   * Override to apply JPEG-specific optimization
   */
  protected applyOptimization(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    // JPEG doesn't support transparency, so we composite on white background
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Composite transparent pixels onto white background
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha < 1) {
        // Blend with white background
        data[i] = Math.round(data[i] * alpha + 255 * (1 - alpha)); // Red
        data[i + 1] = Math.round(data[i + 1] * alpha + 255 * (1 - alpha)); // Green
        data[i + 2] = Math.round(data[i + 2] * alpha + 255 * (1 - alpha)); // Blue
        data[i + 3] = 255; // Full opacity
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply base optimization
    super.applyOptimization(ctx, canvas);
  }
}
