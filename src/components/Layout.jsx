import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

export default function Layout() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        openProfile={() => setShowProfile(true)} // ✅ Pass openProfile to Header
      />

      <main className="flex-1">
        <Outlet
          context={{
            isSignedIn,
            setIsSignedIn,
            openSignIn: () => console.log("open sign in modal here"),
            userProfile,
          }}
        />
      </main>

      <Footer />

      {/* ✅ Profile Modal Controlled Here */}
      {showProfile && (
        <ProfileModal
          existingProfile={userProfile}
          saveProfile={(data) => setUserProfile(data)}
          closeModal={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
