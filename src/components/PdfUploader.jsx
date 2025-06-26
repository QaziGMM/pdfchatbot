import { useState } from "react";
import { extractPdfText } from "../utils/pdfUtils";

function PdfUploader({ onExtract }) {
  const [fileName, setFileName] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("❌ File too large. Please select a file under 10MB.");
      return;
    }

    setFileName(file.name);
    const text = await extractPdfText(file);
    onExtract({ name: file.name, size: file.size, text });
  };

  return (
    <div className="p-2">
      <label className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
        📄 chose file
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {fileName && (
        <div className="mt-3 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded shadow-sm">
          ✅ Selected File: <span className="font-semibold">{fileName}</span>
        </div>
      )}
    </div>
  );
}

export default PdfUploader;
