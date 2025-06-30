import { useState, useEffect, useRef } from "react";

function ChatInterface({ pdfText, botName = "AI Bot", apiKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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
    <div className="w-full h-full">
      <div className="flex flex-col h-full rounded-xl bg-gray-50 shadow-md">

        {/* Header */}
        <div className="px-4 py-2 font-semibold bg-white">
          <span>{botName}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto no-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] whitespace-pre-line shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-gray-500">✍️ Typing...</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 p-3 bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="💬 Type a message..."
            className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !apiKey}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition disabled:opacity-50"
          >
            Send
          </button>
          <button
            onClick={clearChat}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
