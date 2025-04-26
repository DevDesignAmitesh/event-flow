import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContextHook } from "../context/Context";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { setUsername, setRole } = useContextHook();
  const [loading, setLoading] = useState(true); // for smooth loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/auth/isAuth`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.isAuthenticated) {
          // ✅ Authentication successful
          // You can get username from decoded token data
          setUsername(data.data.email); // assuming your token has "username" field
          setRole(data.data.role); // assuming your token has "username" field
        } else {
          // ❌ Not authenticated
          navigate("/auth");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, setUsername]);

  if (loading) {
    return <div>Loading...</div>; // or show a spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
