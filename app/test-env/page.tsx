export default function TestEnvPage() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-2">
          <strong>NEXT_PUBLIC_PAYPAL_CLIENT_ID:</strong>
        </p>
        <p className="font-mono bg-gray-100 p-2 rounded break-all">
          {clientId || 'undefined'}
        </p>
        <p className="mt-4 text-sm text-gray-600">
          {clientId ? '✅ Environment variable is set' : '❌ Environment variable is NOT set'}
        </p>
      </div>
    </div>
  );
}
