import type {
  IImageProcessor,
  IImageOptimizer,
} from '../interfaces/image-processor.interface';
import type {
  ProcessingOptions,
  ProcessingResult,
  ImageMetadata,
  ImageFormat,
} from '../types/image.types';
import { IMAGE_EXTENSIONS } from '../types/image.types';
import { ConversionStrategyFactory } from '../factories/conversion-strategy.factory';

/**
 * Main image processor service
 * Implements SOLID principles throughout
 *
 * SOLID Principles:
 * - Single Responsibility: Coordinates image processing operations
 * - Open/Closed: Uses strategies and factory for extensibility
 * - Liskov Substitution: Can be replaced by any IImageProcessor implementation
 * - Interface Segregation: Implements focused IImageProcessor interface
 * - Dependency Inversion: Depends on IConversionStrategy interface
 */
export class ImageProcessorService implements IImageProcessor {
  constructor(private readonly optimizer?: IImageOptimizer) {}

  /**
   * Process an image file according to options
   */
  async process(
    file: File,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    const startTime = performance.now();

    // Validate input
    if (!this.isValidImage(file)) {
      throw new Error('Invalid image file');
    }

    // Load image as ImageBitmap for efficient processing
    const imageBitmap = await this.loadImage(file);

    // Apply resizing if specified
    const resizedBitmap = this.shouldResize(imageBitmap, options)
      ? await this.resizeImage(imageBitmap, options)
      : imageBitmap;

    // Get the appropriate conversion strategy
    const strategy = ConversionStrategyFactory.getStrategy(
      options.targetFormat
    );

    // Determine quality
    let quality = options.quality;
    if (options.optimize && this.optimizer) {
      quality = this.optimizer.calculateOptimalQuality(resizedBitmap);
    }

    // Save dimensions BEFORE converting (bitmap may be closed during conversion)
    const resultWidth = resizedBitmap.width;
    const resultHeight = resizedBitmap.height;

    // Convert using the strategy
    const resultBlob = await strategy.convert(
      resizedBitmap,
      quality,
      options.optimize
    );

    const endTime = performance.now();

    // Clean up
    imageBitmap.close();
    if (resizedBitmap !== imageBitmap) {
      resizedBitmap.close();
    }

    // Calculate results
    const originalSize = file.size;
    const processedSize = resultBlob.size;
    const compressionRatio = ((1 - processedSize / originalSize) * 100).toFixed(
      2
    );

    return {
      blob: resultBlob,
      format: options.targetFormat,
      originalSize,
      processedSize,
      compressionRatio: parseFloat(compressionRatio),
      width: resultWidth,
      height: resultHeight,
      processingTime: Math.round(endTime - startTime),
    };
  }

  /**
   * Extract metadata from image file
   */
  async extractMetadata(file: File): Promise<ImageMetadata> {
    const imageBitmap = await this.loadImage(file);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const format = IMAGE_EXTENSIONS[extension];

    const metadata: ImageMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      width: imageBitmap.width,
      height: imageBitmap.height,
      format: format || file.type as ImageFormat,
    };

    imageBitmap.close();
    return metadata;
  }

  /**
   * Validate if file is a supported image
   */
  isValidImage(file: File): boolean {
    // Check MIME type
    if (!file.type.startsWith('image/')) {
      return false;
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    return extension in IMAGE_EXTENSIONS;
  }

  /**
   * Load image file as ImageBitmap
   */
  private async loadImage(file: File): Promise<ImageBitmap> {
    try {
      return await createImageBitmap(file);
    } catch (error) {
      throw new Error(`Failed to load image: ${error}`);
    }
  }

  /**
   * Check if image should be resized
   */
  private shouldResize(
    imageBitmap: ImageBitmap,
    options: ProcessingOptions
  ): boolean {
    if (!options.maxWidth && !options.maxHeight) {
      return false;
    }

    return (
      (options.maxWidth && imageBitmap.width > options.maxWidth) ||
      (options.maxHeight && imageBitmap.height > options.maxHeight) ||
      false
    );
  }

  /**
   * Resize image while maintaining aspect ratio
   */
  private async resizeImage(
    imageBitmap: ImageBitmap,
    options: ProcessingOptions
  ): Promise<ImageBitmap> {
    const { maxWidth, maxHeight, maintainAspectRatio } = options;

    let newWidth = imageBitmap.width;
    let newHeight = imageBitmap.height;

    if (maintainAspectRatio) {
      const aspectRatio = imageBitmap.width / imageBitmap.height;

      if (maxWidth && newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = Math.round(newWidth / aspectRatio);
      }

      if (maxHeight && newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = Math.round(newHeight * aspectRatio);
      }
    } else {
      if (maxWidth) newWidth = maxWidth;
      if (maxHeight) newHeight = maxHeight;
    }

    // Create resized bitmap
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Use high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject()), 'image/png');
    });

    return await createImageBitmap(blob);
  }
}
