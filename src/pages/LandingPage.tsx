import Illustration from "../assets/illustration.png";
import { Link } from "react-router-dom";
import PageTransition from "./PageTransition";

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm shadow-sm">
      ✓
    </span>
    <span className="text-gray-700 leading-relaxed">{children}</span>
  </li>
);

const FeatureCard = ({
  title,
  items,
}: {
  title: string;
  items: React.ReactNode[];
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">{title}</h3>
    <ul className="mt-4 space-y-3">
      {items.map((x, i) => (
        <CheckItem key={i}>{x}</CheckItem>
      ))}
    </ul>
  </div>
);

export default function LandingPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-gray-50">
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          {/* LEFT: HERO */}
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 text-white lg:w-1/2">
            {/* subtle grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 sm:py-14 lg:px-20 lg:py-16 lg:min-h-[calc(100vh-4rem)]">
              <div className="w-full max-w-xl mx-auto lg:mx-0">
                {/* badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white/90 ring-1 ring-white/20">
                  <span className="h-2 w-2 rounded-full bg-white/70" />
                  Kanban • Realtime • Team-ready
                </div>

                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                  Workboard
                </h1>

                <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed max-w-lg">
                  บอร์ดทำงานสำหรับทีมยุคใหม่ จัดระเบียบงาน ติดตามความคืบหน้า
                  และทำงานร่วมกันได้ลื่นไหลในที่เดียว
                </p>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-700 font-extrabold shadow-sm hover:bg-blue-50 transition focus:outline-none focus:ring-4 focus:ring-white/30">
                      เริ่มต้นใช้งานฟรี
                    </button>
                  </Link>

                  <Link to="/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-white font-bold ring-1 ring-white/25 hover:bg-white/15 transition focus:outline-none focus:ring-4 focus:ring-white/20">
                      เข้าสู่ระบบ
                    </button>
                  </Link>
                </div>

                {/* trust line */}
                <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
                  {[
                    { k: "ลากวาง", v: "จัดลำดับงาน" },
                    { k: "สมาชิก", v: "ทำงานร่วมกัน" },
                    { k: "เรียลไทม์", v: "อัปเดตทันที" },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-3"
                    >
                      <div className="text-sm font-extrabold">{x.k}</div>
                      <div className="text-xs text-white/80 mt-1">{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* decorations */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/15 blur-sm" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-sm" />
            <div className="pointer-events-none absolute bottom-16 -right-16 h-[220px] w-[220px] rounded-full border-[40px] border-white/25" />
          </section>

          {/* RIGHT: CONTENT */}
          <section className="bg-gray-50 lg:w-1/2">
            <div className="h-full flex flex-col items-center lg:items-start px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
              {/* Illustration card */}
              <div className="w-full">
                <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                  <img
                    src={Illustration}
                    alt="work illustration"
                    className="w-full max-w-md lg:max-w-xl mx-auto"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  title="ทำงานง่ายขึ้น"
                  items={[
                    <>ใช้งานง่าย ไม่ต้องเรียนรู้นาน</>,
                    <>กระดานคัมบัง (Kanban) จัดงานเป็นขั้นตอน</>,
                    <>ลากวางเพื่อจัดลำดับงานได้ทันที</>,
                  ]}
                />

                <FeatureCard
                  title="ทำงานเป็นทีมแบบเป็นระบบ"
                  items={[
                    <>แบ่งงานเป็น To Do / In Progress / Done</>,
                    <>กำหนดผู้รับผิดชอบและติดตามสถานะได้</>,
                    <>เห็นความคืบหน้าชัดเจนในบอร์ดเดียว</>,
                  ]}
                />
              </div>

              {/* Secondary CTA */}
              <div className="mt-6 w-full rounded-2xl border border-blue-100 bg-white p-5 sm:p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-600">
                  พร้อมเริ่มจัดระเบียบงานแล้วหรือยัง?
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-200">
                      สร้างบัญชีฟรี
                    </button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 transition focus:outline-none focus:ring-4 focus:ring-gray-200">
                      ฉันมีบัญชีแล้ว
                    </button>
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                * เวอร์ชันนี้เน้น UI เรียบ โปร และเข้ากับธีมเดิมของ Workboard
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-gray-700">Workboard</span>.
              All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}
