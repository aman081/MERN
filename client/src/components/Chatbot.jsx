import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem("urjaa_chat_history");
  return saved ? JSON.parse(saved) : [];
});

  // 🔹 Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("urjaa_chat_history");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // 🔹 Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("urjaa_chat_history", JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setOpen(!open);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");

    try {
      const res = await axios.post("/api/chatbot", { userQuery: query });

      const botMsg = {
        sender: "bot",
        type: res.data.type,
        text: res.data.summary,
        data: res.data.data || null,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          💬 Chat
        </button>
      )}

      {open && (
        <div className="w-80 bg-white shadow-2xl rounded-lg border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <h3 className="font-semibold">Urjaa Bot</h3>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-100 self-start"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.sender === "bot" &&
                  msg.type === "mongodb" &&
                  msg.data && (
                    <div className="mt-2 space-y-2 text-xs text-left">
                      {Object.entries(msg.data).map(([section, items]) =>
                        items.length > 0 ? (
                          <div key={section}>
                            <strong className="capitalize">{section}</strong>
                            <ul className="list-disc ml-4">
                              {items.map((item, idx) => (
                                <li key={idx}>
                                  {item.title || item.name || item.content}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="flex-1 px-2 py-1 border rounded mr-2 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
