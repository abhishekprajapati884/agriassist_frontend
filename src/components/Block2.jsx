import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ChatModal from "./ChatModal";
import { toast } from "react-toastify";

export default function Block2({ isSignedIn = false, userEmail }) {
  const [crops, setCrops] = useState([
    { name: "Tomato", price: "₹25/kg", img: "/tomato.jpeg" },
    { name: "Wheat", price: "₹20/kg", img: "/wheat.jpeg" },
    { name: "Rice", price: "₹18/kg", img: "/rice.jpeg" },
    { name: "Cotton", price: "₹30/kg", img: "/cotton.jpeg" },
    { name: "Maize", price: "₹22/kg", img: "/maize.jpeg" },
  ]); // ✅ Default demo crops for before API loads

  const [suggestion, setSuggestion] = useState(
    "Prices are up 5% today. Consider holding for 2 more days."
  );
  const [loading, setLoading] = useState(false);

  const [translateX, setTranslateX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const containerRef = useRef(null);

  // ✅ Fetch crops & suggestion dynamically (only when signed in)
  useEffect(() => {
    const fetchMarketData = async () => {
      if (!isSignedIn || !userEmail) return;
      setLoading(true);

      try {
        // ✅ 1. Fetch Crops from Backend
        const cropRes = await fetch("http://127.0.0.1:5000/api/trend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const cropData = await cropRes.json();
        console.log("✅ Crops Data:", cropData);

        if (cropData.status === "success" && cropData.crops?.length) {
          setCrops(
            cropData.crops.map((c) => ({
              name: c.name,
              price: c.price,
              img: c.image, // ensure backend sends correct image URL
            }))
          );
        } else {
          toast.error("Could not fetch crops, showing default.");
        }

        // ✅ 2. Fetch Personalized Suggestions
        const suggRes = await fetch(
          "http://127.0.0.1:5000/api/personalized-market-trend",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }),
          }
        );

        const suggData = await suggRes.json();
        console.log("✅ Suggestions:", suggData);

        if (suggData.status === "success") {
          setSuggestion(suggData.scheme_advisor);
        } else {
          setSuggestion("No smart suggestions available today.");
        }
      } catch (error) {
        console.error("❌ Error fetching market data:", error);
        toast.error("Error fetching market data");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [isSignedIn, userEmail]); // ✅ Runs only when signed-in status or email changes


  // ✅ Continuous scrolling (unchanged)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!containerRef.current) return; // ✅ Prevent null errors
      setTranslateX((prev) => {
        const containerWidth = containerRef.current.scrollWidth / 2;
        return Math.abs(prev) >= containerWidth ? 0 : prev - 0.5;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPaused]);

  const manualScroll = (direction) => {
    setTranslateX((prev) => (direction === "left" ? prev + 40 : prev - 40));
  };

  const handleSearchClick = () => {
    if (!isSignedIn) {
      window.openSignInModal();
    } else {
      setShowChatModal(true);
    }
  };

  return (
    <>
      <div
        className="bg-white shadow-md rounded-lg p-4 w-full h-full flex flex-col overflow-hidden relative"
        onMouseEnter={() => {
          setIsPaused(true);
          setHovered(true);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          setHovered(false);
        }}
      >
        <h2 className="text-lg font-bold text-green-700 mb-3">
          Market Dashboard
        </h2>

        {/* ✅ Continuous Scrolling Container */}
        {loading ? (
          <p className="text-sm text-gray-500">⏳ Loading market data...</p>
        ) : (
          <div className="relative w-full overflow-hidden h-28">
            <div
              ref={containerRef}
              className="flex gap-4"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: "transform 0.016s linear",
              }}
            >
              {[...crops, ...crops].map((crop, i) => (
                <div
                  key={i}
                  className="w-36 flex-shrink-0 bg-gray-50 border rounded-lg p-2 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedCrop(crop)}
                >
                  <img
                    src={crop.img}
                    alt={crop.name}
                    className="h-16 w-full object-cover rounded"
                  />
                  <p className="text-sm font-bold mt-1">{crop.name}</p>
                  <p className="text-xs text-gray-600">
                    {isSignedIn
                      ? `Latest Price: ${crop.price}`
                      : "Sign in to see price"}
                  </p>
                </div>
              ))}
            </div>

            {hovered && (
              <>
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-md hover:bg-green-800 z-10"
                  onClick={() => manualScroll("left")}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-md hover:bg-green-800 z-10"
                  onClick={() => manualScroll("right")}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        )}

        {/* ✅ Search Box */}
        <div
          onClick={handleSearchClick}
          className="mt-3 cursor-pointer flex items-center justify-between border rounded px-3 py-2 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <span className="flex-1">
            {isSignedIn
              ? "Ask a question, e.g., Tomato price in Mysore?"
              : "Sign in to ask a question"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-gray-500 ml-2"
          >
            <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
            <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V21h-3a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-3.07A7 7 0 0 0 19 11z" />
          </svg>
        </div>

        {/* ✅ Suggestions */}
        <p className="text-xs text-gray-500 mt-2">
          {isSignedIn
            ? suggestion
            : "Sign in to see amazing facts/suggestions for today by our agents."}
        </p>
      </div>

      {/* ✅ Modal for Crop Details (unchanged) */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedCrop(null)}
            >
              ✕
            </button>
            <div className="flex items-center space-x-4">
              <img
                src={selectedCrop.img}
                alt={selectedCrop.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-green-700">
                  {selectedCrop.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {isSignedIn
                    ? `Current Market Price: ${selectedCrop.price}`
                    : "Sign in to see the latest price"}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {isSignedIn ? (
                <>
                  <p>✔ Demand is moderate this week.</p>
                  <p>✔ Best to sell in next 2–3 days for maximum profit.</p>
                </>
              ) : (
                <p className="text-gray-500">
                  Sign in to see more details, market trends, and suggestions.
                </p>
              )}
            </div>
            {!isSignedIn && (
              <button
                onClick={() => {
                  setSelectedCrop(null);
                  window.openSignInModal();
                }}
                className="mt-4 w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
              >
                Sign In to See Details →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ✅ Chat Modal */}
      {showChatModal && (
        <ChatModal closeModal={() => setShowChatModal(false)} userEmail={userEmail} />
      )}
    </>
  );
}
