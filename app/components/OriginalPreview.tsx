import type { ImageMetadata } from '../types/image.types';
import { ChangeImageButton } from './ChangeImageButton';

interface OriginalPreviewProps {
  metadata: ImageMetadata;
  onReset: () => void;
}

/**
 * Preview component for original image
 * Shown before processing
 */
export function OriginalPreview({ metadata, onReset }: OriginalPreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">Original Image</h2>
        <ChangeImageButton onClick={onReset} />
      </div>

      {/* Image Info - Compact */}
      <div className="space-y-2 sm:space-y-3">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 border border-gray-200">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Image Details
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-600 mb-0.5">File Size</div>
              <div className="text-sm font-bold text-gray-900">
                {formatFileSize(metadata.size)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-600 mb-0.5">Format</div>
              <div className="text-sm font-bold text-gray-900">
                {metadata.type.split('/')[1].toUpperCase()}
              </div>
            </div>

            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-600 mb-0.5">Dimensions</div>
              <div className="text-sm font-bold text-gray-900">
                {metadata.width} × {metadata.height}
              </div>
            </div>

            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-600 mb-0.5">Aspect Ratio</div>
              <div className="text-sm font-bold text-gray-900">
                {(metadata.width / metadata.height).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Ready to convert indicator - Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3 border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center animate-pulse-soft">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-gray-900">
                Ready to Convert
              </h4>
              <p className="text-xs text-gray-600">
                Select preset or customize settings →
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
