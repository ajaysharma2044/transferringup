// Note: This file should only be used on the server-side
// For client-side operations, we need to use Stripe's public API or a backend endpoint

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
  };
}

// This function should be called from a backend API endpoint
// Using secret keys in the frontend is a security risk
export async function getStripeProducts(): Promise<StripeProduct[]> {
  try {
    // This should be moved to a backend API endpoint
    const response = await fetch('/api/stripe/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
}

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  try {
    // This should also be moved to a backend API endpoint
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}