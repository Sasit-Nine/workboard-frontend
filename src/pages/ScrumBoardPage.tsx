import { useEffect, useMemo, useState } from "react";
import BoardSidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { apiService } from "../api/api";
import type { GetBoardOneResponse, Column, Task } from "../type/type";
import { useAuth } from "../context/AuthContext";

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
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
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

  return (
    <div ref={setNodeRef} style={style} className="w-full min-w-0">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header = handle ลาก column */}
        <div
          className="px-4 py-3 border-b border-gray-100 flex items-center justify-between cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <p className="font-bold text-gray-900">{column.name}</p>
            <span className="text-xs text-gray-500">
              ({column.tasks.length})
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-700 transition">
            ⋯
          </button>
        </div>

        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}

function SortableTask({ task }: { task: Task }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <p className="font-semibold text-gray-900 line-clamp-2">{task.title}</p>
      {task.description ? (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">#{task.id}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
          Task
        </span>
      </div>
    </div>
  );
}

function ColumnDropZone({ columnId }: { columnId: number }) {
  // ใช้ sortable เพื่อให้เป็น droppable id ที่ dnd-kit “รู้จัก”
  const { setNodeRef, isOver } = useSortable({
    id: makeColumnDropId(columnId),
    disabled: true, // ไม่ต้องลาก zone นี้ แค่รับ drop
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

  const [activeOverlay, setActiveOverlay] = useState<
    { type: "col"; title: string } | { type: "task"; title: string } | null
  >(null);

  useEffect(() => {
    const fetchBoard = async () => {
      const response = await apiService.getBoardOne(Number(boardId));
      setBoard(response);

      const cols = sortByPosition(response.columns).map((c) => ({
        ...c,
        tasks: setPositionsByIndex(sortByPosition(c.tasks ?? [])),
      }));

      setColumns(cols);
    };

    if (boardId) fetchBoard();
  }, [boardId]);

  const role =
    board?.members.find((m) => m.email === user?.email)?.role ?? "สมาชิก";

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
                    columns.length <= 4 ? "grid" : "flex overflow-x-auto",
                    "pb-4 -mx-4 px-4 sm:mx-0 sm:px-0",
                    columns.length <= 4 ? "overflow-visible" : "",
                  ].join(" ")}
                  style={
                    columns.length <= 4
                      ? {
                          gridTemplateColumns: `repeat(${
                            columns.length + 1
                          }, minmax(0, 1fr))`,
                        } // +1 เผื่อช่องเพิ่มคอลัมน์
                      : undefined
                  }
                >
                  {columns.map((col) => {
                    const taskIds = col.tasks.map((t) => makeTaskId(t.id));

                    return (
                      <div
                        key={col.id}
                        className={
                          columns.length <= 4 ? "min-w-0" : "w-80 shrink-0"
                        }
                      >
                        <SortableColumn column={col}>
                          <SortableContext
                            items={taskIds}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-3 min-h-2">
                              {col.tasks.map((task) => (
                                <SortableTask key={task.id} task={task} />
                              ))}
                            </div>

                            <ColumnDropZone columnId={col.id} />
                          </SortableContext>
                        </SortableColumn>
                      </div>
                    );
                  })}

                  {/* ------- Add Column Slot ------- */}
                  <div
                    className={
                      columns.length <= 4 ? "min-w-0" : "w-80 shrink-0"
                    }
                  >
                    {!isAddingColumn ? (
                      <button
                        type="button"
                        onClick={startAddColumn}
                        className="h-full w-full min-h-35 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition flex flex-col items-center justify-center text-gray-600"
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
                          <p className="font-bold text-gray-900">คอลัมน์ใหม่</p>
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
                    <p className="text-sm text-gray-500 mt-1">กำลังลากการ์ด…</p>
                  </div>
                )
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
};

export default ScrumBoardPage;
