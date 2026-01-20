export default function ContentForm({ setOutput, setLoading, loading }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:4001/api/aibiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    setOutput(
      data.success ? data.data.document : "Error generating document"
    );
  };

  const inputClass =
    "w-[93%] px-4 py-3 mb-4 rounded-input border border-border text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border rounded-panel p-5 bg-white"
    >
      <label className="text-sm font-medium mb-1 block">Business Name</label>
      <input
        name="businessName"
        required
        className={`${inputClass} max-w-[520px]`}
      />

      <label className="text-sm font-medium mb-1 block">Idea</label>
      <textarea name="idea" className={inputClass} />

      <label className="text-sm font-medium mb-1 block">Industry</label>
      <input name="industry" className={inputClass} />

      <label className="text-sm font-medium mb-1 block">
        Target Audience
      </label>
      <input name="targetAudience" className={inputClass} />

      <label className="text-sm font-medium mb-1 block">
        Document Type
      </label>
      <select name="docType" className={inputClass}>
        <option value="business_plan">Business Plan</option>
        <option value="pitch_deck">Pitch Deck</option>
        <option value="strategy">Strategy</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-6 py-3 rounded-full font-semibold mt-2 hover:brightness-95 disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}
