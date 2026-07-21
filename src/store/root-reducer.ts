import { authReducer } from "@/features/auth/auth.slice";
import { filtersReducer } from "@/features/tasks/filters.slice";
import { selectedTaskReducer } from "@/features/tasks/selected-task.slice";
import { baseApi } from "@/store/base-api";
import { preferencesReducer } from "@/store/preferences.slice";
import { uiReducer } from "@/store/ui.slice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  auth: authReducer,
  filters: filtersReducer,
  preferences: preferencesReducer,
  ui: uiReducer,
  selectedTask: selectedTaskReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
