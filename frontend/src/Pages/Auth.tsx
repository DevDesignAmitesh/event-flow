import { useState } from "react";
import InputBox from "../components/InputBox";
import { signin, signup } from "../hooks";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [auth, setAuth] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee"); // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const response =
        auth === "signin"
          ? await signin(email, password)
          : await signup(email, password, role);

      if ((response as any)?.error) {
        setError((response as any).error);
      } else {
        console.log(response); // ✅ You can redirect or update state here
        console.log(response.user.email); // ✅ You can redirect or update state here
        alert(response.message); // temp success feedback
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="h-auto p-5 rounded-md shadow-md w-[400px] flex flex-col justify-center items-center">
        <div className="flex flex-col w-full justify-center items-center gap-1">
          <h1 className="text-2xl font-semibold">Event Flow</h1>
          <p>
            {auth === "signin"
              ? "Sign in to your account"
              : "Create your account"}
          </p>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-4 mt-8">
          <InputBox
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputBox
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {auth === "signup" && (
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <p>Role</p>
              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                className="w-full p-2 border border-neutral-400 outline-none rounded-md"
              >
                <option value="attendee">Attendee</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full p-3 rounded-md bg-blue-700 text-white mt-5 hover:opacity-80 cursor-pointer"
        >
          {loading
            ? "Please wait..."
            : auth === "signin"
            ? "Sign In"
            : "Sign Up"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {auth === "signup" ? (
          <p
            onClick={() => setAuth("signin")}
            className="mt-2 cursor-pointer hover:underline"
          >
            Already have an account?{" "}
            <span className="text-blue-800">Sign in now</span>
          </p>
        ) : (
          <p
            onClick={() => setAuth("signup")}
            className="mt-2 cursor-pointer hover:underline"
          >
            Don't have an account?{" "}
            <span className="text-blue-800">Sign up now</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
