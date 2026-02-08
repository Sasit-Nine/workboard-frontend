import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../api/api";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token") || sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [email, setEmail] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCanSubmit(
      username.length > 0 &&
        email.length > 0 &&
        password.length > 0 &&
        confirmpassword.length > 0 &&
        password === confirmpassword &&
        !isLoading
    );
  }, [canSubmit, username, email, password, confirmpassword, isLoading]);

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

  const handleSubmit = async () => {
    console.log("Submitting form with:", {
      username,
      email,
      password,
      confirmpassword,
    });
    setIsLoading(true);

    console.log("Calling signup API...");
    try {
      const response = await apiService.signup({
        displayName: username,
        email,
        password,
      });

      console.log("Signup response:", response);

      if (response.message === "User registered successfully") {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ",
          text: "คุณได้สมัครสมาชิกเรียบร้อยแล้ว",
        });
        setIsLoading(false);
        navigate("/login");
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
      });
      return;
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex flex-col items-center lg:hidden select-none">
              <div className="leading-none text-center">
                <h1 className="text-6xl font-extrabold tracking-tight">
                  <span className="bg-linear-to-r from-blue-700 via-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                    Work
                  </span>
                </h1>

                <div className="mt-3 inline-flex items-center gap-2">
                  <span className="text-6xl font-extrabold tracking-tight text-slate-900">
                    Board
                  </span>
                  <span className="h-3 w-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200/70" />
                </div>

                <div className="mt-3 mx-auto h-1.5 w-24 rounded-full bg-linear-to-r from-blue-400 via-blue-500 to-blue-400 opacity-100" />
              </div>
            </div>
            <h2 className="text-center text-3xl mt-5 font-bold text-gray-900">
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
            <div className="space-y-6">
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
                  รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
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
                {password.length < 6 && password.length > 0 && (
                <p className="mb-1 mt-2 text-red-700 text-sm font-bold">
                  อย่างน้อย 6 ตัวอักษร
                </p>
              )}
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
                  onChange={(e) => {
                    setConfirmpassword(e.target.value);
                  }}
                  autoComplete="current-password"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm ring-1 ring-gray-300 p-2 focus:ring-2 focus:ring-[#2E7CF6] outline-none"
                />
                {!(password === confirmpassword) &&
                  confirmpassword.length > 0 && (
                    <p className="mb-5 mt-2 text-red-700 text-sm font-bold">
                      รหัสผ่านไม่ตรงกัน
                    </p>
                  )}
              </div>

              <button
                onClick={() => {
                  console.log("Submitting form...");
                  handleSubmit();
                }}
                disabled={canSubmit ? false : true}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold cursor-pointer transition-all ${
                  !canSubmit ? "bg-gray-500" : "bg-[#2E7CF6] hover:bg-[#0747A6]"
                }`}
              >
                {isLoading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
