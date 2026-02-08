import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiService } from "../api/api";
import type { CreateBoardRequest } from "../type/type";

type PopupCreateBoardProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const PopupCreateBoard = ({ open, onClose, onCreated }: PopupCreateBoardProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (open) setName("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Swal.fire({
        icon: "warning",
        title: "กรอกชื่อบอร์ดก่อน",
        text: "โปรดระบุชื่อบอร์ด เช่น Workboard Sprint 1",
      });
      return;
    }

    setIsLoading(true);
    try {
      const body: CreateBoardRequest = { name: trimmed };
      await apiService.createBoard(body);

      Swal.fire({
        icon: "success",
        title: "สร้างบอร์ดสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
      });

      onClose();
      onCreated?.();
    } catch  {
      Swal.fire({
        icon: "error",
        title: "สร้างบอร์ดไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-lg font-extrabold text-gray-900">สร้างบอร์ดใหม่</p>
              <p className="text-sm text-gray-500 mt-0.5">
                ตั้งชื่อบอร์ดเพื่อเริ่มทำงานกับทีม
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-500 transition flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* body */}
          <div className="px-5 py-5">
            <label className="text-sm font-semibold text-gray-700">
              ชื่อบอร์ด <span className="text-red-500">*</span>
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น Workboard - Sprint 1"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
              disabled={isLoading}
              autoFocus
            />

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold">
                i
              </span>
              <p>
                หลังสร้างแล้ว คุณสามารถเพิ่ม Column และเชิญสมาชิกเข้าบอร์ดได้
              </p>
            </div>
          </div>

          {/* footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              ยกเลิก
            </button>

            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "กำลังสร้าง..." : "สร้างบอร์ด"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupCreateBoard;