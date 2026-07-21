export const ROUTES = {
  login: "/login",
  dashboard: "/",
  tasks: "/tasks",
  taskDetail: (id: string) => `/tasks/${id}`,
} as const;

export const API_TAG_TYPES = ["Task"] as const;
