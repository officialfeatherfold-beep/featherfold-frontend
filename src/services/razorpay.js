// Razorpay payment service
export class RazorpayService {
  constructor() {
    this.keyId = 'rzp_test_demo_key_id'; // This should come from backend
  }

  // Load Razorpay script
  loadScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  // Create and open Razorpay checkout
  async openCheckout(options) {
    await this.loadScript();

    const defaultOptions = {
      key: this.keyId,
      currency: 'INR',
      name: 'FeatherFold',
      description: 'Premium Cotton Bedsheets',
      image: '/favicon.ico',
      theme: {
        color: '#9333ea',
      },
      modal: {
        backdropclose: false,
        escape: false,
        handleback: false,
      },
      callback_url: 'https://featherfold-backendnew1-production.up.railway.app/api/payment/verify',
      redirect: false,
    };

    const razorpayOptions = {
      ...defaultOptions,
      ...options,
      handler: function(response) {
        // Handle successful payment
        if (options.onSuccess) {
          options.onSuccess(response);
        }
      },
      modal: {
        ondismiss: function() {
          // Handle modal dismissal
          if (options.onDismiss) {
            options.onDismiss();
          }
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  }

  // Create payment order
  async createOrder(amount, receipt) {
    try {
      const response = await fetch('https://featherfold-backendnew1-production.up.railway.app/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('featherfold_token')}`,
        },
        body: JSON.stringify({ amount, receipt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      return data.order;
    } catch (error) {
      console.error('Payment order creation error:', error);
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(paymentData) {
    try {
      const response = await fetch('https://featherfold-backendnew1-production.up.railway.app/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('featherfold_token')}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  // Process payment with order creation
  async processPayment(amount, orderData, onSuccess, onFailure) {
    try {
      // Create payment order
      const order = await this.createOrder(amount, `order_${Date.now()}`);
      
      // Open Razorpay checkout
      await this.openCheckout({
        amount: order.amount,
        order_id: order.id,
        prefill: {
          name: orderData.customerName || '',
          email: orderData.customerEmail || '',
          contact: orderData.customerPhone || '',
        },
        notes: {
          orderId: orderData.orderId,
        },
        onSuccess: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            };

            const verification = await this.verifyPayment(verificationData);
            
            if (verification.success) {
              onSuccess({
                ...response,
                verification,
              });
            } else {
              onFailure('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure('Payment verification failed');
          }
        },
        onDismiss: () => {
          onFailure('Payment cancelled');
        },
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      onFailure(error.message || 'Payment processing failed');
    }
  }
}

export const razorpayService = new RazorpayService();
