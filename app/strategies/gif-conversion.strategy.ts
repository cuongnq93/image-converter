import { ImageFormat } from '../types/image.types';
import { BaseConversionStrategy } from './base-conversion.strategy';

/**
 * Strategy for converting images to GIF format
 *
 * GIF is best for:
 * - Simple graphics with limited colors
 * - Animations (not handled in this converter)
 * - Legacy browser support
 *
 * Note: Static images are better served by PNG or WebP
 */
export class GifConversionStrategy extends BaseConversionStrategy {
  constructor() {
    super(ImageFormat.GIF);
  }

  getRecommendedQuality(): number {
    // GIF is limited to 256 colors, quality parameter doesn't apply
    return 1.0;
  }

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

    ctx.drawImage(imageData, 0, 0);

    // GIF has limited color palette, no optimization needed
    return this.canvasToBlob(canvas, 1.0);
  }
}
