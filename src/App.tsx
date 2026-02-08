import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './context/ProtectedRoute'
import CreateBoardPage from './pages/CreateBoardPage'
import MyBoardPage from './pages/MyBoardPage'
import ScrumBoardPage from './pages/ScrumBoardPage'
import TeamManage from './pages/TeamManage'

function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/create-board" element={<CreateBoardPage />} />
              <Route path="/my-board" element={<MyBoardPage />} />
              <Route path="/board/:id" element={<ScrumBoardPage />} />
              <Route path="/team-manage/:id" element={<TeamManage />} />
            </Route>
          </Routes>
        </Router>
    </>
  )
}

export default App
