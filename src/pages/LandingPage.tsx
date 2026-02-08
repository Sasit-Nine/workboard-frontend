import Illustration from "../assets/illustration.png";

export default function Home() {
    return (
        <main className="min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
                <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 text-white lg:w-1/2">
                    <div className="relative z-10 px-6 py-12 sm:px-10 lg:px-12 lg:py-16 flex items-center lg:min-h-[calc(100vh-4rem)]">
                        <div className="mx-10 max-w-md">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                Workboard
                            </h1>

                            <h2 className="mt-6 text-2xl sm:text-3xl font-bold leading-tight">
                                กระดานงานสำหรับทีมงานยุคใหม่
                            </h2>

                            <p className="mt-4 text-white/90 leading-relaxed">
                                บริหารจัดการงานได้ง่าย เพิ่มประสิทธิภาพทีม
                                ทำงานร่วมกันได้อย่างราบรื่น
                            </p>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/15" />
                    <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute top-1/4 -left-10 h-32 w-32 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute bottom-16 -right-16 h-[220px] w-[220px] rounded-full border-[28px] border-white/25" />
                </section>

                <section className="bg-white lg:w-1/2">
                    <div className="h-full px-6 py-10 sm:px-10 lg:px-5 lg:py-5 flex flex-col gap-1">
                        <div className="flex justify-center">
                            <img
                                src={Illustration}
                                alt="work illustration"
                                className="w-full max-w-xs sm:max-w-md lg:max-w-lg"
                            />
                        </div>
                        <div className="max-w-md mx-auto lg:mx-0 lg:px-12">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                ทำงานง่ายขึ้น
                            </h3>

                            <ul className="mt-1  space-y-2 text-gray-700">
                                <li className="flex gap-2">
                                    <span>✔</span>
                                    <span>ใช้งานง่าย</span>
                                </li>
                                <li className="flex gap-2">
                                    <span>✔</span>
                                    <span>กระดานคัมบัง</span>
                                </li>
                                <li className="flex gap-2">
                                    <span>✔</span>
                                    <span>ติดตามงานแบบเรียลไทม์</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

