import { useState } from "react";
import { FaMicrophone, FaCamera } from "react-icons/fa";
import AudioRecorder from "../utils/audioRecorder";
import { toast } from "react-toastify";

export default function ChatModal({ closeModal, userEmail }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  // ✅ Audio States
  const [isRecording, setIsRecording] = useState(false);
  const [loadingTranscription, setLoadingTranscription] = useState(false);

  const recorder = new AudioRecorder();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: input,      // user's message
        }),
        });

        const text = await response.text(); 
        console.log("Raw Response:", text);

        // Optionally parse manually if formatted like "data: xxx"
        const clean = text.replace(/^data:\s*/, "");
        setMessages((prev) => [...prev, { sender: "bot", text: clean }]);

        // const data = await response.json();
        // if (data.status === "success") {
        // setMessages((prev) => [
        //     ...prev,
        //     { sender: "bot", text: data.response }, // backend's response
        // ]);
        // } else {
        // toast.error("Failed to fetch response from the assistant.");
        // }
    } catch (error) {
        console.error("❌ Chat API failed:", error);
        toast.error("Something went wrong. Please try again!");
    }
    };


  // ✅ Handle Image Upload
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

  // ✅ Handle Audio Recording (Start/Stop + Transcription)
  const handleMicClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await recorder.startRecording();
    } else {
      setIsRecording(false);
      setLoadingTranscription(true);

      try {
        const formData = await recorder.toFormData();
        formData.append("userEmail", userEmail);

        const res = await fetch("http://localhost:5000/chat", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setLoadingTranscription(false);

        if (data.status === "success") {
          const userMessage = { sender: "user", text: data.transcribed_text };
          setMessages((prev) => [...prev, userMessage]);

          // ✅ Simulated bot reply
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "🤖 Got it! Processing your query." },
            ]);
          }, 1000);

          toast.success("Transcription successful!");
        } else {
          toast.error("Could not transcribe. Please try again.");
        }
      } catch (err) {
        console.error("❌ Transcription error:", err);
        toast.error("Error while transcribing.");
        setLoadingTranscription(false);
      }
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

          {/* ✅ Show Loader if Transcribing */}
          {loadingTranscription && (
            <div className="text-center text-sm text-gray-500 mb-2">
              🎙 Transcribing your audio...
            </div>
          )}

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
            <button
              onClick={handleMicClick}
              className={`p-3 rounded-full ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <FaMicrophone />
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

      {/* ✅ Image Upload Modal */}
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
