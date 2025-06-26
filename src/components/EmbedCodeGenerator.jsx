import { useState } from "react";

function EmbedCodeGenerator({ botId }) {
  const [copied, setCopied] = useState(false);
  const iframeCode = `<iframe src="https://yourdomain.com/embed?botId=${botId}" width="400" height="600" style="border:none;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-3">
      <label className="font-semibold text-gray-700">🔗 Embed this bot:</label>

      <textarea
        readOnly
        value={iframeCode}
        className="w-full h-24 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
      />

      <button
        onClick={handleCopy}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
      >
        📋 {copied ? "Copied!" : "Copy Embed Code"}
      </button>
    </div>
  );
}

export default EmbedCodeGenerator;
