import { useState, useCallback } from 'react';
import type { ImageFormat, ProcessingOptions, ImageMetadata } from '../types/image.types';
import { ConversionStrategyFactory } from '../factories/conversion-strategy.factory';
import { Tooltip } from './Tooltip';

interface ProcessingOptionsPanelProps {
  metadata: ImageMetadata;
  onProcess: (options: ProcessingOptions) => void;
  isProcessing: boolean;
  onReset?: () => void;
}

interface Preset {
  name: string;
  description: string;
  icon: string;
  settings: {
    format: ImageFormat;
    quality: number;
    optimize: boolean;
  };
}

/**
 * Panel for selecting image processing options
 * Enhanced with presets and tooltips for better UX
 */
export function ProcessingOptionsPanel({
  metadata,
  onProcess,
  isProcessing,
  onReset,
}: ProcessingOptionsPanelProps) {
  const supportedFormats = ConversionStrategyFactory.getSupportedFormats();

  const presets: Preset[] = [
    {
      name: 'Web Optimized',
      description: 'Perfect for websites - small size, great quality',
      icon: '🌐',
      settings: { format: 'image/webp' as ImageFormat, quality: 85, optimize: true },
    },
    {
      name: 'High Quality',
      description: 'Maximum quality for printing or archiving',
      icon: '⭐',
      settings: { format: 'image/png' as ImageFormat, quality: 100, optimize: false },
    },
    {
      name: 'Smallest Size',
      description: 'Minimum file size for email or messaging',
      icon: '📦',
      settings: { format: 'image/avif' as ImageFormat, quality: 75, optimize: true },
    },
    {
      name: 'Social Media',
      description: 'Optimized for social media platforms',
      icon: '📱',
      settings: { format: 'image/jpeg' as ImageFormat, quality: 80, optimize: true },
    },
  ];

  // Set default preset to "Web Optimized"
  const defaultPreset = presets[0]; // Web Optimized

  const [selectedPreset, setSelectedPreset] = useState<string>(defaultPreset.name);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>(defaultPreset.settings.format);
  const [quality, setQuality] = useState(defaultPreset.settings.quality);
  const [optimize, setOptimize] = useState(defaultPreset.settings.optimize);
  const [enableResize, setEnableResize] = useState(false);
  const [maxWidth, setMaxWidth] = useState(metadata.width);
  const [maxHeight, setMaxHeight] = useState(metadata.height);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyPreset = useCallback((preset: Preset) => {
    setTargetFormat(preset.settings.format);
    setQuality(preset.settings.quality);
    setOptimize(preset.settings.optimize);
    setSelectedPreset(preset.name);
  }, []);

  // Reset selected preset when user manually changes settings
  const handleFormatChange = useCallback((format: ImageFormat) => {
    setTargetFormat(format);
    setSelectedPreset(''); // Empty string means no preset selected
  }, []);

  const handleQualityChange = useCallback((value: number) => {
    setQuality(value);
    setSelectedPreset('');
  }, []);

  const handleOptimizeChange = useCallback((value: boolean) => {
    setOptimize(value);
    setSelectedPreset('');
  }, []);

  const handleProcess = useCallback(() => {
    const options: ProcessingOptions = {
      targetFormat,
      quality: quality / 100,
      optimize,
      maxWidth: enableResize ? maxWidth : undefined,
      maxHeight: enableResize ? maxHeight : undefined,
      maintainAspectRatio,
    };
    onProcess(options);
  }, [
    targetFormat,
    quality,
    optimize,
    enableResize,
    maxWidth,
    maxHeight,
    maintainAspectRatio,
    onProcess,
  ]);

  const getFormatName = (format: ImageFormat): string => {
    return format.split('/')[1].toUpperCase();
  };

  const getFormatDescription = (format: ImageFormat): string => {
    switch (format) {
      case 'image/jpeg':
        return 'Best for photos, smaller files';
      case 'image/png':
        return 'Lossless, supports transparency';
      case 'image/webp':
        return 'Modern format, great compression';
      case 'image/avif':
        return 'Best compression, newest format';
      case 'image/gif':
        return 'Animations, limited colors';
      case 'image/bmp':
        return 'Uncompressed, large files';
      default:
        return '';
    }
  };

  const isLossyFormat = (format: ImageFormat): boolean => {
    return ['image/jpeg', 'image/webp', 'image/avif'].includes(format);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">
          Processing Options
        </h2>
        <Tooltip content="Choose a preset or customize settings">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </Tooltip>
      </div>

      <div className="space-y-5">
        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => {
              const isSelected = selectedPreset === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left group relative
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{preset.icon}</span>
                    <span className={`text-sm font-semibold ${
                      isSelected ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-700'
                    }`}>
                      {preset.name}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${
                    isSelected ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1 bg-white text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              <svg
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-5 animate-fade-in">
            {/* Format Selection */}
            <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Output Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {supportedFormats.map((format) => (
              <button
                key={format}
                onClick={() => handleFormatChange(format)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  targetFormat === format
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">
                  {getFormatName(format)}
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {getFormatDescription(format)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (for lossy formats) */}
        {isLossyFormat(targetFormat) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Quality
              </label>
              <span className="text-sm font-semibold text-blue-600">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => handleQualityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {/* Optimization Toggle */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={optimize}
              onChange={(e) => handleOptimizeChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div className="ml-3">
            <label className="text-sm font-medium text-gray-700">
              Enable Smart Optimization
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Uses psychovisual techniques to reduce file size while maintaining
              perceived quality
            </p>
          </div>
        </div>

        {/* Resize Options */}
        <div className="border-t pt-4">
          <div className="flex items-start mb-3">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={enableResize}
                onChange={(e) => setEnableResize(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Resize Image
              </label>
            </div>
          </div>

          {enableResize && (
            <div className="space-y-3 ml-7">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max Width (px)
                  </label>
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max Height (px)
                  </label>
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="ml-2 text-xs text-gray-600">
                  Maintain aspect ratio
                </label>
              </div>
            </div>
          )}
        </div>

            </div>
          )}

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-100"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Convert & Optimize
            </span>
          )}
        </button>

        {/* Change Image Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="w-full py-2.5 px-4 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Change Image
          </button>
        )}
      </div>
    </div>
  );
}
