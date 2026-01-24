'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function SupportPage() {
  const [amount, setAmount] = useState('5.00');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Load PayPal SDK dynamically only on this page
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const scripts = document.querySelectorAll('script[src*="paypal.com/sdk"]');
      scripts.forEach(s => s.remove());
    };
  }, []);

  useEffect(() => {
    // Initialize PayPal button after SDK is loaded and DOM is ready
    if (paypalLoaded && window.paypal) {
      const container = document.getElementById('paypal-button-container');
      if (container && container.children.length === 0) {
        initializePayPal();
      }
    }
  }, [paypalLoaded, amount]);

  const initializePayPal = () => {
    if (!window.paypal) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    // Clear existing buttons
    container.innerHTML = '';

    // Render PayPal button
    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
        },
        createOrder: function (data: any, actions: any) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: 'USD',
                },
                description: 'Support Type Chart Calculator',
              },
            ],
          });
        },
        onApprove: async function (data: any, actions: any) {
          const order = await actions.order.capture();
          console.log('Payment successful:', order);
          alert('Thank you for your support! 🎉');
        },
        onError: function (err: any) {
          console.error('PayPal error:', err);
          alert('Payment failed. Please try again.');
        },
      })
      .render('#paypal-button-container');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support Us</h1>
          <p className="text-xl text-gray-600">
            Help keep Type Chart Calculator free and ad-free
          </p>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Make a Contribution</h2>
            <p className="text-gray-600 mb-4">
              Your support helps us maintain and improve this tool for the community.
              Every contribution, no matter how small, makes a difference!
            </p>
          </div>

          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Select Amount (USD)
            </label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {['3.00', '5.00', '10.00', '20.00'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                    amount === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom amount"
              />
            </div>
          </div>

          {/* PayPal Button */}
          <div className="mb-6">
            {paypalLoaded ? (
              <div id="paypal-button-container"></div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Loading PayPal...
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">
            Secure payment powered by PayPal
          </p>
        </div>

        {/* Why Support Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Why Support Us?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Keep the site completely free for everyone</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Cover hosting and maintenance costs</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Fund new features and improvements</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Support open-source development</span>
            </li>
          </ul>
        </div>

        {/* Other Ways to Support */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Other Ways to Support</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Share:</strong> Tell your friends about Type Chart Calculator
            </p>
            <p>
              <strong>Feedback:</strong> Report bugs or suggest features on GitHub
            </p>
            <p>
              <strong>Contribute:</strong> Help improve the codebase (coming soon)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
