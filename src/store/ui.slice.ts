import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UiState = {
  sidebarOpen: boolean;
  activeModal: "createTask" | "editTask" | null;
};

const initialState: UiState = {
  sidebarOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal(state, action: PayloadAction<UiState["activeModal"]>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { setSidebarOpen, toggleSidebar, openModal, closeModal } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
