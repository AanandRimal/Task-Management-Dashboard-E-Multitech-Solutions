import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SelectedTaskState = {
  id: string | null;
};

const initialState: SelectedTaskState = {
  id: null,
};

const selectedTaskSlice = createSlice({
  name: "selectedTask",
  initialState,
  reducers: {
    selectTaskId(state, action: PayloadAction<string | null>) {
      state.id = action.payload;
    },
  },
});

export const { selectTaskId } = selectedTaskSlice.actions;
export const selectedTaskReducer = selectedTaskSlice.reducer;
