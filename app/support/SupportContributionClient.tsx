'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style: {
          shape: string;
          color: string;
          layout: string;
          label: string;
        };
        createOrder: (data: unknown, actions: { order: { create: (order: unknown) => Promise<string> } }) => Promise<string>;
        onApprove: (data: unknown, actions: { order: { capture: () => Promise<unknown> } }) => Promise<void>;
        onError: (err: unknown) => void;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

export default function SupportContributionClient() {
  const [amount, setAmount] = useState('5.00');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      const scripts = document.querySelectorAll('script[src*="paypal.com/sdk"]');
      scripts.forEach(scriptElement => scriptElement.remove());
    };
  }, []);

  useEffect(() => {
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

    container.innerHTML = '';

    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
        },
        createOrder: function (_data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: 'USD',
                },
                description: 'Support TypeMatchup',
              },
            ],
          });
        },
        onApprove: async function (_data, actions) {
          const order = await actions.order.capture();
          console.log('Payment successful:', order);
          alert('Thank you for your support! 🎉');
        },
        onError: function (err) {
          console.error('PayPal error:', err);
          alert('Payment failed. Please try again.');
        },
      })
      .render('#paypal-button-container');
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Select Amount (USD)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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
            onChange={(event) => setAmount(event.target.value)}
            min="1"
            step="0.01"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Custom amount"
          />
        </div>
      </div>

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
  );
}
