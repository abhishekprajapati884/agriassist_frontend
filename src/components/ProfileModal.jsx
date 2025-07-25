import { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";

export default function ProfileModal({ closeModal, existingProfile, saveProfile }) {
  const [mode, setMode] = useState("text"); // text or audio

  const [profile, setProfile] = useState({
    farmer_profile: {
      name: "",
      contact: { phone: "", email: "" },
      age: "",
      gender: "unknown",
      location: {
        village: "",
        district: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
        pincode: ""
      },
      language_preferences: { spoken: "", literacy_level: "low" },
      device_info: { device_type: "feature_phone", preferred_mode: "voice" },
      crops_grown: [""],
      farming_history: {
        years_of_experience: "",
        practices: [""],
        previous_issues: [{ year: "", problem: "", solution: "" }]
      },
      land_info: {
        land_size_acres: "",
        ownership_type: "leased",
        irrigation_source: "",
        soil_type: ""
      },
      financial_profile: { crop_insurance: false, loan_status: "no_loan" },
      government_scheme_enrollments: [""]
    },
    personalization: {
      proactive_alerts: [""],
      helpful_reminders: [""],
      market_trends_summary: "",
      assistant_suggestions: [""],
      emotional_context: {
        last_detected_sentiment: "neutral",
        stress_indicator: "low"
      }
    }
  });

  useEffect(() => {
    if (existingProfile) setProfile(existingProfile);
  }, [existingProfile]);

  const handleChange = (path, value) => {
    const keys = path.split(".");
    setProfile((prev) => {
      let obj = { ...prev };
      let temp = obj;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          temp[key] = value;
        } else {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
      });
      return obj;
    });
  };

  const handleArrayChange = (path, index, value) => {
    const keys = path.split(".");
    setProfile((prev) => {
      let obj = { ...prev };
      let temp = obj;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          temp[key] = [...temp[key]];
          temp[key][index] = value;
        } else {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
      });
      return obj;
    });
  };

  const addArrayItem = (path) => {
    const keys = path.split(".");
    setProfile((prev) => {
      let obj = { ...prev };
      let temp = obj;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          temp[key] = [...temp[key], ""];
        } else {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
      });
      return obj;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile(profile);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-3xl h-[85%] relative overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          {existingProfile ? "Edit Profile" : "Create Profile"}
        </h2>

        {/* Mode Switch */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              mode === "text" ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("text")}
          >
            Text
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "audio" ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("audio")}
          >
            Audio
          </button>
        </div>

        {/* Content */}
        {mode === "text" ? (
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto h-[calc(100%-110px)] space-y-4 pr-2"
          >
            {/* ✅ Personal Info */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Personal Information</h3>
              <input
                type="text"
                placeholder="Name"
                value={profile.farmer_profile.name}
                onChange={(e) => handleChange("farmer_profile.name", e.target.value)}
                className="w-full border rounded p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={profile.farmer_profile.contact.phone}
                onChange={(e) =>
                  handleChange("farmer_profile.contact.phone", e.target.value)
                }
                className="w-full border rounded p-2 mb-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.farmer_profile.contact.email}
                onChange={(e) =>
                  handleChange("farmer_profile.contact.email", e.target.value)
                }
                className="w-full border rounded p-2 mb-2"
              />
              <input
                type="number"
                placeholder="Age"
                value={profile.farmer_profile.age}
                onChange={(e) => handleChange("farmer_profile.age", e.target.value)}
                className="w-full border rounded p-2 mb-2"
              />
              <select
                value={profile.farmer_profile.gender}
                onChange={(e) => handleChange("farmer_profile.gender", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </section>

            {/* ✅ Location */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Location</h3>
              {["village", "district", "state", "country", "pincode"].map((f) => (
                <input
                  key={f}
                  type="text"
                  placeholder={f}
                  value={profile.farmer_profile.location[f]}
                  onChange={(e) =>
                    handleChange(`farmer_profile.location.${f}`, e.target.value)
                  }
                  className="w-full border rounded p-2 mb-2"
                />
              ))}
            </section>

            {/* ✅ Language & Device Info */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Language & Device</h3>
              <input
                type="text"
                placeholder="Spoken Language"
                value={profile.farmer_profile.language_preferences.spoken}
                onChange={(e) =>
                  handleChange(
                    "farmer_profile.language_preferences.spoken",
                    e.target.value
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
              <select
                value={profile.farmer_profile.language_preferences.literacy_level}
                onChange={(e) =>
                  handleChange(
                    "farmer_profile.language_preferences.literacy_level",
                    e.target.value
                  )
                }
                className="w-full border rounded p-2 mb-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={profile.farmer_profile.device_info.device_type}
                onChange={(e) =>
                  handleChange("farmer_profile.device_info.device_type", e.target.value)
                }
                className="w-full border rounded p-2 mb-2"
              >
                <option value="feature_phone">Feature Phone</option>
                <option value="smartphone">Smartphone</option>
              </select>
            </section>

            {/* ✅ Crops */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Crops</h3>
              {profile.farmer_profile.crops_grown.map((c, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Crop ${i + 1}`}
                  value={c}
                  onChange={(e) =>
                    handleArrayChange("farmer_profile.crops_grown", i, e.target.value)
                  }
                  className="w-full border rounded p-2 mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("farmer_profile.crops_grown")}
                className="text-green-700 text-sm"
              >
                + Add Crop
              </button>
            </section>

            {/* ✅ Farming History */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Farming History</h3>
              <input
                type="number"
                placeholder="Years of experience"
                value={profile.farmer_profile.farming_history.years_of_experience}
                onChange={(e) =>
                  handleChange(
                    "farmer_profile.farming_history.years_of_experience",
                    e.target.value
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
            </section>

            {/* ✅ Land Info */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Land Information</h3>
              <input
                type="number"
                placeholder="Land Size (acres)"
                value={profile.farmer_profile.land_info.land_size_acres}
                onChange={(e) =>
                  handleChange(
                    "farmer_profile.land_info.land_size_acres",
                    e.target.value
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
            </section>

            {/* ✅ Save */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
            >
              Save Profile
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100%-110px)]">
            <p className="text-gray-700 mb-4 text-center">
              🎤 Speak clearly following the sample instruction to record your details.
            </p>
            <button className="bg-green-700 text-white p-4 rounded-full hover:bg-green-800">
              <FaMicrophone className="text-3xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
