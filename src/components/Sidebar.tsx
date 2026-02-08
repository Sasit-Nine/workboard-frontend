import { NavLink, Link } from "react-router-dom";

type BoardSidebarProps = {
  boardId: number | string;
  boardName?: string;
  role?: "OWNER" | "MEMBER" | string;
  open?: boolean;
  onClose?: () => void;
};

const itemBase =
  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition";
const itemInactive = "text-gray-600 hover:bg-blue-50 hover:text-blue-700";
const itemActive = "bg-blue-600 text-white shadow-sm";

const MenuItem = ({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${itemBase} ${isActive ? itemActive : itemInactive}`
    }
  >
    <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

const BoardSidebar = ({
  boardId,
  boardName = "Board",
  role = "MEMBER",
  open = true,
  onClose,
}: BoardSidebarProps) => {
  const SidebarContent = (
    <aside className="sm:absolute sm:top-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm">
      <div className="sm:hidden h-16 px-4 flex items-center justify-between border-b border-gray-100">

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-500 transition flex items-center justify-center"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 p-4">
          <p className="text-sm text-gray-500 font-semibold">บอร์ดปัจจุบัน</p>
          <p className="mt-1 text-base font-extrabold text-gray-700 line-clamp-1">
            {boardName}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {role}
            </span>
            <span className="text-xs text-gray-500">ID: {boardId}</span>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="space-y-2">
          <MenuItem
            to={`/board/${boardId}`}
            label="บอร์ด"
            icon={
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 7h6v14H4V7zm10-4h6v18h-6V3z"
                />
              </svg>
            }
          />

          <MenuItem
            to={`/boards/${boardId}/members`}
            label="จัดการสมาชิก"
            icon={
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 11a4 4 0 100-8 4 4 0 000 8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M23 21v-2a4 4 0 00-3-3.87"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 3.13a4 4 0 010 7.75"
                />
              </svg>
            }
          />

          <MenuItem
            to={`/boards/${boardId}/settings`}
            label="ตั้งค่าบอร์ด"
            icon={
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.4 15a7.97 7.97 0 000-6l2-1.2-2-3.4-2.3 1a8.2 8.2 0 00-5.2-3l-.4-2.5H10l-.4 2.5a8.2 8.2 0 00-5.2 3l-2.3-1-2 3.4L2.6 9a7.97 7.97 0 000 6L.6 16.2l2 3.4 2.3-1a8.2 8.2 0 005.2 3l.4 2.5h4.2l.4-2.5a8.2 8.2 0 005.2-3l2.3 1 2-3.4L19.4 15z"
                />
              </svg>
            }
          />
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-700 transition"
          >
            <span>←</span> กลับไปบอร์ดทั้งหมด
          </Link>
        </div>
      </div>

      <div className="mt-auto px-4 py-4">
      </div>
    </aside>
  );

  if (!onClose) return SidebarContent;

  return (
    <div className={`fixed inset-0 z-50 md:static ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/30 md:hidden transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 h-full md:static transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {SidebarContent}
      </div>
    </div>
  );
};

export default BoardSidebar;