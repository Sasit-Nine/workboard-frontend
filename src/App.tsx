import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./context/ProtectedRoute";
import BoardMembersPage from "./pages/TeamManage";
import ScrumBoardPage from "./pages/ScrumBoardPage";
import Navbar from "./components/Navbar";
import MyBoardPage from "./pages/MyBoardPage";
import BoardSettingsPage from "./pages/BoardSetting";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path='/' element={<LandingPage />} /> */}
          <Route
            path="/login"
            element={
              <div>
                <Navbar />
                <LoginPage />
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div>
                <Navbar />
                <SignUpPage />
              </div>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <div>
                  <Navbar />
                  <MyBoardPage />
                </div>
              }
            />
            <Route
              path="/board/:id"
              element={
                <div>
                  <Navbar />
                  <ScrumBoardPage />
                </div>
              }
            />
            <Route
              path="/boards/:id/members"
              element={
                <div>
                  <Navbar />
                  <BoardMembersPage />
                </div>
              }
            />
            <Route
              path="/boards/:id/settings"
              element={
                <div>
                  <Navbar />
                  <BoardSettingsPage />
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
