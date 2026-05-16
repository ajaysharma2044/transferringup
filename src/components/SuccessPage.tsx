import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { useEffect } from 'react';
import { MetaPixelEvents } from '../lib/metaPixel';

const SuccessPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      const packageValue = localStorage.getItem('package_value');
      const packageName = localStorage.getItem('package_name');

      MetaPixelEvents.Purchase(
        packageValue ? parseFloat(packageValue) : 399,
        'USD',
        packageName || 'Transfer Package'
      );

      localStorage.removeItem('package_value');
      localStorage.removeItem('package_name');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-12 shadow-xl">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for choosing Transferring Up. Your journey to your dream school starts now.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                  <p className="text-gray-600 text-sm">You'll receive a confirmation email with your receipt and next steps.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Schedule Your Consultation</h3>
                  <p className="text-gray-600 text-sm">We'll reach out within 24 hours to schedule your initial strategy session.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Begin Your Transformation</h3>
                  <p className="text-gray-600 text-sm">Start working with our team to build your personalized transfer strategy.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:as4489@cornell.edu"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Contact Ajay</span>
              </a>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;