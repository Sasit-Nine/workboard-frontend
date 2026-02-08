// src/pages/BoardSettingsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BoardSidebar from "../components/Sidebar";
import { apiService } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Settings, Pencil, Trash2, Save, X } from "lucide-react";

type BoardMember = {
  id: number;
  email: string;
  role: string;
  joined_at: string;
};

type GetBoardOneResponse = {
  id: number;
  name: string;
  created_at: string;
  members: BoardMember[];
};

const BoardSettingsPage = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams(); // /boards/:id/settings
  const boardId = Number(id ?? 0);
  const navigate = useNavigate();

  const { user } = useAuth();

  const [board, setBoard] = useState<GetBoardOneResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // edit name state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // delete state
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!boardId) return;
      setLoading(true);
      try {
        // ใช้ตัวเดียวกับหน้า board ได้เลย (ของคุณมีอยู่แล้ว)
        const res = await apiService.getBoardOne(boardId);
        setBoard(res);
        setName(res.name ?? "");
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลบอร์ดไม่สำเร็จ",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  const myRole = useMemo(() => {
    const role = board?.members?.find((m) => m.email === user?.email)?.role;
    return role ?? "MEMBER";
  }, [board?.members, user?.email]);

  const canManage = myRole?.toUpperCase() === "OWNER";

  const startEdit = () => {
    if (!canManage) {
      Swal.fire({
        icon: "warning",
        title: "สิทธิ์ไม่เพียงพอ",
        text: "เฉพาะ OWNER เท่านั้นที่แก้ไข/ลบบอร์ดได้",
      });
      return;
    }
    setIsEditing(true);
    setName(board?.name ?? "");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setName(board?.name ?? "");
  };

  const submitEdit = async () => {
    const next = name.trim();
    if (!next) return;

    if (!canManage) {
      Swal.fire({
        icon: "warning",
        title: "สิทธิ์ไม่เพียงพอ",
        text: "เฉพาะ OWNER เท่านั้นที่แก้ไขบอร์ดได้",
      });
      return;
    }

    if (!board) return;
    if (next === board.name) {
      setIsEditing(false);
      return;
    }

    const res = await Swal.fire({
      icon: "question",
      title: "เปลี่ยนชื่อบอร์ด?",
      text: `จาก "${board.name}" → "${next}"`,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#2563eb",
    });

    if (!res.isConfirmed) return;

    try {
      setSaving(true);

      // optimistic
      setBoard((prev) => (prev ? { ...prev, name: next } : prev));

      await apiService.editBoard({
        boardId,
        name: next,
      });

      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "บันทึกแล้ว",
        timer: 1100,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      // rollback
      setBoard((prev) => (prev ? { ...prev, name: board.name } : prev));
      setName(board.name);

      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!canManage) {
      Swal.fire({
        icon: "warning",
        title: "สิทธิ์ไม่เพียงพอ",
        text: "เฉพาะ OWNER เท่านั้นที่ลบบอร์ดได้",
      });
      return;
    }
    if (!board) return;

    const res = await Swal.fire({
      icon: "warning",
      title: "ลบบอร์ดนี้ใช่ไหม?",
      html: `
        <div style="text-align:left">
          <div><b>บอร์ด:</b> ${board.name}</div>
          <div style="margin-top:6px;color:#6b7280">การลบจะไม่สามารถกู้คืนได้</div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "ลบบอร์ด",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });

    if (!res.isConfirmed) return;

    try {
      setDeleting(true);
      await apiService.deleteBoard({ boardId });

      Swal.fire({
        icon: "success",
        title: "ลบบอร์ดแล้ว",
        timer: 1100,
        showConfirmButton: false,
      });

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "ลบบอร์ดไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar (mobile) */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          className="h-10 w-10 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <p className="font-bold text-gray-900 truncate">ตั้งค่าบอร์ด</p>
        <div className="w-10" />
      </div>

      <div className="relative min-h-[calc(100vh-56px)] md:min-h-screen">
        <div className="hidden md:block">
          <BoardSidebar
            boardId={boardId}
            boardName={board?.name}
            role={myRole}
          />
        </div>

        <div className="md:hidden">
          <BoardSidebar
            boardId={boardId}
            boardName={board?.name}
            role={myRole}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>

        <main className="p-4 sm:p-6 sm:pl-80">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Settings className="h-6 w-6" />
                ตั้งค่าบอร์ด
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                แก้ไขชื่อบอร์ดและจัดการการลบ (สิทธิ์:{" "}
                <span className="font-semibold">{myRole}</span>)
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-sm text-gray-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : !board ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-sm text-gray-500">
              ไม่พบบอร์ดนี้
            </div>
          ) : (
            <>
              {/* Edit board name */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-500">
                      ชื่อบอร์ด
                    </p>
                    {!isEditing ? (
                      <p className="mt-1 text-xl font-extrabold text-gray-900 truncate">
                        {board.name}
                      </p>
                    ) : null}
                  </div>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={startEdit}
                      className={[
                        "h-10 px-4 rounded-xl border border-gray-200 bg-white",
                        "text-gray-700 font-semibold text-sm",
                        "hover:bg-gray-50 transition",
                        "flex items-center justify-center gap-2",
                        !canManage ? "opacity-50 cursor-not-allowed" : "",
                      ].join(" ")}
                      disabled={!canManage}
                      title={!canManage ? "เฉพาะ OWNER เท่านั้น" : "แก้ไขชื่อบอร์ด"}
                    >
                      <Pencil className="h-4 w-4" />
                      แก้ไข
                    </button>
                  ) : null}
                </div>

                {isEditing ? (
                  <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <label className="text-sm font-semibold text-gray-700">
                      ชื่อใหม่
                    </label>
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="เช่น ทีม A - Sprint 1"
                    />

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={submitEdit}
                        disabled={!name.trim() || saving}
                        className="flex-1 h-10 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={saving}
                        className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        ยกเลิก
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      กด <b>Enter</b> เพื่อบันทึก / <b>Esc</b> เพื่อยกเลิก
                    </p>
                  </div>
                ) : null}

                {!canManage ? (
                  <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                    คุณเป็น <b>{myRole}</b> จึงแก้ไข/ลบบอร์ดไม่ได้ (ต้องเป็น{" "}
                    <b>OWNER</b>)
                  </div>
                ) : null}
              </div>

              {/* Danger zone */}
              <div className="mt-4 bg-white p-4 sm:p-5 rounded-2xl border border-red-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-red-700">
                      Danger Zone
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      การลบบอร์ดจะลบข้อมูลทั้งหมดของบอร์ดนี้และไม่สามารถกู้คืนได้
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteBoard}
                    disabled={!canManage || deleting}
                    className={[
                      "h-10 px-4 rounded-xl bg-red-600 text-white font-semibold",
                      "hover:bg-red-700 transition disabled:opacity-60",
                      "flex items-center justify-center gap-2",
                    ].join(" ")}
                    title={!canManage ? "เฉพาะ OWNER เท่านั้น" : "ลบบอร์ด"}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? "กำลังลบ..." : "ลบบอร์ด"}
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  แนะนำ: ถ้าต้องการเก็บไว้ ให้เปลี่ยนชื่อหรือย้ายงานออกก่อน
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BoardSettingsPage;