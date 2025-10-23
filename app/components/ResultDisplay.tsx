import { useCallback, useMemo } from 'react';
import type { ProcessingResult } from '../types/image.types';

interface ResultDisplayProps {
  result: ProcessingResult;
  originalFile: File;
}

/**
 * Display processing results with statistics and download
 * Simplified - comparison slider is shown at top level
 */
export function ResultDisplay({ result, originalFile }: ResultDisplayProps) {
  const previewUrl = useMemo(
    () => URL.createObjectURL(result.blob),
    [result.blob]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileExtension = (format: string): string => {
    const ext = format.split('/')[1];
    return ext === 'jpeg' ? 'jpg' : ext;
  };

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = previewUrl;
    const originalName = originalFile.name.split('.')[0];
    const extension = getFileExtension(result.format);
    link.download = `${originalName}_converted.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [previewUrl, originalFile.name, result.format]);

  const compressionColor =
    result.compressionRatio > 0 ? 'text-green-600' : 'text-orange-600';
  const compressionIcon =
    result.compressionRatio > 0 ? (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ) : (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-4">
        <h2 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">Conversion Result</h2>
        <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Success
        </span>
      </div>

      {/* Statistics */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              File Size
            </span>
            <div className={`flex items-center gap-1 sm:gap-2 ${compressionColor}`}>
              {compressionIcon}
              <span className="text-sm sm:text-base font-bold">
                {result.compressionRatio > 0
                  ? `-${result.compressionRatio}%`
                  : `+${Math.abs(result.compressionRatio)}%`}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-600">
              {formatFileSize(result.originalSize)}
            </span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-1 sm:mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatFileSize(result.processedSize)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-gray-600 mb-1">Dimensions</div>
            <div className="text-sm font-semibold text-gray-900">
              {result.width} × {result.height}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-gray-600 mb-1">Format</div>
            <div className="text-sm font-semibold text-gray-900">
              {result.format.split('/')[1].toUpperCase()}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Processing Time</span>
            <span className="text-sm font-semibold text-gray-900">
              {result.processingTime}ms
            </span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-100"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download Converted Image
      </button>

      {/* Tips */}
      {result.compressionRatio < 0 && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-yellow-800">
              The output file is larger than the input. Consider using a more
              compressed format like WebP or AVIF, or enable optimization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
