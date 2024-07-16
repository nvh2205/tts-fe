import { Routes, Route } from "react-router-dom";
import { SignIn } from "@/pages/auth";
export function Auth() {
  return (
    <div className="absolute min-h-screen w-full flex items-center justify-center">
      <Routes>
        <Route exact path={"/sign-in"} element={<SignIn />} />
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
