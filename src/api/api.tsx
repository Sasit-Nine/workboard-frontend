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
} from "../type/type";

import { authClient, coreClient } from "./client";

export const apiService = {
  signup: (body: SignUpRequest) =>
    authClient
      .post<SignUpResponse>("/api/auth-service/signup", body)
      .then((r) => r.data),

  login: (body: LoginRequest) =>
    authClient
      .post<LoginResponseSuccess | LoginResponseFailure>("/api/auth-service/login", body)
      .then((r) => r.data),

  createBoard: (body: CreateBoardRequest) =>
    coreClient
      .post<CreateBoardResponse>("/api/boards/create-board", body)
      .then((r) => r.data),

  deleteBoard: (body: DeleteBoardRequest) =>
    coreClient.post("/api/boards/delete-board", body).then((r) => r.data),

  editBoard: (body: EditBoardRequest) =>
    coreClient.post("/api/boards/edit-board", body).then((r) => r.data),

  createColumn: (body: CreateCollumnRequest) =>
    coreClient.post("/api/columns/create-column", body).then((r) => r.data),

  deleteColumn: (body: DeleteCollumnRequest) =>
    coreClient.post("/api/columns/delete-column", body).then((r) => r.data),

  editColumn: (body: EditCollumnRequest) =>
    coreClient.post("/api/columns/edit-column", body).then((r) => r.data),

  editColumnPosition: (body: EditColumnPositionRequest) =>
    coreClient
      .post("/api/columns/edit-column-position", body)
      .then((r) => r.data),

  createTask: (body: CreateTaskRequest) =>
    coreClient.post("/api/task/create-task", body).then((r) => r.data),

  deleteTask: (body: DeleteTaskRequest) =>
    coreClient.post("/api/task/delete-task", body).then((r) => r.data),

  editTask: (body: EditTaskRequest) =>
    coreClient.post("/api/task/edit-task", body).then((r) => r.data),

  changeTaskPosition: (body: EditTaskPositionRequest) =>
    coreClient
      .post<ChangeTaskPositionResponse>("/api/task/edit-task-position", body)
      .then((r) => r.data),

  getTaskById: (taskId: number) =>
    coreClient
      .get<GetTaskResponse>(`/api/task/get-task/${taskId}`)
      .then((r) => r.data),
};
