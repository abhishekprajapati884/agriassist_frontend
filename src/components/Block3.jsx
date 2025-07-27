import { useState, useEffect } from "react";

// ✅ Replace this with your backend API endpoint
const API_URL = "https://your-backend.com/api/block3-slots";

export default function Block3({ isSignedIn = false, userEmail = null }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Demo slots for guests (before sign-in)
  const demoSlots = [
    { title: "Weather Update", description: "Rain expected in 2 days." },
    { title: "Farming Tip", description: "Use neem oil for pest control." },
    { title: "Market Alert", description: "Tomato prices rising this week." },
  ];

  // ✅ Fetch slots from backend after sign-in
  useEffect(() => {
    const fetchSlots = async () => {
      if (!isSignedIn || !userEmail) return;

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}?email=${userEmail}`);
        if (!res.ok) throw new Error("Failed to fetch slots");

        const data = await res.json();
        setSlots(data.slots || []); // expected response: { slots: [ { title, description }, ... ] }
      } catch (error) {
        console.error("❌ Error fetching Block3 slots:", error);
        setSlots([]); // fallback to empty if failed
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [isSignedIn, userEmail]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full h-full flex flex-col">
      <h2 className="text-lg font-bold text-green-700 mb-3">
        Smart Farming Insights
      </h2>

      {isSignedIn ? (
        <>
          {loading ? (
            <p className="text-sm text-gray-500">Loading insights...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-gray-500">
              No insights available right now. ✅
            </p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="border rounded p-3 bg-gray-50 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {slot.title}
                  </p>
                  <p className="text-xs text-gray-600">{slot.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // ✅ Show demo slots before sign-in
        <div className="space-y-3">
          {demoSlots.map((slot, index) => (
            <div
              key={index}
              className="border rounded p-3 bg-gray-50 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-800">
                {slot.title}
              </p>
              <p className="text-xs text-gray-600">{slot.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
