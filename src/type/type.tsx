export interface UserPayload {
  email: string;
  displayName: string;
  isActive: boolean;
  iat: number;
  exp: number;
}

export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface SignUpResponse {
  message: string;
}

export interface LoginResponseSuccess {
  access_token: string;
}

export interface LoginResponseFailure {
  message: string;
  error: string;
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateBoardRequest {
  name: string;
}

export interface GetOneBoardRequest {
  id: number;
  name: string;
  created_at: string;
  members: Member[];
  columns: Column[];
}

export interface CreateBoardResponse {
  id: number;
  name: string;
  created_at: string;
  members: Member[];
  columns: Column[];
}

export interface GetBoardOneResponse {
  id: number
  name: string
  created_at: string
  members: Member[]
  columns: Column[]
  tasks: Task[]
}

export interface Member {
  id: number;
  email: string;
  role: string;
  joined_at: string;
}

export interface Column {
  id: number;
  name: string;
  position: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  position: number;
  created_at: string;
  assignTo?: AssignTo
}

export interface DeleteBoardRequest {
  boardId: number;
}

export interface EditBoardRequest {
  boardId: number;
  name: string;
}

export interface CreateCollumnRequest {
  name: string;
  boardId: number;
}

export interface DeleteCollumnRequest {
  columnId: number;
}

export interface EditCollumnRequest {
  columnId: number;
  name: string;
}

export interface EditColumnPositionRequest {
  column_id: number;
  columnOrder: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  boardId: number;
  columnId: number;
  assign_to: number | null;
  create_by: number | null;
}

export interface CreateTaskResponse {
  id: number
  board: Board
  column: Column
  createdBy: CreatedBy
  title: string
  description: string
  position: number
  created_at: string
}

export interface DeleteTaskRequest {
  taskId: number;
  boardId: number;
}

export interface EditTaskPositionRequest {
  taskId: number;
  newColumnId: number;
  newPosition: number;
  boardId: number;
}

export interface EditTaskRequest {
  taskId: number;
  title: string;
  description: string;
  assign_to: number;
  boardId: number;
}

export interface EditTaskResponse {
  id: number;
  assignTo: AssignTo | null;
  title: string;
  description: string;
  position: number;
  created_at: string;
}

export interface AssignTo {
  id: number;
  email: string;
  role: string;
  joined_at: string;
}

export interface GetTaskResponse {
  id: number;
  column: Column;
  createdBy: CreatedBy;
  assignTo: AssignTo;
  title: string;
  description: string;
  position: number;
  created_at: string;
}

export interface CreatedBy {
  id: number;
  email: string;
  role: string;
  joined_at: string;
}

export interface EditCollunsPositionResponse {
  id: number;
  board: Board;
  name: string;
  position: number;
}

export interface Board {
  id: number;
  name: string;
  created_at: string;
}

export interface EditCollunsResponse {
  id: number;
  board: Board;
  name: string;
  position: number;
}

export interface EditTaskResponse {
  id: number;
  assignTo: AssignTo | null;
  title: string;
  description: string;
  position: number;
  created_at: string;
}

export interface ChangeTaskPositionResponse {
  id: number;
  column: Column;
  title: string;
  description: string;
  position: number;
  created_at: string;
}

export interface GetAllBoardsResponse {
  id: number
  board: Board
  email: string
  role: string
  joined_at: string
}

export interface Board {
  id: number
  name: string
  members: Member[]
  created_at: string
}

export interface ColumnCreateResponse {
  id: number
  board: Board
  name: string
  position: number
}

export interface EditTaskResponse {
  id: number
  assignTo: AssignTo | null
  title: string
  description: string
  position: number
  created_at: string
}

export interface DeleteTaskResponse {
  message: string;
}

export interface AddMemberRequest {
  boardId: number
  memberEmail: string
}

export interface AddMemberResponse {
  id: number
  board: Board
  email: string
  role: string
  joined_at: string
}

export interface RemoveMemberRequest {
  boardId: number
  memberEmail: string
}

export interface RemoveMemberResponse {
  message: string;
}

export interface GetMembersRequest {
  boardId: number
}

export interface GetMembersResponse {
  id: number
  email: string
  role: string
  joined_at: string
}





