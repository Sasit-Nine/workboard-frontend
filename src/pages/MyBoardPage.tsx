import { useEffect, useState } from "react";
import { apiService } from "../api/api";
import type { GetAllBoardsResponse } from "../type/type";
import Swal from "sweetalert2";
import PopupCreateBoard from "../components/PopupCreateBoard";
const MyBoardPage = () => {
  const [boards, setBoards] = useState<GetAllBoardsResponse[]>([]);
  const [filterRole, setFilterRole] = useState<"ALL" | "OWNER" | "MEMBER">(
    "ALL"
  );
  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState("");
  const fetchBoards = async () => {
    try {
      const response = await apiService.getAllBoard();
      setBoards(response);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ไม่สามารถโหลดบอร์ดได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await apiService.getAllBoard();
        setBoards(response);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ไม่สามารถโหลดบอร์ดได้ กรุณาลองใหม่อีกครั้ง",
        });
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    console.log("Boards loaded:", boards);
  }, [boards]);

  const filteredBoards = boards
    .filter((b) => filterRole === "ALL" || b.role === filterRole)
    .filter((b) =>
      b.board.name.toLowerCase().includes(search.toLowerCase().trim())
    );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-linear-to-b from-blue-50/50 to-white">
      <PopupCreateBoard
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={fetchBoards}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              บอร์ดทั้งหมดของคุณ
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              จัดการบอร์ดและทำงานร่วมกับทีมได้ในที่เดียว
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search (optional) */}
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา Board..."
                className="w-full outline-none text-sm placeholder:text-gray-400"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 active:scale-95 transition"
            >
              <span className="text-lg leading-none">+</span>
              <span className="hidden sm:inline cursor-pointer">
                สร้างบอร์ดใหม่
              </span>

              <span className="sm:hidden">สร้าง</span>
            </button>
          </div>
        </div>

        {boards.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-gray-900 font-semibold text-lg">
                  คุณยังไม่มีบอร์ด
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  เริ่มต้นโดยการสร้างบอร์ดใหม่ (To Do / In Progress / Done)
                </p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                สร้างบอร์ดแรกของคุณ
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setFilterRole("ALL")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition ${
                  filterRole === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ทั้งหมด
              </button>

              <button
                onClick={() => setFilterRole("OWNER")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition ${
                  filterRole === "OWNER"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ที่เป็นเจ้าของ
              </button>

              <button
                onClick={() => setFilterRole("MEMBER")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition ${
                  filterRole === "MEMBER"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                เป็นสมาชิก
              </button>
            </div>

            {filteredBoards.length === 0 && search.length > 0 && (
              <p className="text-gray-500 mt-6">
                ไม่พบบอร์ดที่ตรงกับคำค้นหา "{search}"
              </p>
            )}

            {/* Grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredBoards
                .filter((m) => m.role === "OWNER")
                .map((board) => {
                  const members = board.board.members ?? [];
                  const showMembers = members.slice(0, 4);
                  const extra = Math.max(
                    0,
                    members.length - showMembers.length
                  );

                  return (
                    <li
                      key={board.id}
                      className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Icon */}
                          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                              />
                            </svg>
                          </div>

                          <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">
                              {board.board.name}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                              บทบาทของคุณ:{" "}
                              <span className="font-medium text-gray-700">
                                {board.role}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {showMembers.map((member, idx) => (
                            <div
                              key={`${member.email}-${idx}`}
                              className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-sm"
                              title={member.email}
                            >
                              <span className="text-blue-700 font-bold text-sm">
                                {member?.email?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          ))}
                          {extra > 0 && (
                            <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                              +{extra}
                            </div>
                          )}
                        </div>

                        <span className="text-sm text-gray-500">
                          สมาชิก {members.length} คน
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          เจ้าของ:{" "}
                          <span className="font-medium text-gray-800">
                            {board.email}
                          </span>
                        </p>

                        <button className="px-3 py-1.5 rounded-xl cursor-pointer bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition">
                          เปิดบอร์ด →
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
export default MyBoardPage;
