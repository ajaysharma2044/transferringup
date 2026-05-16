import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-12 shadow-xl">
          <div className="mb-8">
            <XCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-600">
              No worries! Your payment was cancelled and no charges were made.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still interested in transforming your future?</h2>
            <p className="text-gray-600 mb-4">
              We understand that choosing the right transfer consulting service is a big decision. 
              If you have any questions or concerns, we're here to help.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Free consultation available</p>
              <p>• No commitment required</p>
              <p>• Personalized recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/#build-package'}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Try Again</span>
              </button>
              <button 
                onClick={() => window.location.href = '/#contact'}
                className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Schedule Free Consultation</span>
              </button>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;