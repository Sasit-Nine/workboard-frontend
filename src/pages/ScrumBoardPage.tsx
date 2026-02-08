import { useEffect, useMemo, useRef, useState } from "react";
import BoardSidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { apiService } from "../api/api";
import type { GetBoardOneResponse, Column, Task, AssignTo } from "../type/type";
import { useAuth } from "../context/AuthContext";
import {
  GripVertical,
  Pencil,
  Trash2,
  User,
  MoreHorizontal,
  Edit3,
} from "lucide-react";
import PageTransition from "./PageTransition";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Swal from "sweetalert2";

type ColumnWithTasks = Column & { tasks: Task[] };

const sortByPosition = <T extends { position: number }>(arr: T[]) =>
  [...arr].sort((a, b) => a.position - b.position);

const makeColumnId = (id: number) => `col:${id}`;
const makeTaskId = (id: number) => `task:${id}`;
const makeColumnDropId = (id: number) => `col-drop:${id}`;

const parseDndId = (id: string) => {
  const [type, raw] = id.split(":");
  return { type, id: Number(raw) };
};

const setPositionsByIndex = <T extends { position: number }>(arr: T[]) =>
  arr.map((x, idx) => ({ ...x, position: idx }));

function SortableColumn({
  column,
  children,
  onEditName,
  onDelete,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onEditName: (args: { columnId: number; name: string }) => Promise<void>;
  onDelete: (columnId: number) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: makeColumnId(column.id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const [openMenu, setOpenMenu] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ sync name when not editing
  useEffect(() => {
    if (!isEditing) setName(column.name);
  }, [column.name, isEditing]);

  // ✅ ถ้าเข้า edit ให้ปิดเมนูเสมอ
  useEffect(() => {
    if (isEditing) setOpenMenu(false);
  }, [isEditing]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // ✅ click outside close
  useEffect(() => {
    if (!openMenu) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [openMenu]);

  const cancel = () => {
    setIsEditing(false);
    setName(column.name);
  };

  const submit = async () => {
    const next = name.trim();
    if (!next || next === column.name) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onEditName({ columnId: column.id, name: next });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const askDelete = async () => {
    setOpenMenu(false);
    const res = await Swal.fire({
      icon: "warning",
      title: "ลบคอลัมน์นี้ใช่ไหม?",
      text: `คอลัมน์ "${column.name}"`,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });
    if (!res.isConfirmed) return;

    await onDelete(column.id);
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full min-w-0">
      <div
        className={[
          "bg-white border border-gray-200 rounded-2xl shadow-sm",
          isDragging ? "ring-2 ring-blue-300" : "",
        ].join(" ")}
      >
        {/* Header = handle ลาก column */}
        <div
          className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3"
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />

            {!isEditing ? (
              <>
                <p className="font-bold text-gray-900 truncate">
                  {column.name}
                </p>
                <span className="text-xs text-gray-500 shrink-0">
                  ({column.tasks.length})
                </span>
              </>
            ) : (
              <div
                className="flex items-center gap-2 min-w-0"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                    if (e.key === "Escape") cancel();
                  }}
                  className="h-9 w-full min-w-52 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="ชื่อคอลัมน์..."
                />

                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    submit();
                  }}
                  disabled={!name.trim() || saving}
                  className="h-9 px-3 rounded-xl bg-blue-600 text-white text-sm font-semibold
                    cursor-pointer hover:bg-blue-700 disabled:opacity-60
                    transition"
                >
                  {saving ? "..." : "บันทึก"}
                </button>
              </div>
            )}
          </div>

          {/* ✅ Menu: show only when NOT editing */}
          {!isEditing ? (
            <div
              ref={menuRef}
              className="relative"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className={[
                  "h-8 w-8 rounded-lg border border-gray-200 bg-white",
                  "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                  "transition flex items-center justify-center",
                  openMenu ? "ring-2 ring-blue-200 border-blue-300" : "",
                ].join(" ")}
                aria-label="Column menu"
                title="เมนู"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {openMenu ? (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(false);
                      setIsEditing(true);
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4 text-gray-500" />
                    แก้ไขชื่อคอลัมน์
                  </button>

                  <div className="h-px bg-gray-100" />

                  <button
                    type="button"
                    onClick={askDelete}
                    className="w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    ลบคอลัมน์
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            // ✅ placeholder กัน layout กระโดด
            <div className="h-8 w-8" />
          )}
        </div>

        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}

function SortableTask({
  task,
  boardMembers,
  onEdit,
  onDelete,
}: {
  task: Task;
  boardMembers: Array<{
    id: number;
    email: string;
    role: string;
    joined_at: string;
  }>;
  onEdit: (args: {
    taskId: number;
    title: string;
    description: string;
    assign_to: number;
  }) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: makeTaskId(task.id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title ?? "");
  const [editDescription, setEditDescription] = useState(
    task.description ?? ""
  );
  const [editAssignTo, setEditAssignTo] = useState<number>(
    task.assignTo?.id ?? boardMembers[0]?.id ?? 0
  );
  const [saving, setSaving] = useState(false);

  // sync เมื่อ task ถูกอัปเดตจากภายนอก (เช่น drag หรือ refresh)
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title ?? "");
      setEditDescription(task.description ?? "");
      setEditAssignTo(task.assignTo?.id ?? boardMembers[0]?.id ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id, task.title, task.description, task.assignTo?.id]);

  const assignedEmail = task.assignTo?.email ?? "";

  const avatarText = assignedEmail
    ? assignedEmail.trim().charAt(0).toUpperCase()
    : "";

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title ?? "");
    setEditDescription(task.description ?? "");
    setEditAssignTo(task.assignTo?.id ?? boardMembers[0]?.id ?? 0);
  };

  const submitEdit = async () => {
    const title = editTitle.trim();
    const description = editDescription.trim();
    if (!title) return;
    if (!editAssignTo) return;

    try {
      setSaving(true);
      await onEdit({
        taskId: task.id,
        title,
        description,
        assign_to: editAssignTo,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const res = await Swal.fire({
      icon: "warning",
      title: "ลบ Task นี้ใช่ไหม?",
      text: `#${task.id} ${task.title}`,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });
    if (!res.isConfirmed) return;
    await onDelete(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "group rounded-2xl border border-gray-200 bg-white shadow-sm",
        "hover:shadow-md transition-shadow",
        isDragging ? "ring-2 ring-blue-300" : "",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Drag handle */}
          <button
            type="button"
            className={[
              "mt-0.5 h-9 w-9 shrink-0 rounded-xl border border-gray-200 bg-white",
              "text-gray-500 hover:bg-gray-50 active:cursor-grabbing cursor-grab",
              "transition flex items-center justify-center",
            ].join(" ")}
            {...attributes}
            {...listeners}
            aria-label="Drag task"
            title="ลากเพื่อจัดลำดับ"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            {!isEditing ? (
              <>
                <p className="font-semibold text-gray-900 leading-snug line-clamp-2">
                  {task.title}
                </p>

                {task.description ? (
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-400 italic">
                    ไม่มีรายละเอียด
                  </p>
                )}

                {/* Assign row */}
                <div className="mt-3 flex items-center gap-2">
                  {/* Avatar */}
                  <div
                    className={[
                      "h-8 w-8 aspect-square shrink-0 rounded-full",
                      "flex items-center justify-center",
                      "ring-2 ring-white shadow-sm",
                      assignedEmail
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500",
                    ].join(" ")}
                    title={assignedEmail || "ยังไม่ assign"}
                  >
                    {assignedEmail ? (
                      <span className="text-sm font-extrabold">
                        {avatarText}
                      </span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-500">
                      Assigned
                    </p>
                    <p className="text-xs text-gray-700 truncate max-w-[260px]">
                      {assignedEmail || "ยังไม่ assign"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Inline edit editor */
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <label className="text-xs font-semibold text-gray-600">
                  ชื่อ Task
                </label>
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="ชื่อ Task..."
                  className={[
                    "mt-1 w-full rounded-xl border border-gray-200 bg-white",
                    "px-3 py-2 text-sm outline-none",
                    "focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
                  ].join(" ")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                />

                <label className="mt-3 block text-xs font-semibold text-gray-600">
                  รายละเอียด
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="รายละเอียดเพิ่มเติม..."
                  className={[
                    "mt-1 w-full rounded-xl border border-gray-200 bg-white",
                    "px-3 py-2 text-sm outline-none min-h-[84px] resize-none",
                    "focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
                  ].join(" ")}
                />

                <label className="mt-3 block text-xs font-semibold text-gray-600">
                  Assign ให้
                </label>
                <select
                  value={editAssignTo}
                  onChange={(e) => setEditAssignTo(Number(e.target.value))}
                  className={[
                    "mt-1 w-full rounded-xl border border-gray-200 bg-white",
                    "px-3 py-2 text-sm outline-none",
                    "focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
                  ].join(" ")}
                >
                  {boardMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.email}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={submitEdit}
                    className={[
                      "flex-1 rounded-xl cursor-pointer",
                      "bg-blue-600 text-white py-2 text-sm font-semibold",
                      "hover:bg-blue-700 transition disabled:opacity-60",
                    ].join(" ")}
                    disabled={!editTitle.trim() || !editAssignTo || saving}
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>

                  <button
                    onClick={cancelEdit}
                    className={[
                      "rounded-xl bg-white border border-gray-200",
                      "text-gray-700 px-3 py-2 text-sm font-semibold",
                      "cursor-pointer hover:bg-gray-50 transition",
                    ].join(" ")}
                    disabled={saving}
                  >
                    ยกเลิก
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  กด <b>Enter</b> เพื่อบันทึก / <b>Esc</b> เพื่อยกเลิก
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isEditing ? (
          <div className="flex items-center gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={[
                "h-9 w-9 rounded-xl border border-gray-200 bg-white cursor-pointer",
                "text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition",
                "flex items-center justify-center",
              ].join(" ")}
              title="แก้ไข"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              className={[
                "h-9 w-9 rounded-xl border border-red-200 bg-white cursor-pointer",
                "text-red-600 hover:bg-red-50 transition",
                "flex items-center justify-center",
              ].join(" ")}
              title="ลบ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">#{task.id}</span>
          <span className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
            Task
          </span>
        </div>
      </div>
    </div>
  );
}

function ColumnDropZone({ columnId }: { columnId: number }) {
  const { setNodeRef, isOver } = useSortable({
    id: makeColumnDropId(columnId),
    disabled: true,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-3 rounded-xl border-2 border-dashed p-3 text-sm transition ${
        isOver ? "border-blue-400 bg-blue-50/60" : "border-gray-200 bg-gray-50"
      }`}
    >
      <p className="text-gray-500">ลากการ์ดมาวางที่นี่</p>
    </div>
  );
}

const ScrumBoardPage = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams(); // /board/:id
  const boardId = id ?? "";

  const [board, setBoard] = useState<GetBoardOneResponse | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);

  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const updateTaskInState = (updated: {
    id: number;
    title: string;
    description: string;
    assignTo: AssignTo;
  }) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === updated.id
            ? {
                ...t,
                title: updated.title,
                description: updated.description,
                assignTo: updated.assignTo ?? null,
              }
            : t
        ),
      }))
    );
  };

  const removeTaskFromState = (taskId: number) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
  };

  const updateColumnNameInState = (columnId: number, name: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, name } : c))
    );
  };

  const handleEditColumnName = async (args: {
    columnId: number;
    name: string;
  }) => {
    await apiService.editColumn({
      columnId: args.columnId,
      name: args.name,
    });

    updateColumnNameInState(args.columnId, args.name);
  };

  const handleDeleteColumn = async (columnId: number) => {
    // ✅ ป้องกันเผลอลบคอลัมน์ที่มี task
    const col = columns.find((c) => c.id === columnId);
    if (!col) return;

    if (col.tasks.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "ลบไม่ได้",
        text: "กรุณาย้ายหรือลบ Task ในคอลัมน์นี้ก่อน",
      });
      return;
    }

    await apiService.deleteColumn({ columnId });

    setColumns((prev) =>
      setPositionsByIndex(prev.filter((c) => c.id !== columnId))
    );
  };

  const handleEditTask = async (args: {
    taskId: number;
    title: string;
    description: string;
    assign_to: number;
  }) => {
    const res = await apiService.editTask({
      taskId: args.taskId,
      title: args.title,
      description: args.description,
      assign_to: args.assign_to,
      boardId: Number(boardId),
    });

    updateTaskInState({
      id: res.id,
      title: res.title,
      description: res.description,
      assignTo: res.assignTo as AssignTo,
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    await apiService.deleteTask({
      taskId,
      boardId: Number(boardId),
    });

    removeTaskFromState(taskId);
  };

  const [activeOverlay, setActiveOverlay] = useState<
    { type: "col"; title: string } | { type: "task"; title: string } | null
  >(null);

  const buildTaskAssignMap = (
    tasks: Array<{ id: number; assignTo?: AssignTo | null }>
  ) => {
    const m = new Map<number, AssignTo | null>();
    for (const t of tasks ?? []) m.set(t.id, t.assignTo ?? null);
    return m;
  };

  useEffect(() => {
    const fetchBoard = async () => {
      const response = await apiService.getBoardOne(Number(boardId));
      setBoard(response);

      const assignMap = buildTaskAssignMap(response.tasks ?? []);

      const cols = sortByPosition(response.columns).map((c) => ({
        ...c,
        tasks: setPositionsByIndex(
          sortByPosition(
            (c.tasks ?? []).map((t) => ({
              ...t,
              assignTo: assignMap.get(t.id) ?? undefined,
            }))
          )
        ),
      }));

      setColumns(cols);
    };

    if (boardId) fetchBoard();
  }, [boardId]);

  const role =
    board?.members.find((m) => m.email === user?.email)?.role ?? "สมาชิก";

  const userNumber = board?.members.find((m) => m.email === user?.email);

  const columnIds = useMemo(
    () => columns.map((c) => makeColumnId(c.id)),
    [columns]
  );

  const findColumnIndexByTaskId = (taskId: number) =>
    columns.findIndex((c) => c.tasks.some((t) => t.id === taskId));

  const onDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);

    if (activeId.startsWith("col:")) {
      const { id: colId } = parseDndId(activeId);
      const col = columns.find((c) => c.id === colId);
      if (col) setActiveOverlay({ type: "col", title: col.name });
    }

    if (activeId.startsWith("task:")) {
      const { id: taskId } = parseDndId(activeId);
      const colIndex = findColumnIndexByTaskId(taskId);
      const task =
        colIndex >= 0
          ? columns[colIndex].tasks.find((t) => t.id === taskId)
          : null;
      if (task) setActiveOverlay({ type: "task", title: task.title });
    }
  };

  const snapshotColumns = () =>
    JSON.parse(JSON.stringify(columns)) as ColumnWithTasks[];

  const persistTaskPosition = async (args: {
    taskId: number;
    newColumnId: number;
    newPosition: number;
  }) => {
    await apiService.changeTaskPosition({
      taskId: args.taskId,
      newColumnId: args.newColumnId,
      newPosition: args.newPosition,
      boardId: Number(boardId),
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveOverlay(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // ---------- 1) Reorder Columns ----------
    if (activeId.startsWith("col:") && overId.startsWith("col:")) {
      const a = parseDndId(activeId).id;
      const b = parseDndId(overId).id;

      const oldIndex = columns.findIndex((c) => c.id === a);
      const newIndex = columns.findIndex((c) => c.id === b);
      if (oldIndex === -1 || newIndex === -1) return;

      const moved = arrayMove(columns, oldIndex, newIndex);
      const next = setPositionsByIndex(moved);

      setColumns(next);

      Promise.all(
        next.map((c) =>
          apiService.editColumnPosition({
            column_id: c.id,
            columnOrder: c.position,
          })
        )
      ).catch((err) => {
        console.error("editColumnPosition failed:", err);
        // ถ้าจะ rollback column ก็ทำได้เหมือน task (optional)
      });

      return;
    }

    // ---------- 2) Move/Reorder Tasks ----------
    if (!activeId.startsWith("task:")) return;

    const taskId = parseDndId(activeId).id;

    const fromColIndex = findColumnIndexByTaskId(taskId);
    if (fromColIndex === -1) return;

    const fromCol = columns[fromColIndex];
    const fromTaskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
    if (fromTaskIndex === -1) return;

    let toColIndex = fromColIndex;
    let toTaskIndex = fromTaskIndex;

    if (overId.startsWith("task:")) {
      const overTaskId = parseDndId(overId).id;
      toColIndex = findColumnIndexByTaskId(overTaskId);
      if (toColIndex === -1) return;

      const toCol = columns[toColIndex];
      toTaskIndex = toCol.tasks.findIndex((t) => t.id === overTaskId);
      if (toTaskIndex === -1) return;
    } else if (overId.startsWith("col-drop:")) {
      const { id: overColId } = parseDndId(overId);
      toColIndex = columns.findIndex((c) => c.id === overColId);
      if (toColIndex === -1) return;

      toTaskIndex = columns[toColIndex].tasks.length;
    } else if (overId.startsWith("col:")) {
      const { id: overColId } = parseDndId(overId);
      toColIndex = columns.findIndex((c) => c.id === overColId);
      if (toColIndex === -1) return;

      toTaskIndex = columns[toColIndex].tasks.length;
    } else {
      return;
    }

    const prev = snapshotColumns();

    // ---- same column reorder ----
    if (fromColIndex === toColIndex) {
      const newTasks = arrayMove(fromCol.tasks, fromTaskIndex, toTaskIndex);
      const nextCols = [...columns];
      nextCols[fromColIndex] = {
        ...fromCol,
        tasks: setPositionsByIndex(newTasks),
      };

      setColumns(nextCols);

      persistTaskPosition({
        taskId,
        newColumnId: fromCol.id,
        newPosition: toTaskIndex,
      }).catch(() => setColumns(prev));

      return;
    }

    // ---- move across columns ----
    const nextCols = [...columns];

    const movingTask = fromCol.tasks[fromTaskIndex];

    const fromTasks = [...fromCol.tasks];
    fromTasks.splice(fromTaskIndex, 1);

    const toCol = nextCols[toColIndex];
    const toTasks = [...toCol.tasks];
    toTasks.splice(toTaskIndex, 0, movingTask);

    nextCols[fromColIndex] = {
      ...fromCol,
      tasks: setPositionsByIndex(fromTasks),
    };
    nextCols[toColIndex] = { ...toCol, tasks: setPositionsByIndex(toTasks) };

    setColumns(nextCols);

    persistTaskPosition({
      taskId,
      newColumnId: toCol.id,
      newPosition: toTaskIndex,
    }).catch(() => setColumns(prev));
  };

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const startAddColumn = () => {
    setIsAddingColumn(true);
    setNewColumnName("");
  };

  const cancelAddColumn = () => {
    setIsAddingColumn(false);
    setNewColumnName("");
  };

  const submitAddColumn = async () => {
    const name = newColumnName.trim();
    if (!name) return;

    const nextId = -Date.now();
    const newCol: ColumnWithTasks = {
      id: nextId,
      name,
      position: columns.length,
      tasks: [],
    };

    setColumns((prev) => setPositionsByIndex([...prev, newCol]));
    cancelAddColumn();

    try {
      const response = await apiService.createColumn({
        name,
        boardId: Number(boardId),
      });
      if (response.name && response.position) {
        setColumns((prev) => {
          const withoutTemp = prev.filter((c) => c.id !== nextId);
          return setPositionsByIndex([
            ...withoutTemp,
            {
              ...response,
              tasks: [],
            },
          ]);
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "สร้างคอลัมน์ไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const [addingTaskColumnId, setAddingTaskColumnId] = useState<number | null>(
    null
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const startAddTask = (columnId: number) => {
    setAddingTaskColumnId(columnId);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const cancelAddTask = () => {
    setAddingTaskColumnId(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const submitAddTask = async (columnId: number) => {
    const title = newTaskTitle.trim();
    const description = newTaskDescription.trim();

    if (!title) return;

    try {
      const response = await apiService.createTask({
        title,
        description,
        boardId: Number(boardId),
        columnId,
        assign_to: null,
        create_by: userNumber?.id ?? null,
      });
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === columnId) {
            const newTasks = setPositionsByIndex([
              ...col.tasks,
              { ...response, position: col.tasks.length },
            ]);
            return { ...col, tasks: newTasks };
          }
          return col;
        })
      );

      cancelAddTask();
    } catch {
      Swal.fire({
        icon: "error",
        title: "เพิ่ม Task ไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          className="h-10 w-10 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          ☰
        </button>
        <p className="font-bold text-gray-900 truncate">{board?.name}</p>
        <div className="w-10" />
      </div>

      <div className="relative min-h-[calc(100vh-56px)] md:min-h-screen">
        <div className="hidden md:block">
          <BoardSidebar boardId={boardId} boardName={board?.name} role={role} />
        </div>

        <div className="md:hidden">
          <BoardSidebar
            boardId={boardId}
            boardName={board?.name}
            role={role}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>

        <PageTransition>
          <main className="p-4 sm:p-6 sm:pl-80">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {board?.name ?? "Board"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  ลากคอลัมน์และการ์ดเพื่อจัดลำดับงาน
                </p>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={columnIds}
                strategy={horizontalListSortingStrategy}
              >
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div
                    className={[
                      "gap-4",
                      columns.length <= 3 ? "grid" : "flex overflow-x-auto",
                      "pb-4 -mx-4 px-4 sm:mx-0 sm:px-0",
                      columns.length <= 3 ? "overflow-visible" : "",
                    ].join(" ")}
                    style={
                      columns.length <= 3
                        ? {
                            gridTemplateColumns: `repeat(${
                              columns.length + 1
                            }, minmax(0, 1fr))`,
                          }
                        : undefined
                    }
                  >
                    {columns.map((col) => {
                      const taskIds = col.tasks.map((t) => makeTaskId(t.id));

                      return (
                        <div
                          key={col.id}
                          className={
                            columns.length <= 3 ? "min-w-0" : "w-80 shrink-0"
                          }
                        >
                          <SortableColumn
                            column={col}
                            onEditName={handleEditColumnName}
                            onDelete={handleDeleteColumn}
                          >
                            <SortableContext
                              items={taskIds}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-3 min-h-2">
                                {col.tasks.map((task) => (
                                  <SortableTask
                                    key={task.id}
                                    task={task}
                                    boardMembers={board?.members ?? []}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                  />
                                ))}

                                {addingTaskColumnId === col.id ? (
                                  <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                    <input
                                      autoFocus
                                      value={newTaskTitle}
                                      onChange={(e) =>
                                        setNewTaskTitle(e.target.value)
                                      }
                                      placeholder="ชื่อ Task..."
                                      className="w-full rounded-lg border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          submitAddTask(col.id);
                                        if (e.key === "Escape") cancelAddTask();
                                      }}
                                    />

                                    <textarea
                                      value={newTaskDescription}
                                      onChange={(e) =>
                                        setNewTaskDescription(e.target.value)
                                      }
                                      placeholder="รายละเอียดเพิ่มเติม..."
                                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <div className="flex gap-2 mt-3">
                                      <button
                                        onClick={() => submitAddTask(col.id)}
                                        className="flex-1 rounded-lg cursor-pointer bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700"
                                        disabled={!newTaskTitle.trim()}
                                      >
                                        สร้าง Task
                                      </button>

                                      <button
                                        onClick={cancelAddTask}
                                        className="rounded-lg bg-red-600 text-white px-3 py-2 text-sm cursor-pointer hover:bg-red-700"
                                      >
                                        ยกเลิก
                                      </button>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-500">
                                      กด <b>Enter</b> เพื่อสร้าง / <b>Esc</b>{" "}
                                      เพื่อยกเลิก
                                    </p>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startAddTask(col.id)}
                                    className="mt-3 w-full flex items-center cursor-pointer justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:bg-gray-100 transition"
                                  >
                                    <span className="text-lg">＋</span>
                                    เพิ่ม Task
                                  </button>
                                )}
                              </div>

                              <ColumnDropZone columnId={col.id} />
                            </SortableContext>
                          </SortableColumn>
                        </div>
                      );
                    })}

                    <div
                      className={
                        columns.length <= 3 ? "min-w-0" : "w-80 shrink-0"
                      }
                    >
                      {!isAddingColumn ? (
                        <button
                          type="button"
                          onClick={startAddColumn}
                          className="h-full w-full min-h-35 cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition flex flex-col items-center justify-center text-gray-600"
                        >
                          <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                            <span className="text-xl">+</span>
                          </div>
                          <p className="mt-3 font-semibold">เพิ่มคอลัมน์</p>
                          <p className="text-xs text-gray-500 mt-1">
                            กดเพื่อสร้างคอลัมน์ใหม่
                          </p>
                        </button>
                      ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <p className="font-bold text-gray-900">
                              คอลัมน์ใหม่
                            </p>
                            <button
                              type="button"
                              onClick={cancelAddColumn}
                              className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-500 transition flex items-center justify-center"
                              aria-label="Cancel"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="p-4">
                            <label className="text-sm font-semibold text-gray-700">
                              ชื่อคอลัมน์
                            </label>
                            <input
                              autoFocus
                              value={newColumnName}
                              onChange={(e) => setNewColumnName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") submitAddColumn();
                                if (e.key === "Escape") cancelAddColumn();
                              }}
                              placeholder="เช่น To Do, In Progress..."
                              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                            />

                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={submitAddColumn}
                                className="flex-1 px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={!newColumnName.trim()}
                              >
                                สร้างคอลัมน์
                              </button>
                              <button
                                type="button"
                                onClick={cancelAddColumn}
                                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                              >
                                ยกเลิก
                              </button>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                              กด <span className="font-semibold">Enter</span>{" "}
                              เพื่อสร้าง /{" "}
                              <span className="font-semibold">Esc</span>{" "}
                              เพื่อยกเลิก
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SortableContext>

              <DragOverlay>
                {activeOverlay ? (
                  activeOverlay.type === "col" ? (
                    <div className="w-80 rounded-2xl bg-white border border-gray-200 shadow-xl">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <p className="font-bold">{activeOverlay.title}</p>
                      </div>
                      <div className="p-4 text-sm text-gray-500">
                        กำลังลากคอลัมน์…
                      </div>
                    </div>
                  ) : (
                    <div className="w-72 rounded-xl bg-white border border-gray-200 shadow-xl p-3">
                      <p className="font-semibold text-gray-900 line-clamp-2">
                        {activeOverlay.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        กำลังลากการ์ด…
                      </p>
                    </div>
                  )
                ) : null}
              </DragOverlay>
            </DndContext>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default ScrumBoardPage;
