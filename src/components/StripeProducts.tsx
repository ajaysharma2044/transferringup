import { useState, useEffect } from 'react';
import { getStripeProducts, createCheckoutSession, StripeProduct } from '../lib/stripe';
import { Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const StripeProducts = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const stripeProducts = await getStripeProducts();
      setProducts(stripeProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (priceId: string) => {
    try {
      setProcessingPayment(priceId);
      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = `${window.location.origin}/cancel`;
      
      const session = await createCheckoutSession(priceId, successUrl, cancelUrl);
      
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          <span className="text-gray-600">Loading packages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Packages</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={loadProducts}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages available</h3>
        <p className="text-gray-600">Please check back later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {products.map((product) => (
        <div 
          key={product.id}
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(product.default_price.unit_amount, product.default_price.currency)}
              </span>
              <span className="text-gray-600">one-time</span>
            </div>
          </div>

          <button 
            onClick={() => handlePurchase(product.default_price.id)}
            disabled={processingPayment === product.default_price.id}
            className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processingPayment === product.default_price.id ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Choose This Package</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StripeProducts;