import type { IImageOptimizer } from '../interfaces/image-processor.interface';

/**
 * Image optimizer service using psychovisual optimization
 * Reduces file size while maintaining perceived quality
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles optimization logic
 * - Interface Segregation: Implements focused IImageOptimizer interface
 */
export class ImageOptimizerService implements IImageOptimizer {
  /**
   * Optimize image using psychovisual techniques
   */
  async optimize(
    imageData: ImageBitmap,
    format: string,
    quality: number
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(imageData, 0, 0);

    // Apply psychovisual optimization
    this.applyPsychovisualOptimization(ctx, canvas);

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        format,
        quality
      );
    });
  }

  /**
   * Calculate optimal quality based on image characteristics
   * Uses image complexity analysis
   */
  calculateOptimalQuality(imageData: ImageBitmap): number {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return 0.85; // Default quality
    }

    ctx.drawImage(imageData, 0, 0);

    // Sample image to determine complexity
    const sampleData = ctx.getImageData(
      0,
      0,
      Math.min(100, imageData.width),
      Math.min(100, imageData.height)
    );

    const complexity = this.calculateImageComplexity(sampleData.data);

    // Higher complexity images need higher quality to maintain appearance
    // Lower complexity images can use lower quality without visible degradation
    if (complexity > 0.7) {
      return 0.92; // High complexity: photographs, detailed images
    } else if (complexity > 0.4) {
      return 0.85; // Medium complexity: mixed content
    } else {
      return 0.75; // Low complexity: graphics, solid colors
    }
  }

  /**
   * Calculate image complexity using edge detection and color variance
   */
  private calculateImageComplexity(data: Uint8ClampedArray): number {
    let totalVariance = 0;
    let edgeCount = 0;
    const threshold = 30;

    // Analyze color variance and edges
    for (let i = 0; i < data.length - 4; i += 4) {
      // Calculate variance between adjacent pixels
      const r1 = data[i];
      const g1 = data[i + 1];
      const b1 = data[i + 2];

      const r2 = data[i + 4];
      const g2 = data[i + 5];
      const b2 = data[i + 6];

      const variance =
        Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
      totalVariance += variance;

      // Count edges (significant color changes)
      if (variance > threshold) {
        edgeCount++;
      }
    }

    const avgVariance = totalVariance / (data.length / 4);
    const edgeRatio = edgeCount / (data.length / 4);

    // Normalize complexity score between 0 and 1
    const complexityScore = Math.min(
      1,
      (avgVariance / 100) * 0.5 + edgeRatio * 0.5
    );

    return complexityScore;
  }

  /**
   * Apply psychovisual optimization techniques
   * Based on human visual system characteristics
   */
  private applyPsychovisualOptimization(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply optimizations based on human visual perception:
    // 1. Humans are more sensitive to luminance than chrominance
    // 2. Humans are less sensitive to high-frequency details
    // 3. Humans can't perceive very small color differences

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to YCbCr (luminance and chrominance)
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
      const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

      // Reduce chrominance precision (humans less sensitive to color details)
      const cbOptimized = Math.round(cb / 4) * 4;
      const crOptimized = Math.round(cr / 4) * 4;

      // Convert back to RGB
      const rOptimized = y + 1.402 * (crOptimized - 128);
      const gOptimized =
        y - 0.344136 * (cbOptimized - 128) - 0.714136 * (crOptimized - 128);
      const bOptimized = y + 1.772 * (cbOptimized - 128);

      // Clamp values
      data[i] = Math.max(0, Math.min(255, Math.round(rOptimized)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(gOptimized)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(bOptimized)));
    }

    ctx.putImageData(imageData, 0, 0);
  }
}
