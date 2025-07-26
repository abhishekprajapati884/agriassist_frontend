import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "./App";
import Header from "./components/Header";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Layout() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const openProfile = () => setShowProfile(true);

  return (
    <>
      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        setUser={setUser}
        openProfile={openProfile}
      />
      <Outlet context={{ isSignedIn, user, openSignIn: () => {}, openProfile, showProfile, setShowProfile }} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "/", element: <App /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
