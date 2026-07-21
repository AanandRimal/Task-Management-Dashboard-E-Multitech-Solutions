import type { CreateTask, Task, UpdateTask } from "@/features/tasks/task.schema";
import { baseApi } from "@/store/base-api";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({ type: "Task" as const, id: task.id })),
              { type: "Task" as const, id: "LIST" },
            ]
          : [{ type: "Task" as const, id: "LIST" }],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task" as const, id }],
    }),
    createTask: builder.mutation<Task, CreateTask>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<Task, { id: string } & UpdateTask>({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            const task = draft.find((item) => item.id === id);
            if (task) Object.assign(task, patch);
          }),
        );
        const patchDetail = dispatch(
          tasksApi.util.updateQueryData("getTask", id, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchDetail.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            const index = draft.findIndex((item) => item.id === id);
            if (index >= 0) draft.splice(index, 1);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
