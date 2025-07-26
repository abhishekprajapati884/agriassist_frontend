import { useState, useEffect } from "react";
import {
  FaRegCalendarCheck,
  FaLeaf,
  FaShieldAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function Block1({ isSignedIn = false, userEmail = null }) {
  const [reminders, setReminders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState("");
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  // ✅ Dummy demo reminders (ONLY before sign-in)
  const demoReminders = [
    {
      icon: <FaRegCalendarCheck className="text-green-700 text-lg" />,
      title: "Subsidy Application",
      description: "Apply for the subsidy before the deadline.",
      time: "2d:5h:30m",
    },
    {
      icon: <FaLeaf className="text-green-700 text-lg" />,
      title: "Plant Diagnosis",
      description: "Check the results of your plant photo diagnosis.",
      time: "1d:0h:0m",
    },
    {
      icon: <FaShieldAlt className="text-green-700 text-lg" />,
      title: "Crop Protection",
      description: "Spray neem oil on your crops to protect them from pests.",
      time: "0d:12h:0m",
    },
  ];

  // ✅ Fetch reminders from Firestore only when signed in
  useEffect(() => {
    const fetchReminders = async () => {
      if (!isSignedIn || !userEmail) return;

      const docRef = doc(db, "users", userEmail);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        const fetched = data.personalization?.helpful_reminders || [];

        const updated = fetched
          .map((r) => {
            if (!r.expiresAt) return r;
            const remaining = r.expiresAt - Date.now();
            if (remaining <= 0) {
              return { ...r, remainingTime: "Expired" };
            }
            const d = Math.floor(remaining / 86400000);
            const h = Math.floor((remaining % 86400000) / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            return { ...r, remainingTime: `${d}d:${h}h:${m}m:${s}s` };
          })
          .sort((a, b) => (a.expiresAt || Infinity) - (b.expiresAt || Infinity));

        setReminders(updated);
      } else {
        await setDoc(docRef, {
          personalization: { helpful_reminders: [] },
        });
        setReminders([]);
      }
    };

    fetchReminders();
  }, [isSignedIn, userEmail]);

  // ✅ Real-time Timer Update + Auto Delete
  useEffect(() => {
    if (!isSignedIn) return;
    const interval = setInterval(async () => {
      const updatedReminders = reminders
        .map((r) => {
          if (!r.expiresAt) return r;
          const remaining = r.expiresAt - Date.now();
          if (remaining <= 0) {
            return null; // mark for deletion
          }
          const d = Math.floor(remaining / 86400000);
          const h = Math.floor((remaining % 86400000) / 3600000);
          const m = Math.floor((remaining % 3600000) / 60000);
          const s = Math.floor((remaining % 60000) / 1000);
          return { ...r, remainingTime: `${d}d:${h}h:${m}m:${s}s` };
        })
        .filter(Boolean)
        .sort((a, b) => (a.expiresAt || Infinity) - (b.expiresAt || Infinity));

      setReminders(updatedReminders);

      if (isSignedIn && userEmail) {
        const docRef = doc(db, "users", userEmail);
        await updateDoc(docRef, {
          "personalization.helpful_reminders": updatedReminders,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSignedIn, reminders, userEmail]);

  // ✅ Add Reminder
  const handleAddReminder = async () => {
    if (!newReminder.trim()) return;

    const expiresAt =
      Date.now() + day * 86400000 + hour * 3600000 + minute * 60000;

    const updatedReminders = [
      ...reminders,
      {
        icon: "calendar",
        title: newReminder,
        description: "Custom reminder added by you.",
        expiresAt,
        remainingTime: `${day}d:${hour}h:${minute}m:0s`,
      },
    ].sort((a, b) => (a.expiresAt || Infinity) - (b.expiresAt || Infinity));

    setReminders(updatedReminders);

    if (isSignedIn && userEmail) {
      const docRef = doc(db, "users", userEmail);
      await updateDoc(docRef, {
        "personalization.helpful_reminders": updatedReminders,
      });
    }

    setNewReminder("");
    setDay(0);
    setHour(0);
    setMinute(0);
    setShowAddModal(false);
  };

  // ✅ Delete Reminder (manual delete)
  const handleDeleteReminder = async (index) => {
    const updatedReminders = reminders
      .filter((_, i) => i !== index)
      .sort((a, b) => (a.expiresAt || Infinity) - (b.expiresAt || Infinity));
    setReminders(updatedReminders);

    if (isSignedIn && userEmail) {
      const docRef = doc(db, "users", userEmail);
      await updateDoc(docRef, {
        "personalization.helpful_reminders": updatedReminders,
      });
    }
  };

  // ✅ Render icons
  const renderIcon = (icon) => {
    if (icon === "calendar")
      return <FaRegCalendarCheck className="text-green-700 text-lg" />;
    if (icon === "leaf") return <FaLeaf className="text-green-700 text-lg" />;
    if (icon === "shield")
      return <FaShieldAlt className="text-green-700 text-lg" />;
    return <FaRegCalendarCheck className="text-green-700 text-lg" />;
  };

  // ✅ Determine urgency (less than 5 min)
  const isUrgent = (remainingTime) => {
    if (!remainingTime || remainingTime === "Expired") return false;
    const parts = remainingTime.split(":");
    const d = parseInt(parts[0]);
    const h = parseInt(parts[1]);
    const m = parseInt(parts[2]);
    const s = parseInt(parts[3]);
    return d === 0 && h === 0 && (m < 5 || (m === 5 && s <= 0));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full h-full overflow-hidden flex flex-col justify-center">
      {isSignedIn ? (
        <>
          {/* ✅ Heading with Add Button - FIXED AT TOP */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-green-700">
              Helpful Reminders
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800"
            >
              <FaPlus />
            </button>
          </div>

          {/* ✅ Scrollable Reminders List (Heading stays fixed) */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {reminders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                No reminders yet! Add one to stay updated. ✅
              </p>
            ) : (
              reminders.map((reminder, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center border-b pb-2 p-2 rounded ${
                    isUrgent(reminder.remainingTime)
                      ? "bg-red-100 border-red-400"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div>{renderIcon(reminder.icon)}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {reminder.title}
                      </p>
                      <p className="text-xs text-gray-600">{reminder.description}</p>
                      {reminder.remainingTime && (
                        <p
                          className={`text-xs ${
                            isUrgent(reminder.remainingTime)
                              ? "text-red-600 font-bold"
                              : "text-gray-500"
                          }`}
                        >
                          ⏳ {reminder.remainingTime}
                        </p>
                      )}
                    </div>
                  </div>
                  <FaTrash
                    className="text-red-500 text-sm cursor-pointer hover:text-red-700"
                    onClick={() => handleDeleteReminder(index)}
                  />
                </div>
              ))
            )}
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

                {/* ✅ Farmer-Friendly Time Selection */}
                <div className="flex space-x-2 mb-4">
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    {[...Array(31).keys()].map((d) => (
                      <option key={d} value={d}>
                        {d}d
                      </option>
                    ))}
                  </select>
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    {[...Array(24).keys()].map((h) => (
                      <option key={h} value={h}>
                        {h}h
                      </option>
                    ))}
                  </select>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    {[...Array(60).keys()].map((m) => (
                      <option key={m} value={m}>
                        {m}m
                      </option>
                    ))}
                  </select>
                </div>

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
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Helpful Reminders
          </h2>
          <div className="space-y-4">
            {demoReminders.map((reminder, index) => (
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
                    <p className="text-xs text-gray-600">
                      {reminder.description}
                    </p>
                    {reminder.time && (
                      <p className="text-xs text-gray-500">
                        ⏳ {reminder.time}
                      </p>
                    )}
                  </div>
                </div>
                <FaTrash
                  className="text-red-400 text-sm cursor-pointer hover:text-red-600"
                  onClick={() =>
                    setReminders((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
