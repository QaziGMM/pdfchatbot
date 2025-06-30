import { useState } from "react";
import ChatbotSetupForm from "./ChatbotSetupForm";
import PdfUploader from "./PdfUploader";
import EmbedCodeGenerator from "./EmbedCodeGenerator";
import ChatInterface from "./ChatInterface";

function ChatbotBuilder() {
  const [botInfo, setBotInfo] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("apiKey") || "");
  const [widgetOpen, setWidgetOpen] = useState(false);

  const handleSetup = (data) => {
    setBotInfo({ ...data, botId: Date.now().toString() });
    setStep(2);
  };

  const handlePdfExtract = (data) => {
    setPdfInfo(data);
    setStep(3);
  };

  const handleSaveApiKey = () => {
    if (apiKey) {
      sessionStorage.setItem("apiKey", apiKey);
      alert("✅ API Key saved.");
    }
  };

  const canChat = botInfo && pdfInfo && apiKey;

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">🛠️ Chatbot Builder</h1>

      {/* Step Indicator */}
      <div className="flex justify-center mb-6 gap-4">
        {["Setup", "Upload", "Embed"].map((label, i) => (
          <div
            key={label}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">1️⃣ Setup Bot</h2>
            <ChatbotSetupForm onSetup={handleSetup} />
            {/* API Key Input */}
            <div className="mt-4">
              <label className="text-sm font-medium">🔑 Enter your Gemini API Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Your Gemini API Key"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">2️⃣ Upload PDF</h2>
            <PdfUploader onExtract={handlePdfExtract} />
            {pdfInfo && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
                <strong>Uploaded:</strong> {pdfInfo.name} <br />
                <strong>Size:</strong> {(pdfInfo.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <button onClick={() => setStep(1)} className="text-blue-600 hover:underline">⬅ Back</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">3️⃣ Embed Code</h2>
            {botInfo ? (
              <EmbedCodeGenerator botId={botInfo.botId} />
            ) : (
              <div className="text-gray-500 text-sm">Fill setup form to generate embed code.</div>
            )}
            <div className="mt-4 flex justify-between">
              <button onClick={() => setStep(2)} className="text-blue-600 hover:underline">⬅ Back</button>
            </div>
          </>
        )}
      </div>

      {/* Floating Chat Widget */}
      {canChat && (
        <div className="fixed bottom-6 right-6">
          {widgetOpen ? (
            <div className="w-[350px] h-[500px] bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                <span>💬 {botInfo.botName}</span>
                <button onClick={() => setWidgetOpen(false)}>✖</button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hidden">
                <ChatInterface
                  pdfText={pdfInfo.text}
                  botName={botInfo.botName}
                  apiKey={apiKey}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setWidgetOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              💬 Chat
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatbotBuilder;
