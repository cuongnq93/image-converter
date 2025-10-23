/**
 * Empty state component shown before processing
 * Provides helpful instructions and features overview
 */
export function EmptyState() {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 sm:p-8 h-full flex items-center border border-gray-100">
      <div className="w-full text-center">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <svg
            className="w-12 h-12 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Ready to Process
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Select your conversion options and click the button below to convert your image.
          Results will appear here instantly!
        </p>

        <div className="space-y-3 max-w-xs mx-auto">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">
                Image Uploaded
              </h4>
              <p className="text-xs text-gray-500">
                Ready for processing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center animate-pulse-soft">
              <span className="text-purple-600 font-bold text-sm">→</span>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">
                Choose Your Settings
              </h4>
              <p className="text-xs text-gray-600">
                Pick format & click convert
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">100% Private</span>
            <span className="mx-1">•</span>
            <span>Processed in your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
}
