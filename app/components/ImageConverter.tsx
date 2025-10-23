import { useState, useCallback, useRef } from 'react';
import type {
  ImageFormat,
  ProcessingOptions,
  ProcessingResult,
  ImageMetadata,
} from '../types/image.types';
import { ImageProcessorService } from '../services/image-processor.service';
import { ImageOptimizerService } from '../services/image-optimizer.service';
import { FileUpload } from './FileUpload';
import { ProcessingOptionsPanel } from './ProcessingOptionsPanel';
import { ResultDisplay } from './ResultDisplay';
import { OriginalPreview } from './OriginalPreview';
import { ImageComparisonSlider } from './ImageComparisonSlider';
import { FeatureModal } from './FeatureModal';
import { ChangeImageButton } from './ChangeImageButton';

/**
 * Main Image Converter Component
 * Mobile-first responsive design with TailwindCSS
 */
export function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [processingResult, setProcessingResult] =
    useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);

  // Ref for Image Comparison block to scroll to after conversion
  const imageComparisonRef = useRef<HTMLDivElement>(null);

  // Initialize services (following Dependency Injection pattern)
  const optimizer = new ImageOptimizerService();
  const processor = new ImageProcessorService(optimizer);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setProcessingResult(null);

      if (!processor.isValidImage(file)) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedFile(file);

      try {
        const meta = await processor.extractMetadata(file);
        setMetadata(meta);
      } catch (err) {
        setError(`Failed to read image: ${err}`);
      }
    },
    [processor]
  );

  /**
   * Handle image processing
   */
  const handleProcess = useCallback(
    async (options: ProcessingOptions) => {
      if (!selectedFile) {
        setError('Please select an image first');
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await processor.process(selectedFile, options);
        setProcessingResult(result);

        // Scroll to Image Comparison block after successful conversion
        setTimeout(() => {
          imageComparisonRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      } catch (err) {
        setError(`Processing failed: ${err}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedFile, processor]
  );

  /**
   * Handle reset
   */
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setMetadata(null);
    setProcessingResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3 sm:py-6 sm:px-6 lg:py-8 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact when file is selected */}
        {!selectedFile ? (
          <header className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Image Converter & Optimizer
            </h1>
            <p className="text-sm sm:text-base lg:text-base text-gray-600 max-w-2xl mx-auto">
              Convert images between formats and optimize file size while
              maintaining visual quality
            </p>
          </header>
        ) : (
          <header className="text-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900">
              Image Converter & Optimizer
            </h1>
          </header>
        )}

        {/* Main Content */}
        {!selectedFile ? (
          /* Centered Upload Block - No image selected */
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="w-full max-w-2xl">
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                metadata={metadata}
                onReset={handleReset}
              />

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 animate-fade-in">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800 mb-1">
                        Error
                      </h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Link */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowFeatures(true)}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="underline underline-offset-2">
                    View Features & Benefits
                  </span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
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
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* New Layout - Image selected */
          <div className="space-y-4 animate-fade-in max-w-full">
            {/* Image Comparison - Full Width at Top */}
            <div ref={imageComparisonRef} className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-4 max-w-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">
                  {processingResult ? 'Image Comparison' : 'Original Image Preview'}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {processingResult ? 'Drag to compare' : `${metadata?.width} × ${metadata?.height}`}
                  </div>
                  <ChangeImageButton onClick={handleReset} />
                </div>
              </div>

              {processingResult ? (
                <ImageComparisonSlider
                  beforeImage={URL.createObjectURL(selectedFile)}
                  afterImage={URL.createObjectURL(processingResult.blob)}
                  beforeLabel="Original"
                  afterLabel="Converted"
                />
              ) : (
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Original"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                </div>
              )}
            </div>

            {/* Two Column Layout Below - Result + Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 max-w-full w-full">
              {/* Left Column: Result Statistics */}
              <div className="space-y-4 w-full max-w-full">
                {processingResult ? (
                  <ResultDisplay
                    result={processingResult}
                    originalFile={selectedFile}
                  />
                ) : metadata ? (
                  <OriginalPreview
                    metadata={metadata}
                    onReset={handleReset}
                  />
                ) : null}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800 mb-1">
                          Error
                        </h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Processing Options */}
              <div className="w-full max-w-full">
                {metadata && (
                  <ProcessingOptionsPanel
                    metadata={metadata}
                    onProcess={handleProcess}
                    isProcessing={isProcessing}
                    onReset={handleReset}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feature Modal */}
        <FeatureModal
          isOpen={showFeatures}
          onClose={() => setShowFeatures(false)}
        />
      </div>
    </div>
  );
}
