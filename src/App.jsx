import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

import Block1 from "./components/Block1";
import Block2 from "./components/Block2";
import Block3 from "./components/Block3";
import ProfileModal from "./components/ProfileModal";
import { toast } from "react-toastify";

export default function App() {
  const { openSignIn, isSignedIn, user, showProfile, setShowProfile } = useOutletContext();
  const [existingProfile, setExistingProfile] = useState(null);
  // const [userProfile, setUserProfile] = useState(null);

  // ✅ Fetch profile when signed in
  useEffect(() => {
    const fetchProfile = async () => {
      if (isSignedIn && user?.email) {
        const docRef = doc(db, "users", user.email);
        console.log("...docref = ", docRef)
        console.log("...user.email = ", user.email)
        // const docSnap = await getDoc(docRef);
        // console.log("...docsnap = ", docSnap)
        // console.log("...docSnap.data() = ", docSnap.data())
        const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
          //   console.log("✅ Profile fetched:", docSnap.data().farmer_profile);
          //   setExistingProfile(docSnap.data().farmer_profile);
        // }
      
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExistingProfile(data); // ✅ Now it has {farmer_profile: {...}, personalization: {...}}
        } else {
          console.log("⚠️ No profile found, user might need to create one.");
          setExistingProfile(null);
        }
      }
    };
    fetchProfile();
  }, [isSignedIn, user]);

  // ✅ Save profile to Firestore
  const handleSaveProfile = async (profileData) => {
    try {
      await setDoc(doc(db, "users", user.email), profileData);
      setExistingProfile(profileData);
      // toast.success("✅ Profile saved successfully!");
      setShowProfile(false);
    } catch (error) {
      toast.error("❌ Failed to save profile.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 h-[calc(100vh-128px)]">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 h-full">
          <div className="h-1/2">
            <Block1 isSignedIn={isSignedIn} userEmail={user?.email}/>
            {/* profile={existingProfile} />  */}
          </div>
          <div className="h-1/2">
            <Block2 isSignedIn={isSignedIn} onSignInClick={openSignIn} />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 h-full">
          <Block3 isSignedIn={isSignedIn} onSignInClick={openSignIn} />
        </div>
      </div>

      {/* ✅ Profile Modal */}
      {showProfile && (
        <ProfileModal
          closeModal={() => setShowProfile(false)}
          existingProfile={existingProfile}
          saveProfile={handleSaveProfile}
          userEmail={user?.email || ""}
        />
      )}
    </div>
  );
}
