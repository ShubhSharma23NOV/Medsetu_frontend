/**
 * Razorpay Integration Utility
 * Handles payment gateway integration for online payments
 */

// Razorpay script loader
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Razorpay payment options interface
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Initialize Razorpay payment
export const initializeRazorpay = async (options: RazorpayOptions): Promise<void> => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};

// Create Razorpay order
export const createRazorpayOrder = async (
  orderId: number,
  amount: number,
  token: string
): Promise<any> => {
  const response = await fetch('http://localhost:3001/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create payment order');
  }

  return response.json();
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (
  paymentData: RazorpayResponse,
  token: string
): Promise<boolean> => {
  const response = await fetch('http://localhost:3001/api/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Payment verification failed');
  }

  const result = await response.json();
  return result.success;
};

// Handle payment failure
export const handlePaymentFailure = async (
  razorpayOrderId: string,
  reason: string,
  token: string
): Promise<void> => {
  await fetch('http://localhost:3001/api/payment/failure', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      reason,
    }),
  });
};

// Get Razorpay key from environment
export const getRazorpayKey = (): string => {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';
};
