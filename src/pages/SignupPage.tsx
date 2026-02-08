import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token") || localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmPasswordChange = (e) => {
    setConfirmpassword(e.target.value);
    setPasswordError(e.target.value !== password);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmpassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      setIsLoading(false);
      return;
    }

    console.log("กำลังดำเนินการสมัครสมาชิกสำหรับ:", {
      username,
      email,
      password,
    });

    setTimeout(() => {
      alert("สมัครสมาชิกสำเร็จ!");
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-162.5">
        {/* --- ฝั่งซ้าย: Welcome Section --- */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#2E7CF6] p-16 flex-col justify-center relative overflow-hidden">
          <div className="z-10 text-white">
            <h1 className="text-4xl font-bold leading-tight">
              ยินดีต้อนรับสู่
            </h1>
            <h1 className="text-6xl font-extrabold border-b-8 border-white/20 pb-4 inline-block mb-6 leading-tight">
              Workboard
            </h1>
            <p className="text-lg opacity-80 font-light leading-relaxed max-w-sm">
              จัดการงานของคุณให้เป็นระบบและเพิ่มประสิทธิภาพการทำงานร่วมกันกับทีม
            </p>
          </div>
          {/* ตกแต่งพื้นหลัง */}
          <div className="absolute bottom-20 -right-23 w-50 h-50 bg-transparent border-36 border-white rounded-full"></div>
          <div className="absolute top-1/4 -left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-25 left-30 w-72 h-72 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              สร้างบัญชีใหม่
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 mb-8">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                to="/login"
                className="text-[#2E7CF6] hover:text-[#0747A6] font-medium"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อผู้ใช้
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ชื่อผู้ใช้"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-1 ring-gray-300 p-2 focus:ring-2 focus:ring-[#2E7CF6] outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-1 ring-gray-300 p-2 focus:ring-2 focus:ring-[#2E7CF6] outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="ป้อนรหัสผ่าน"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-1 ring-gray-300 p-2 focus:ring-2 focus:ring-[#2E7CF6] outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmpassword}
                  onChange={handleConfirmPasswordChange}
                  autoComplete="current-password"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-1 ring-gray-300 p-2 focus:ring-2 focus:ring-[#2E7CF6] outline-none"
                />
                {passwordError && (
                  <p className="mb-5 mt-2 text-red-700 text-sm font-bold">รหัสผ่านไม่ตรงกัน</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold cursor-pointer transition-all ${
                  isLoading ? "bg-gray-400" : "bg-[#2E7CF6] hover:bg-[#0747A6]"
                }`}
              >
                {isLoading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
