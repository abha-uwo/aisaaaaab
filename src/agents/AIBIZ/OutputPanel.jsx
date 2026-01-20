export default function OutputPanel({ output, loading }) {
  return (
    <div className="border border-border rounded-panel p-5 bg-white">
      <h2 className="text-lg font-semibold mb-3">Output</h2>

      <div className="h-[420px] overflow-y-auto rounded-2xl border border-dashed border-border p-4 bg-[#fafbff]">
        {loading && (
          <p className="text-gray-400">Generating...</p>
        )}

        {!loading && !output && (
          <p className="text-gray-400">
            Your generated document will appear here.
          </p>
        )}

        {!loading && output && (
          <pre className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
