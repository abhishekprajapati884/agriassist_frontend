export default function Block3({ isSignedIn = false }) {
  const alerts = [
    {
      title: "Yellow Leaf Spot Alert",
      desc: isSignedIn
        ? "Seen in: Mysore, Mandya. Moist weather may spread fungal infections."
        : "Seen in: Sign in to see where it is.",
      button: "See more details",
    },
    {
      title: "Aphid Insect Warning",
      desc: isSignedIn
        ? "Nearby farmers reported aphids on brinjal crops. Act fast in next 2 days."
        : "Sign in to see detailed alert for your region.",
      button: "Get remedy steps",
    },
    {
      title: "Rain Expected Tomorrow Afternoon",
      desc: isSignedIn
        ? "Your area: Hassan. Delay urea spraying or pesticide use. Protect stored grains."
        : "Sign in to see weather alert for your area.",
      button: "Weather tips",
    },
  ];

  const handleButtonClick = () => {
    if (!isSignedIn) {
      window.openSignInModal();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full h-full flex flex-col">
      <h2 className="text-lg font-bold text-green-700 mb-2">
        Important Alerts You Should Know Today
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Stay informed & stay ahead! These alerts can help save your crops and money.
      </p>

      {/* ✅ Flexible Alerts Container */}
      <div
        className={`flex-1 ${
          alerts.length > 5 ? "overflow-y-auto" : ""
        } space-y-4`}
      >
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="border rounded-md p-3 shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
            style={{
              height: alerts.length <= 3 ? `${100 / alerts.length - 3}%` : "auto",
              minHeight: "20%", // ✅ ensures minimum proportional height
            }}
          >
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{alert.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{alert.desc}</p>
            </div>
            <button
              className="mt-2 text-green-700 text-xs bg-gray-100 rounded px-2 py-1 hover:bg-green-200 transition self-start"
              onClick={handleButtonClick}
            >
              {alert.button} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
