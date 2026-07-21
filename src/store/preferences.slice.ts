import type { TaskSort } from "@/features/tasks/task.utils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Density = "comfortable" | "compact";

export type PreferencesState = {
  density: Density;
  defaultSort: TaskSort;
};

const initialState: PreferencesState = {
  density: "comfortable",
  defaultSort: "dueDateAsc",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setDensity(state, action: PayloadAction<Density>) {
      state.density = action.payload;
    },
    setDefaultSort(state, action: PayloadAction<TaskSort>) {
      state.defaultSort = action.payload;
    },
  },
});

export const { setDensity, setDefaultSort } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
