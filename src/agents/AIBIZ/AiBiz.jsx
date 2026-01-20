import { useEffect, useState } from "react";
import ContentForm from "./components/ContentForm";
import OutputPanel from "./components/OutputPanel";
import HistorySidebar from "./components/HistorySidebar";
import { apis } from "../../types";
import { getUserData } from "../../userStore/userData";
import axios from "axios";

export default function AiBiz() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const token = getUserData()?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // fetch history
  const fetchHistory = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`${apis.aibiz}/history`, config);
      setHistory(res.data);
      console.log("History fetched:", res.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async (formData) => {
    setLoading(true);
    setHasGenerated(true);
    try {
      const res = await axios.post(`${apis.aibiz}`, formData, config);
      setOutput(res.data.data.document);

      // Wait a bit before fetching to ensure DB is updated
      setTimeout(() => {
        fetchHistory();
      }, 500);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = (item) => {
    setOutput(item.content);
    setHasGenerated(true);
  };

  const deleteHistory = async (id) => {
    if (deleting) return;

    setDeleting(true);
    try {
      console.log("Deleting document with ID:", id);

      await axios.delete(`${apis.aibiz}/history/${id}`, config);

      console.log("Delete successful");

      // Immediately update UI by removing from local state
      setHistory(prevHistory => prevHistory.filter(item => item._id !== id));

      // Also fetch fresh data to be sure
      setTimeout(() => {
        fetchHistory();
      }, 300);

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document. Please try again.");
      fetchHistory();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 overflow-auto p-4 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <ContentForm onGenerate={handleGenerate} loading={loading} />
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="hidden lg:block w-1/2 overflow-auto p-8 bg-white border-l border-gray-200">
          <OutputPanel
            output={output}
            loading={loading}
            hasGenerated={hasGenerated}
          />
        </div>
      </div>

      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLoadHistory={loadHistory}
        onDeleteHistory={deleteHistory}
      />

      {/* Mobile Output (shown below form on small screens - actually modal or overlay might be better but adapting original layout) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 max-h-[50vh] bg-white overflow-auto p-4 border-t border-gray-200 shadow-xl" style={{ display: output ? 'block' : 'none' }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Output</h3>
          <button onClick={() => setOutput("")} className="text-gray-500">Close</button>
        </div>
        <OutputPanel
          output={output}
          loading={loading}
          hasGenerated={hasGenerated}
        />
      </div>
    </div>
  );
}
