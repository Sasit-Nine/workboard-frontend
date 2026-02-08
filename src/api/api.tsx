import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponseSuccess,
  LoginResponseFailure,
  CreateBoardRequest,
  CreateBoardResponse,
  DeleteBoardRequest,
  EditBoardRequest,
  CreateCollumnRequest,
  DeleteCollumnRequest,
  EditCollumnRequest,
  EditColumnPositionRequest,
  CreateTaskRequest,
  DeleteTaskRequest,
  EditTaskRequest,
  EditTaskPositionRequest,
  GetTaskResponse,
  ChangeTaskPositionResponse,
  GetAllBoardsResponse,
  GetBoardOneResponse,
  ColumnCreateResponse,
  CreateTaskResponse,
  EditTaskResponse,
  DeleteTaskResponse,
  GetMembersResponse,
  AddMemberRequest,
  AddMemberResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
} from "../type/type";

import { authClient, coreClient } from "./client";

export const apiService = {
  signup: (body: SignUpRequest) =>
    authClient
      .post<SignUpResponse>("/api/auth-service/signup", body)
      .then((r) => r.data),

  login: (body: LoginRequest) =>
    authClient
      .post<LoginResponseSuccess | LoginResponseFailure>(
        "/api/auth-service/login",
        body
      )
      .then((r) => r.data),

  createBoard: (body: CreateBoardRequest) =>
    coreClient
      .post<CreateBoardResponse>("/api/core-service/boards/create-board", body)
      .then((r) => r.data),

  deleteBoard: (body: DeleteBoardRequest) =>
    coreClient.post("/api/core-service/boards/delete-board", body).then((r) => r.data),

  editBoard: (body: EditBoardRequest) =>
    coreClient.post("/api/core-service/boards/edit-board", body).then((r) => r.data),

  createColumn: (body: CreateCollumnRequest) =>
    coreClient
      .post<ColumnCreateResponse>("/api/core-service/columns/create-column", body)
      .then((r) => r.data),

  deleteColumn: (body: DeleteCollumnRequest) =>
    coreClient.post("/api/core-service/columns/delete-column", body).then((r) => r.data),

  editColumn: (body: EditCollumnRequest) =>
    coreClient.post("/api/core-service/columns/edit-column", body).then((r) => r.data),

  editColumnPosition: (body: EditColumnPositionRequest) =>
    coreClient
      .post("/api/core-service/columns/edit-column-position", body)
      .then((r) => r.data),

  createTask: (body: CreateTaskRequest) =>
    coreClient
      .post<CreateTaskResponse>("/api/core-service/task/create-task", body)
      .then((r) => r.data),

  deleteTask: (body: DeleteTaskRequest) =>
    coreClient
      .post<DeleteTaskResponse>("/api/core-service/task/delete-task", body)
      .then((r) => r.data),

  editTask: (body: EditTaskRequest) =>
    coreClient
      .post<EditTaskResponse>("/api/core-service/task/edit-task", body)
      .then((r) => r.data),

  changeTaskPosition: (body: EditTaskPositionRequest) =>
    coreClient
      .post<ChangeTaskPositionResponse>("/api/core-service/task/edit-task-position", body)
      .then((r) => r.data),

  getTaskById: (taskId: number) =>
    coreClient
      .get<GetTaskResponse>(`/api/core-service/task/get-task/${taskId}`)
      .then((r) => r.data),

  getAllBoard: () =>
    coreClient
      .get<GetAllBoardsResponse[]>(`/api/core-service/boards/get-all-boards`)
      .then((r) => r.data),

  getBoardOne: (boardId: number) =>
    coreClient
      .get<GetBoardOneResponse>(`/api/core-service/boards/get-board/${boardId}`)
      .then((r) => r.data),

  getMember: (boardId: number) =>
    coreClient
      .get<GetMembersResponse>(`/api/core-service/boards/get-board-members/${boardId}`)
      .then((r) => r.data),

  addMember: (data: AddMemberRequest) => 
    coreClient
      .post<AddMemberResponse>(`/api/core-service/boards/add-board-member`, data)
      .then((r) => r.data),

  removeMember: (data: RemoveMemberRequest) =>
    coreClient
      .post<RemoveMemberResponse>(`/api/core-service/boards/remove-board-member`, data)
      .then((r) => r.data),
};
