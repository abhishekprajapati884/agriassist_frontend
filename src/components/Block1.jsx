import { useState, useEffect } from "react";
import { FaRegCalendarCheck, FaLeaf, FaShieldAlt, FaPlus } from "react-icons/fa";

export default function Block1({ isSignedIn = false }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [reminders, setReminders] = useState([
    {
      icon: <FaRegCalendarCheck className="text-green-700 text-lg" />,
      title: "Subsidy Application",
      description: "Apply for the subsidy before the deadline.",
      action: "View Details",
    },
    {
      icon: <FaLeaf className="text-green-700 text-lg" />,
      title: "Plant Diagnosis",
      description: "Check the results of your plant photo diagnosis.",
      action: "View Details",
    },
    {
      icon: <FaShieldAlt className="text-green-700 text-lg" />,
      title: "Crop Protection",
      description: "Spray neem oil on your crops to protect them from pests.",
      action: "Mark as Done",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState("");

  // ✅ Rotating info (before sign-in)
  const contents = [
    {
      title: "Welcome to AgriAssist",
      description: (
        <>
          <p className="mb-1">
            Your personal farming companion — powered by intelligent agents.
          </p>
          <p>✅ Get proactive alerts tailored to your needs, set reminders, and stay informed.</p>
          <p>✅ View personalized market trends for your crops and region.</p>
          <p>✅ Chat with our smart assistant for quick help — in your language.</p>
          <p>✅ Talk or type — it's your choice.</p>
        </>
      ),
    },
    {
      title: "Namaskara, User!",
      description: (
        <>
          <p className="mb-2">I’m here to help you with your farming needs:</p>
          <ul className="space-y-1">
            <li>🌦 <strong>Proactive Alert:</strong> Delay irrigation, rain expected.</li>
            <li>🪴 <strong>Helpful Reminder:</strong> You asked about neem oil.</li>
            <li>📊 <strong>Market Trends:</strong> Latest crop price updates.</li>
            <li>🤖 <strong>Personal AI Assistant:</strong> Ask me anything about farming.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Helpful Reminders",
      description: (
        <ul className="space-y-1">
          <li>📅 <strong>Subsidy Application:</strong> Apply before the deadline.</li>
          <li>🌱 <strong>Plant Diagnosis:</strong> View your plant photo diagnosis.</li>
          <li>🛡 <strong>Crop Protection:</strong> Spray neem oil to protect crops.</li>
        </ul>
      ),
    },
  ];

  useEffect(() => {
    if (isSignedIn) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % contents.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSignedIn]);

  const handleAddReminder = () => {
    if (!newReminder.trim()) return;
    setReminders((prev) => [
      ...prev,
      {
        icon: <FaRegCalendarCheck className="text-green-700 text-lg" />,
        title: newReminder,
        description: "Custom reminder added by you.",
        action: "View Details",
      },
    ]);
    setNewReminder("");
    setShowAddModal(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full h-full overflow-hidden flex flex-col justify-center">
      {isSignedIn ? (
        <>
          {/* ✅ Heading with Add Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-700">Helpful Reminders</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800"
            >
              <FaPlus />
            </button>
          </div>

          {/* ✅ Reminders List (Scrollable) */}
          <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
            {reminders.map((reminder, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-start space-x-3">
                  <div>{reminder.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {reminder.title}
                    </p>
                    <p className="text-xs text-gray-600">{reminder.description}</p>
                  </div>
                </div>
                <button className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded hover:bg-gray-200">
                  {reminder.action}
                </button>
              </div>
            ))}
          </div>


          {/* ✅ Add Reminder Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
                <h3 className="text-lg font-bold text-green-700 mb-3">
                  Add New Reminder
                </h3>
                <input
                  type="text"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  className="w-full border rounded p-2 text-sm mb-4 focus:outline-green-700"
                  placeholder="Enter reminder title..."
                />
                <button
                  onClick={handleAddReminder}
                  className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-green-700 mb-3 transition-opacity duration-500">
            {contents[index].title}
          </h2>
          <div
            className={`text-gray-700 text-sm transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {contents[index].description}
          </div>
        </>
      )}
    </div>
  );
}
