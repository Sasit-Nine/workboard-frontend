import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BoardSidebar from "../components/Sidebar";
import { apiService } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Trash2, RefreshCw, Users } from "lucide-react";
import type { Board } from "../type/type";
import PageTransition from "./PageTransition";

export interface AddMemberRequest {
  boardId: number;
  memberEmail: string;
}
export interface AddMemberResponse {
  id: number;
  board: Board;
  email: string;
  role: string;
  joined_at: string;
}
export interface RemoveMemberRequest {
  boardId: number;
  memberEmail: string;
}
export interface RemoveMemberResponse {
  message: string;
}
export interface GetMembersResponse {
  id: number;
  email: string;
  role: string;
  joined_at: string;
}

type Member = GetMembersResponse;

const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase());

const formatDateTime = (iso: string) => {
  // เบา ๆ: แสดงแบบอ่านง่าย (ถ้า backend ส่ง ISO)
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RoleBadge = ({ role }: { role: string }) => {
  const isOwner = role?.toUpperCase() === "OWNER";
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-extrabold",
        isOwner ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {role}
    </span>
  );
};

const BoardMembersPage = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const boardId = Number(id ?? 0);

  const { user } = useAuth();

  const [boardData, setBoardData] = useState<Board | null>(null);

  const fetchBoardData = async () => {
    try {
      const res = await apiService.getBoardOne(boardId);
      setBoardData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!boardId) return;
    fetchBoardData();
  }, [boardId]);

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const myRole = useMemo(() => {
    const me = members.find((m) => m.email === user?.email);
    return me?.role ?? "MEMBER";
  }, [members, user?.email]);

  const canManage = myRole?.toUpperCase() === "OWNER";

  const fetchMembers = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    try {
      const res = await apiService.getMember(boardId);

      const list = Array.isArray(res) ? (res as Member[]) : ([res] as Member[]);
      list.sort((a, b) => {
        const ao = a.role?.toUpperCase() === "OWNER" ? 0 : 1;
        const bo = b.role?.toUpperCase() === "OWNER" ? 0 : 1;
        if (ao !== bo) return ao - bo;
        return (a.email ?? "").localeCompare(b.email ?? "");
      });

      setMembers(list);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "โหลดสมาชิกไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!boardId) return;
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const reload = async () => {
    setReloading(true);
    await fetchMembers({ silent: true });
    setReloading(false);
  };

  const handleAddMember = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;

    if (!isEmail(email)) {
      Swal.fire({
        icon: "warning",
        title: "อีเมลไม่ถูกต้อง",
        text: "กรุณากรอกอีเมลให้ถูกต้อง",
      });
      return;
    }

    if (members.some((m) => m.email.toLowerCase() === email)) {
      Swal.fire({
        icon: "info",
        title: "มีสมาชิกนี้อยู่แล้ว",
        text: email,
      });
      return;
    }

    if (!canManage) {
      Swal.fire({
        icon: "warning",
        title: "สิทธิ์ไม่เพียงพอ",
        text: "เฉพาะ OWNER เท่านั้นที่เพิ่มสมาชิกได้",
      });
      return;
    }

    try {
      setAdding(true);

      // optimistic add (แสดงแถวชั่วคราว)
      const tempId = -Date.now();
      setMembers((prev) => [
        ...prev,
        {
          id: tempId,
          email,
          role: "MEMBER",
          joined_at: new Date().toISOString(),
        },
      ]);

      const res = await apiService.addMember({
        boardId,
        memberEmail: email,
      });

      // replace temp
      setMembers((prev) =>
        prev
          .filter((m) => m.id !== tempId)
          .concat({
            id: res.id,
            email: res.email,
            role: res.role,
            joined_at: res.joined_at,
          })
          .sort((a, b) => {
            const ao = a.role?.toUpperCase() === "OWNER" ? 0 : 1;
            const bo = b.role?.toUpperCase() === "OWNER" ? 0 : 1;
            if (ao !== bo) return ao - bo;
            return (a.email ?? "").localeCompare(b.email ?? "");
          })
      );

      setNewEmail("");
      Swal.fire({
        icon: "success",
        title: "เพิ่มสมาชิกสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      setMembers((prev) => prev.filter((m) => m.email.toLowerCase() !== email));

      Swal.fire({
        icon: "error",
        title: "ไม่พบสมาชิกที่ตรงกับอีเมลนี้",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (memberEmail: string) => {
    if (!canManage) {
      Swal.fire({
        icon: "warning",
        title: "สิทธิ์ไม่เพียงพอ",
        text: "เฉพาะ OWNER เท่านั้นที่ลบสมาชิกได้",
      });
      return;
    }

    const res = await Swal.fire({
      icon: "warning",
      title: "ลบสมาชิกคนนี้ใช่ไหม?",
      text: memberEmail,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });

    if (!res.isConfirmed) return;

    const prev = members;
    // optimistic remove
    setMembers((p) => p.filter((m) => m.email !== memberEmail));

    try {
      await apiService.removeMember({
        boardId,
        memberEmail,
      });

      Swal.fire({
        icon: "success",
        title: "ลบสมาชิกแล้ว",
        timer: 1100,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      // rollback
      setMembers(prev);

      Swal.fire({
        icon: "error",
        title: "ลบสมาชิกไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
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
        <p className="font-bold text-gray-900 truncate">จัดการสมาชิก</p>
        <div className="w-10" />
      </div>

      <div className="relative min-h-[calc(100vh-56px)] md:min-h-screen">
        <div className="hidden md:block">
          <BoardSidebar
            boardId={boardId}
            boardName={boardData?.name}
            role={myRole}
          />
        </div>

        <div className="md:hidden">
          <BoardSidebar
            boardId={boardId}
            boardName={boardData?.name}
            role={myRole}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>

        <PageTransition>
          <main className="p-4 sm:p-6 sm:pl-80">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  จัดการสมาชิก
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  เพิ่ม/ลบสมาชิกในบอร์ดนี้ (สิทธิ์:{" "}
                  <span className="font-semibold">{myRole}</span>)
                </p>
              </div>

              <button
                type="button"
                onClick={reload}
                disabled={reloading || loading}
                className={[
                  "h-10 px-4 rounded-xl border border-gray-200 bg-white",
                  "text-gray-700 font-semibold text-sm",
                  "hover:bg-gray-50 transition disabled:opacity-60",
                  "flex items-center justify-center gap-2",
                ].join(" ")}
              >
                <RefreshCw
                  className={["h-4 w-4", reloading ? "animate-spin" : ""].join(
                    " "
                  )}
                />
                รีเฟรช
              </button>
            </div>

            {/* Add member card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-700">
                    เพิ่มสมาชิกด้วย Email
                  </label>
                  <div className="flex items-center justify-between gap-3 mt-2">
                    <input
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddMember();
                        if (e.key === "Escape") setNewEmail("");
                      }}
                      placeholder="เช่น user@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddMember}
                      disabled={!newEmail.trim() || adding || !canManage}
                      className={[
                        "h-10 px-4 rounded-xl",
                        "bg-blue-600 text-white font-semibold text-sm",
                        "hover:bg-blue-700 transition disabled:opacity-50",
                        "flex items-center justify-center gap-2 mt-2",
                      ].join(" ")}
                      title={
                        !canManage ? "เฉพาะ OWNER เท่านั้น" : "เพิ่มสมาชิก"
                      }
                    >
                      <UserPlus className="h-4 w-4" />
                      {adding ? "กำลังเพิ่ม..." : "เพิ่ม"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    กด <span className="font-semibold">Enter</span> เพื่อเพิ่ม /{" "}
                    <span className="font-semibold">Esc</span> เพื่อล้างช่อง
                  </p>
                </div>
              </div>

              {!canManage ? (
                <div className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                  คุณเป็น <b>{myRole}</b> จึงไม่สามารถเพิ่ม/ลบสมาชิกได้
                  (ต้องเป็น <b>OWNER</b>)
                </div>
              ) : null}
            </div>

            {/* Members table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <p className="font-bold text-gray-900">
                    สมาชิกทั้งหมด ({members.length})
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  Board ID: {boardId}
                </span>
              </div>

              {loading ? (
                <div className="p-5 text-sm text-gray-500">
                  กำลังโหลดสมาชิก...
                </div>
              ) : members.length === 0 ? (
                <div className="p-5 text-sm text-gray-500">ยังไม่มีสมาชิก</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left font-bold px-4 py-3 w-[56px]">
                          #
                        </th>
                        <th className="text-left font-bold px-4 py-3">Email</th>
                        <th className="text-left font-bold px-4 py-3 w-[140px]">
                          Role
                        </th>
                        <th className="text-left font-bold px-4 py-3 w-[220px]">
                          Joined
                        </th>
                        <th className="text-right font-bold px-4 py-3 w-[120px]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {members.map((m, idx) => {
                        const isMe = m.email === user?.email;
                        const isOwner = m.role?.toUpperCase() === "OWNER";

                        return (
                          <tr
                            key={`${m.id}-${m.email}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-gray-500">
                              {idx + 1}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-gray-900 truncate">
                                  {m.email}
                                </span>
                                {isMe ? (
                                  <span className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                    คุณ
                                  </span>
                                ) : null}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <RoleBadge role={m.role} />
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {formatDateTime(m.joined_at)}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(m.email)}
                                  disabled={!canManage || isOwner}
                                  className={[
                                    "h-9 w-9 rounded-xl border",
                                    isOwner
                                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                      : "border-red-200 text-red-600 hover:bg-red-50",
                                    "bg-white transition flex items-center justify-center",
                                    !canManage
                                      ? "opacity-50 cursor-not-allowed"
                                      : "",
                                  ].join(" ")}
                                  title={
                                    isOwner
                                      ? "ไม่สามารถลบ OWNER ได้"
                                      : !canManage
                                      ? "เฉพาะ OWNER เท่านั้น"
                                      : "ลบสมาชิก"
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default BoardMembersPage;
