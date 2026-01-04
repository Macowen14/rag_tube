import React, { useState } from "react";
import useStore from "../store/useStore";
import { endpoints } from "../api/client";
import ReactMarkdown from "react-markdown";
import { FileText, Loader2, Sparkles, Download, Copy } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "react-hot-toast";

const NotesDisplay = () => {
  const { currentVideoId, selectedModel, notes, setNotes } = useStore();
  const [topic, setTopic] = useState("Key Takeaways and Summary");
  const [loading, setLoading] = useState(false);
  const contentRef = React.useRef(null);

  const handleGenerate = async () => {
    if (!currentVideoId) {
      toast.error("Please ingest a video first");
      return;
    }

    setLoading(true);
    try {
      const response = await endpoints.generateNotes(
        currentVideoId,
        topic,
        selectedModel
      );
      setNotes(response.answer);
      toast.success("Notes generated successfully!");
    } catch (error) {
      toast.error(`Failed to generate notes: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!notes) return;
    const blob = new Blob([notes], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${currentVideoId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded!");
  };

  const handleCopy = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    toast.success("Copied to clipboard!");
  };

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;

    const opt = {
      margin: [10, 10], // top, left, bottom, right
      filename: `notes-${currentVideoId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#0f172a" }, // Dark background
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(contentRef.current)
      .save()
      .then(() => {
        toast.success("PDF Downloaded!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to generate PDF");
      });
  };

  if (!currentVideoId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 border border-white/5 rounded-2xl bg-dark-light/50 backdrop-blur-sm min-h-[400px]">
        <FileText size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">No video selected</p>
        <p className="text-sm">Ingest a video to generate notes</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-dark-light/30 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-secondary" size={20} />
          Generate AI Notes
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 bg-dark/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
            placeholder="Topic (e.g., specific concept)"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-secondary hover:bg-cyan-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            Generate
          </button>
        </div>
      </div>

      {notes && (
        <div className="flex-1 bg-dark-light/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col relative min-h-[500px]">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
              title="Download PDF"
            >
              <FileText size={18} />
              <span className="text-xs font-semibold hidden group-hover:block transition-all">
                PDF
              </span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Download Markdown"
            >
              <Download size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-4">
            <div
              ref={contentRef}
              className="prose prose-invert max-w-3xl mx-auto prose-headings:text-blue-400 prose-p:text-slate-300 prose-a:text-cyan-400 leading-relaxed p-4 bg-dark"
            >
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDisplay;
