import Illustration from "../assets/illustration.png";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div>
            <main className="min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
                    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 text-white lg:w-1/2">
                        <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 sm:py-14 lg:px-28 lg:py-16 lg:min-h-[calc(100vh-4rem)]">
                            <div className="w-full max-w-md mx-auto lg:mx-0">
                                <h1 className="inline-block border-b-8 border-white/20 pb-4 mb-6 font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                                    Workboard
                                </h1>

                                <h2 className="font-bold leading-tight text-xl sm:text-2xl lg:text-3xl">
                                    บอร์ดทำงานสำหรับทีมงานยุคใหม่
                                </h2>

                                <p className="mt-3 text-white/90 leading-relaxed text-sm sm:text-base">
                                    บริหารจัดการงานได้ง่าย เพิ่มประสิทธิภาพทีม
                                    ทำงานร่วมกันได้อย่างราบรื่น
                                </p>

                                <div className="mt-6 flex justify-center lg:justify-start">
                                    <Link to="/signup" className="w-full sm:w-auto">
                                        <button className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition">
                                            เริ่มต้นใช้งานฟรี
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>


                        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/15" />
                        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute top-1/4 -left-10 h-32 w-32 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute bottom-16 -right-16 h-[220px] w-[220px] rounded-full border-[40px] border-white/30" />
                    </section>

                    <section className="bg-white lg:w-1/2">
                        <div className=" h-full flex flex-col items-center px-5 py-2 gap-2 sm:px-10 sm:py-10 sm:gap-3 lg:px-12 lg:py-6 lg:gap-1 lg:items-start ">
                            <div className="flex justify-center w-full">
                                <img src={Illustration}
                                    alt="work illustration"
                                    className=" w-full max-w-xs sm:max-w-md lg:max-w-lg" />
                            </div>
                            <div className=" w-full bg-gray-140 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-sm shadow-gray-300/50 ring-1 ring-black/5 shadow-xl ">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                    ทำงานง่ายขึ้น
                                </h3>

                                <ul className="mt-4 space-y-3 text-gray-700">
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                                            ✓
                                        </span>
                                        <span>ใช้งานง่าย</span>
                                    </li>

                                    <li className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                                            ✓
                                        </span>
                                        <span>กระดานคัมบัง</span>
                                    </li>

                                    <li className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                                            ✓
                                        </span>
                                        <span>ติดตามงานแบบเรียลไทม์</span>
                                    </li>
                                </ul>
                                <div className="w-full mt-10 mt- space-y-3 text-gray-700">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                        ทำงานเป็นทีมแบบเป็นระบบ
                                    </h3>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                                            ✓
                                        </span>
                                        <span>แบ่งงานเป็น To Do / In Progress / Done</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                                            ✓
                                        </span>
                                        <span>กำหนดผู้รับผิดชอบและวันครบกำหนด</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                                            ✓
                                        </span>
                                        <span>เห็นความคืบหน้าชัดเจนในบอร์ดเดียว</span>
                                    </li>

                                </div>

                            </div>
                        </div>
                    </section>

                </div>
            </main>
            <footer className="">
                <div className="mx-auto">
                    <div className="border-t-2 border-black-300 bg-gray">
                        <div className="px-5 py-5 text-xs sm:text-sm text-gray-500">
                            <p className="text-center">
                                © {new Date().getFullYear()}{" "}
                                <span className="font-semibold text-gray-700">Workboard</span>. All rights reserved.
                            </p>

                            <div className="mt-3 flex justify-center gap-4">
                                <a href="#" className="hover:text-gray-700 transition">Privacy</a>
                                <a href="#" className="hover:text-gray-700 transition">Terms</a>
                                <a href="#" className="hover:text-gray-700 transition">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}

