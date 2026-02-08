import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 tracking-wider">
            Work<span className="text-blue-600">board</span>
          </p>
        </Link>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium transition"
              >
                เข้าสู่ระบบ
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                สมัครสมาชิก
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="
                    flex items-center gap-2
                    px-4 py-2
                    rounded-xl
                    border border-gray-200
                    text-gray-600 font-medium
                    shadow-sm
                    hover:bg-red-50 hover:text-red-600 hover:border-red-200
                    active:scale-95
                    transition

                    sm:px-4 sm:py-2
                    px-3 py-1.5
                    text-sm sm:text-base
                    cursor-pointer
                "
              >
                <span className="hidden sm:inline">ออกจากระบบ</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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
