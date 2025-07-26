import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { toast } from "react-toastify";

export default function Header({ isSignedIn, setIsSignedIn, setUser, openProfile }) {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsSignedIn(true);
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.info("Logged out successfully!");
    setShowDropdown(false);
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6">
          <div className="flex items-center space-x-4 cursor-pointer">
            <img src="/logo.png" alt="AgriAssist Logo" className="w-20 h-20 object-contain" />
            <h1 className="text-3xl font-bold text-gray-800">AgriAssist</h1>
          </div>

          <div className="flex items-center space-x-6 relative">
            {!isSignedIn ? (
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setShowModal(true);
                }}
                className="bg-green-700 text-white px-5 py-2 rounded-md font-medium hover:bg-green-800 transition"
              >
                Sign In
              </button>
            ) : (
              <div className="relative">
                <FaUserCircle
                  className="text-4xl text-green-700 cursor-pointer hover:text-green-800"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50">
                    <button
                      onClick={() => {
                        openProfile();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-base text-gray-700 font-medium">Language:</span>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <button
              onClick={handleGoogleSignIn}
              className="mt-3 w-full border p-2 rounded hover:bg-gray-100"
            >
              Sign in with Google
            </button>
            <p className="text-sm text-center mt-3">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-green-600 font-medium hover:underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="text-green-600 font-medium hover:underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
