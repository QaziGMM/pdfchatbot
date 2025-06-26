import { useEffect, useState } from "react";
import ChatInterface from "../components/ChatInterface";

function EmbedBot() {
  const [botData, setBotData] = useState(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const botId = params.get("botId");

    
    if (botId === "my-chatbot-001") {
      setBotData({
        botName: "PDF Assistant",
        description: "Ask anything about your PDF",
        greeting: "Hello! I'm ready to answer your questions.",
        color: "#00A3FF",
        pdfText: "Paste your extracted PDF content here",
      });
    }
  }, []);

  if (!botData) return <p>Loading chatbot...</p>;

  return (
    <div className="p-2" style={{ backgroundColor: "#f9f9f9", height: "100vh" }}>
      <h2 className="text-lg font-bold">{botData.botName}</h2>
      <p className="text-sm text-gray-600">{botData.description}</p>

      <input
        placeholder="Enter your Gemini API Key"
        className="border p-2 w-full my-2"
        onChange={(e) => setApiKey(e.target.value)}
      />

      <ChatInterface
        pdfText={botData.pdfText}
        apiKey={apiKey}
        theme={botData.color}
      />
    </div>
  );
}

export default EmbedBot;
