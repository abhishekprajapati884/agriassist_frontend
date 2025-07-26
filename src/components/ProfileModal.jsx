import { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // ✅ Adjust path if needed
// import toast from "react-hot-toast";

export default function ProfileModal({ closeModal, existingProfile, saveProfile, userEmail }) {
  const [mode, setMode] = useState("text");

  // ✅ Initialize Profile with default values
  const [profile, setProfile] = useState({
    farmer_profile: {
      name: "",
      contact: { phone: "", email: userEmail || "" },
      age: "",
      gender: "",
      location: {
        village: "",
        district: "",
        state: "",
        country: "",
        latitude: null,
        longitude: null,
        pincode: "",
      },
      language_preferences: { spoken: "", literacy_level: "" },
      device_info: { device_type: "", preferred_mode: "" },
      crops_grown: [""],
      farming_history: {
        years_of_experience: "",
        practices: [""],
        previous_issues: [{ year: "", problem: "", solution: "" }],
      },
      land_info: {
        land_size_acres: "",
        ownership_type: "",
        irrigation_source: "",
        soil_type: "",
      },
      financial_profile: { crop_insurance: false, loan_status: "" },
      government_scheme_enrollments: [""],
    },
    personalization: {
      proactive_alerts: [],
      helpful_reminders: [],
      market_trends_summary: "",
      assistant_suggestions: [],
      emotional_context: {
        last_detected_sentiment: null,
        stress_indicator: null,
      },
    },
  });

  useEffect(() => {
    if (existingProfile) {
      setProfile({
        ...existingProfile,
        farmer_profile: {
          ...existingProfile.farmer_profile,
          contact: {
            ...existingProfile.farmer_profile.contact,
            email: userEmail || existingProfile.farmer_profile.contact.email,
          },
        },
      });
    }
  }, [existingProfile, userEmail]);

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

  const addArrayItem = (path, itemTemplate = "") => {
    const keys = path.split(".");
    setProfile((prev) => {
      let obj = { ...prev };
      let temp = obj;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          temp[key] = [...temp[key], itemTemplate];
        } else {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
      });
      return obj;
    });
  };

  const addPreviousIssue = () => {
    setProfile((prev) => ({
      ...prev,
      farmer_profile: {
        ...prev.farmer_profile,
        farming_history: {
          ...prev.farmer_profile.farming_history,
          previous_issues: [
            ...prev.farmer_profile.farming_history.previous_issues,
            { year: "", problem: "", solution: "" },
          ],
        },
      },
    }));
  };

  // ✅ Validation before saving
  const isValidProfile = () => {
  const f = profile.farmer_profile;

  if (
    !f.name ||
    !f.contact.phone ||
    !f.contact.email ||
    !f.location.village ||
    !f.location.district ||
    !f.location.state ||
    !f.location.country ||
    !f.location.pincode ||
    !f.language_preferences.spoken ||
    !f.device_info.preferred_mode ||
    !f.crops_grown[0] ||
    !f.farming_history.years_of_experience ||
    !f.land_info.land_size_acres ||
    !f.land_info.ownership_type ||
    !f.land_info.irrigation_source
  ) {
    toast.error("❌ Please fill all mandatory (*) fields.");
    return false;
  }

  if (!/^\d{10}$/.test(f.contact.phone)) {
    toast.error("❌ Phone number must be 10 digits.");
    return false;
  }

  return true;
};


  const handleSubmit =async (e) => {
  e.preventDefault();
  if (!isValidProfile()) return;


    // ✅ Fill empty optional fields with null before saving
    const cleanedProfile = JSON.parse(
  JSON.stringify(profile, (key, value) => (value === "" ? null : value))
  );
    // console.log("✅ Profile Data to Save:", cleanedProfile);
    // saveProfile(cleanedProfile);
    // toast.success("✅ Profile saved successfully!");
    // closeModal();
    try {
      // ✅ Save to Firestore
      const userId = profile.farmer_profile.contact.email; // Use email as ID
      await setDoc(doc(db, "users", userId), { profile: cleanedProfile });

      saveProfile(cleanedProfile); // Keep local update if you need
      toast.success("✅ Profile saved successfully!");
      closeModal();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("❌ Failed to save profile. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-3xl h-[85%] relative overflow-hidden">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          {existingProfile ? "Edit Profile" : "Create Profile"}
        </h2>

        {/* Mode Switch */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded ${mode === "text" ? "bg-green-700 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("text")}
          >
            Text
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === "audio" ? "bg-green-700 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("audio")}
          >
            Audio
          </button>
        </div>

        {mode === "text" ? (
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto h-[calc(100%-110px)] space-y-4 pr-2"
          >
            {/* ✅ Personal Information */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Personal Information</h3>
              <input type="text" placeholder="Name *"
                value={profile.farmer_profile.name}
                onChange={(e) => handleChange("farmer_profile.name", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <input type="text" placeholder="Phone *"
                value={profile.farmer_profile.contact.phone}
                onChange={(e) => handleChange("farmer_profile.contact.phone", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <input type="email" placeholder="Email *"
                value={profile.farmer_profile.contact.email}
                readOnly
                className="w-full border rounded p-2 mb-2 bg-gray-100 text-gray-500" />
              <input type="number" placeholder="Age"
                value={profile.farmer_profile.age || ""}
                onChange={(e) => handleChange("farmer_profile.age", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <select value={profile.farmer_profile.gender || ""}
                onChange={(e) => handleChange("farmer_profile.gender", e.target.value)}
                className="w-full border rounded p-2">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </section>

            {/* ✅ Location */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Location</h3>
              {["village", "district", "state", "country", "pincode"].map((f) => (
                <input key={f} type="text" placeholder={`${f} *`}
                  value={profile.farmer_profile.location[f]}
                  onChange={(e) => handleChange(`farmer_profile.location.${f}`, e.target.value)}
                  className="w-full border rounded p-2 mb-2" />
              ))}
            </section>

            {/* ✅ Language & Device */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Language & Device</h3>
              <input type="text" placeholder="Spoken Language *"
                value={profile.farmer_profile.language_preferences.spoken}
                onChange={(e) => handleChange("farmer_profile.language_preferences.spoken", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <select
                value={profile.farmer_profile.device_info.device_type}
                onChange={(e) => handleChange("farmer_profile.device_info.device_type", e.target.value)}
                className="w-full border rounded p-2 mb-2">
                <option value="">Select Device Type</option>
                <option value="keypad">Keypad</option>
                <option value="touchscreen">Touchscreen</option>
              </select>
              <select
                value={profile.farmer_profile.device_info.preferred_mode}
                onChange={(e) => handleChange("farmer_profile.device_info.preferred_mode", e.target.value)}
                className="w-full border rounded p-2 mb-2">
                <option value="">Preferred Mode *</option>
                <option value="voice">Voice</option>
                <option value="text">Text</option>
              </select>
            </section>

            {/* ✅ Crops */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Crops *</h3>
              {profile.farmer_profile.crops_grown.map((c, i) => (
                <input key={i} type="text" placeholder={`Crop ${i + 1}`}
                  value={c}
                  onChange={(e) => handleArrayChange("farmer_profile.crops_grown", i, e.target.value)}
                  className="w-full border rounded p-2 mb-2" />
              ))}
              <button type="button"
                onClick={() => addArrayItem("farmer_profile.crops_grown")}
                className="text-green-700 text-sm">+ Add Crop</button>
            </section>

            {/* ✅ Farming History */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Farming History</h3>
              <input type="number" placeholder="Years of Experience *"
                value={profile.farmer_profile.farming_history.years_of_experience}
                onChange={(e) => handleChange("farmer_profile.farming_history.years_of_experience", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <h4 className="text-sm text-gray-700">Practices</h4>
              {profile.farmer_profile.farming_history.practices.map((p, i) => (
                <input key={i} type="text" placeholder={`Practice ${i + 1}`}
                  value={p}
                  onChange={(e) => handleArrayChange("farmer_profile.farming_history.practices", i, e.target.value)}
                  className="w-full border rounded p-2 mb-2" />
              ))}
              <button type="button"
                onClick={() => addArrayItem("farmer_profile.farming_history.practices")}
                className="text-green-700 text-sm">+ Add Practice</button>

              <h4 className="text-sm text-gray-700 mt-2">Previous Issues</h4>
              {profile.farmer_profile.farming_history.previous_issues.map((issue, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <input type="text" placeholder="Year" value={issue.year}
                    onChange={(e) => handleArrayChange(`farmer_profile.farming_history.previous_issues`, i,
                      { ...issue, year: e.target.value })} className="border rounded p-2" />
                  <input type="text" placeholder="Problem" value={issue.problem}
                    onChange={(e) => handleArrayChange(`farmer_profile.farming_history.previous_issues`, i,
                      { ...issue, problem: e.target.value })} className="border rounded p-2" />
                  <input type="text" placeholder="Solution" value={issue.solution}
                    onChange={(e) => handleArrayChange(`farmer_profile.farming_history.previous_issues`, i,
                      { ...issue, solution: e.target.value })} className="border rounded p-2" />
                </div>
              ))}
              <button type="button" onClick={addPreviousIssue} className="text-green-700 text-sm">
                + Add Previous Issue
              </button>
            </section>

            {/* ✅ Land Info */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Land Info</h3>
              <input type="number" placeholder="Land Size (acres) *"
                value={profile.farmer_profile.land_info.land_size_acres}
                onChange={(e) => handleChange("farmer_profile.land_info.land_size_acres", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <input type="text" placeholder="Ownership Type *"
                value={profile.farmer_profile.land_info.ownership_type}
                onChange={(e) => handleChange("farmer_profile.land_info.ownership_type", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <input type="text" placeholder="Irrigation Source *"
                value={profile.farmer_profile.land_info.irrigation_source}
                onChange={(e) => handleChange("farmer_profile.land_info.irrigation_source", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
              <input type="text" placeholder="Soil Type"
                value={profile.farmer_profile.land_info.soil_type}
                onChange={(e) => handleChange("farmer_profile.land_info.soil_type", e.target.value)}
                className="w-full border rounded p-2 mb-2" />
            </section>

            {/* ✅ Financial Profile */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Financial Profile</h3>
              <select
                value={profile.farmer_profile.financial_profile.crop_insurance}
                onChange={(e) => handleChange("farmer_profile.financial_profile.crop_insurance", e.target.value === "true")}
                className="w-full border rounded p-2 mb-2">
                <option value="">Crop Insurance *</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <select
                value={profile.farmer_profile.financial_profile.loan_status}
                onChange={(e) => handleChange("farmer_profile.financial_profile.loan_status", e.target.value)}
                className="w-full border rounded p-2">
                <option value="">Loan Status</option>
                <option value="debt">Debt</option>
                <option value="no_debt">No Debt</option>
              </select>
            </section>

            {/* ✅ Government Schemes */}
            <section>
              <h3 className="font-bold text-green-700 mb-2">Government Scheme Enrollments</h3>
              {profile.farmer_profile.government_scheme_enrollments.map((s, i) => (
                <input key={i} type="text" placeholder={`Scheme ${i + 1}`}
                  value={s}
                  onChange={(e) => handleArrayChange("farmer_profile.government_scheme_enrollments", i, e.target.value)}
                  className="w-full border rounded p-2 mb-2" />
              ))}
              <button type="button"
                onClick={() => addArrayItem("farmer_profile.government_scheme_enrollments")}
                className="text-green-700 text-sm">+ Add Scheme</button>
            </section>

            <button
              type="submit"
              className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800 mt-4">
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
