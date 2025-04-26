import { Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import Auth from "./Pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default App;
