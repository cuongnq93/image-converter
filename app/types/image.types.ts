/**
 * Supported image formats for conversion
 */
export enum ImageFormat {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  AVIF = 'image/avif',
  GIF = 'image/gif',
  BMP = 'image/bmp',
}

/**
 * Mapping of file extensions to MIME types
 */
export const IMAGE_EXTENSIONS: Record<string, ImageFormat> = {
  jpg: ImageFormat.JPEG,
  jpeg: ImageFormat.JPEG,
  png: ImageFormat.PNG,
  webp: ImageFormat.WEBP,
  avif: ImageFormat.AVIF,
  gif: ImageFormat.GIF,
  bmp: ImageFormat.BMP,
};

/**
 * Configuration options for image processing
 */
export interface ProcessingOptions {
  targetFormat: ImageFormat;
  quality: number; // 0-1 for lossy formats
  optimize: boolean;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
}

/**
 * Result of image processing operation
 */
export interface ProcessingResult {
  blob: Blob;
  format: ImageFormat;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  processingTime: number;
}

/**
 * Metadata about uploaded image
 */
export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  format: ImageFormat;
}
