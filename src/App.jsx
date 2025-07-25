import { useOutletContext } from "react-router-dom";
import Block1 from "./components/Block1";
import Block2 from "./components/Block2";
import Block3 from "./components/Block3";

export default function App() {
  const { openSignIn, isSignedIn, userProfile } = useOutletContext();

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 h-[calc(100vh-128px)]">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 h-full">
          <div className="h-1/2">
            <Block1 isSignedIn={isSignedIn} profile={userProfile} />
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
    </div>
  );
}
