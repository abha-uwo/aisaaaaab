export default function BizForm({ setOutput, setLoading }) {
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

    if (data.success) {
      setOutput(data.data.document);
    } else {
      setOutput("Error generating document");
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label className="field-label">Business Name</label>
      <input name="businessName" className="text-input" required />

      <label className="field-label">Idea</label>
      <textarea name="idea" className="textarea-input" />

      <label className="field-label">Industry</label>
      <input name="industry" className="text-input" />

      <label className="field-label">Target Audience</label>
      <input name="targetAudience" className="text-input" />

      <label className="field-label">Document Type</label>
      <select name="docType" className="select-input">
        <option value="business_plan">Business Plan</option>
        <option value="pitch_deck">Pitch Deck</option>
        <option value="strategy">Strategy</option>
      </select>

      <button className="primary-button" type="submit">
        Generate
      </button>
    </form>
  );
}
