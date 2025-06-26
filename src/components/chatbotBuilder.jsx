import { useState } from "react";
import ChatbotSetupForm from "./ChatbotSetupForm";
import PdfUploader from "./PdfUploader";
import EmbedCodeGenerator from "./EmbedCodeGenerator";
import ChatInterface from "./ChatInterface";

function ChatbotBuilder() {
  const [botInfo, setBotInfo] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);

  const handleSetup = (data) => {
    setBotInfo({ ...data, botId: Date.now().toString() });
  };

  const handlePdfExtract = (data) => {
    setPdfInfo(data);
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">🛠️ Chatbot Builder</h1>

      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        
        <div className="flex flex-col gap-6">
          <section className="bg-white p-4 rounded-lg shadow min-h-[450px] flex flex-col">
            <h2 className="text-lg font-semibold mb-2">1️⃣ Setup Bot</h2>
            <ChatbotSetupForm onSetup={handleSetup} />
          </section>
        </div>


        <div className="flex flex-col gap-6">
          <section className="bg-white p-4 rounded-lg shadow min-h-[220px]">
            <h2 className="text-lg font-semibold mb-2">2️⃣ Upload PDF</h2>
            <PdfUploader onExtract={handlePdfExtract} />
            {pdfInfo && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
                <strong>Uploaded:</strong> {pdfInfo.name} <br />
                <strong>Size:</strong> {(pdfInfo.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </section>

          <section className="bg-white p-4 rounded-lg shadow min-h-[220px] flex-1">
            <h2 className="text-lg font-semibold mb-2">3️⃣ Embed Code</h2>
            {botInfo ? (
              <EmbedCodeGenerator botId={botInfo.botId} />
            ) : (
              <div className="text-gray-500 text-sm">Fill setup form to generate embed code.</div>
            )}
          </section>
        </div>

        
        <div className="flex flex-col gap-6">
          <section className="bg-white p-4 rounded-lg shadow min-h-[450px] flex flex-col">
            <h2 className="text-lg font-semibold mb-4">
              4️⃣ Chat with <span className="text-blue-600">{botInfo?.botName || "Bot"}</span>
            </h2>
            {botInfo && pdfInfo ? (
              <ChatInterface pdfText={pdfInfo.text} botName={botInfo.botName} />
            ) : (
              <div className="text-gray-400 text-sm">Chat will appear here after Setup + Upload.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChatbotBuilder;
