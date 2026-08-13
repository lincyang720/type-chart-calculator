'use client';

import { useState } from 'react';

const code = `<iframe
  src="https://www.typematchup.org/embed/type-calculator"
  title="Pokemon Type Matchup Calculator"
  width="100%"
  height="680"
  loading="lazy"
  style="border:0;border-radius:12px;max-width:760px"
></iframe>`;

export default function EmbedCode() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"><code>{code}</code></pre>
      <button type="button" onClick={copy} className="mt-3 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
        {copied ? 'Copied!' : 'Copy embed code'}
      </button>
    </div>
  );
}
