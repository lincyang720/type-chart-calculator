'use client';

export default function PrintChartButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 print:hidden"
    >
      Print weakness chart
    </button>
  );
}
