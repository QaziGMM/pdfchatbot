import { useState, useEffect, useRef } from "react";

function ChatInterface({ pdfText, botName = "AI Bot" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `This is the PDF content:\n${pdfText?.slice(0, 2000)}\n\nQuestion: ${input}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Failed to get a response from API.";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chat");
  };

  return (
    <div className="w-full relative">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-0 right-0 z-10 bg-blue-600 text-white px-3 py-1 text-sm rounded-t-md shadow hover:bg-blue-700 transition"
      >
        {isOpen ? "Hide Chat" : "Show Chat"}
      </button>

      
      <div
        className={`mt-10 transition-all duration-300 ${
          isOpen ? "opacity-100 max-h-[600px]" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col h-[500px] rounded-xl shadow-inner border bg-gray-50">
          
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl font-semibold flex items-center justify-between">
            <span>{botName}</span>
            <button
              onClick={clearChat}
              className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-100"
            >
              Clear Chat
            </button>
          </div>

          
          <div className="px-3 py-2 border-b bg-white">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="🔑 Enter your Gemini API Key"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] whitespace-pre-line
                    ${msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">✍️ Typing...</div>}
            <div ref={chatEndRef} />
          </div>

          
          <div className="flex items-center gap-2 p-3 border-t bg-white rounded-b-xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="💬 Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !apiKey}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
