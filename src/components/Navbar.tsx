import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
<nav className="sticky top-0 z-50 w-full h-14 sm:h-16 bg-white border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">

        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-base sm:text-lg">W</span>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-wide">
            <span className="hidden sm:inline">Work</span>
            <span className="text-blue-600">board</span>
          </p>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hidden sm:inline text-gray-600 hover:text-blue-600 font-medium transition">
                เข้าสู่ระบบ
              </Link>

              <Link to="/signup" className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-semibold shadow hover:bg-blue-700 transition">
                สมัครสมาชิก
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="
                  flex items-center gap-1 sm:gap-2
                  px-3 py-1.5 sm:px-4 sm:py-2
                  rounded-xl
                  border border-gray-200
                  text-gray-600 text-sm sm:text-base font-medium
                  shadow-sm
                  hover:bg-red-50 hover:text-red-600 hover:border-red-200
                  active:scale-95
                  transition
                "
              >
                <span className="hidden sm:inline">ออกจากระบบ</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
