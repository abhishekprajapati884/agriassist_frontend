import { useState } from "react";
import { FaMicrophone, FaCamera } from "react-icons/fa";

export default function ChatModal({ closeModal }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    // ✅ Dummy bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "🤖 This is a sample response (LLM coming soon)." },
      ]);
    }, 1000);

    setInput("");
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMessages((prev) => [
        ...prev,
        { sender: "user", image: imageUrl },
        {
          sender: "bot",
          text: "📸 Thanks for sharing the image! I'll analyze this soon.",
        },
      ]);
      setShowImageModal(false);
    }
  };

  return (
    <>
      {/* ✅ Main Chat Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-lg h-[80%] flex flex-col relative">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
            AgriAssist Chat
          </h2>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto border rounded p-3 mb-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded max-w-xs ${
                  msg.sender === "user"
                    ? "bg-green-100 text-right ml-auto"
                    : "bg-gray-200 text-left"
                }`}
              >
                {msg.text}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="uploaded"
                    className="mt-2 rounded max-h-32"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded p-2"
            />
            <button
              onClick={handleSend}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Send
            </button>
            <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300">
              <FaMicrophone className="text-gray-600" />
            </button>
            <button
              onClick={() => setShowImageModal(true)}
              className="bg-gray-200 p-3 rounded-full hover:bg-gray-300"
            >
              <FaCamera className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Image Selection Modal (Only Upload Option) */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative text-center">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold text-green-700 mb-4">
              Upload Image
            </h2>
            <label className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 cursor-pointer">
              📂 Upload from Device
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
}
