import { ImageFormat } from '../types/image.types';
import { BaseConversionStrategy } from './base-conversion.strategy';

/**
 * Strategy for converting images to BMP format
 *
 * BMP is best for:
 * - Windows applications
 * - Uncompressed image storage
 * - Legacy system compatibility
 *
 * Note: BMP files are large and uncompressed
 */
export class BmpConversionStrategy extends BaseConversionStrategy {
  constructor() {
    super(ImageFormat.BMP);
  }

  getRecommendedQuality(): number {
    // BMP is uncompressed, quality parameter doesn't apply
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

    // BMP is uncompressed, optimization not applicable
    return this.canvasToBlob(canvas, 1.0);
  }
}
