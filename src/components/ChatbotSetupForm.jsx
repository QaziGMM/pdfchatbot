import { useState } from "react";

function ChatbotSetupForm({ onSetup }) {
  const [form, setForm] = useState({
    botName: '',
    description: '',
    greeting: '',
    color: '#00A3FF',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 space-y-4">
      <input
        name="botName"
        value={form.botName}
        onChange={handleChange}
        placeholder="🤖 Bot Name"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="📝 Bot Description"
        rows={3}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <div className="flex items-center gap-4">
        <label htmlFor="color" className="text-sm font-medium">🎨 Bot Theme Color:</label>
        <input
          type="color"
          id="color"
          name="color"
          value={form.color}
          onChange={handleChange}
          className="w-10 h-10 rounded-md cursor-pointer border border-gray-300"
        />
      </div>

      <input
        name="greeting"
        value={form.greeting}
        onChange={handleChange}
        placeholder="💬 Greeting Message"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <button
        onClick={() => onSetup(form)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
      >
        ➡️ Next
      </button>
    </div>
  );
}

export default ChatbotSetupForm;
