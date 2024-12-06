import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",

  initialState: {
    connectModal: false,
    createProjectModal: false,
    createTaskModal: false,
    updateTaskModal: false,
    deleteTaskModal: false,
    selectedTask: null,
  },

  reducers: {
    toggleConnectModal: (state) => {
      state.connectModal = !state.connectModal;
    },

    toggleCreateProjectModal: (state) => {
      state.createProjectModal = !state.createProjectModal;
    },

    toggleCreateTaskModal: (state) => {
      state.createTaskModal = !state.createTaskModal;
    },

    toggleUpdateTaskModal: (state) => {
      state.updateTaskModal = !state.updateTaskModal;
    },

    toggleDeleteTaskModal: (state) => {
      state.deleteTaskModal = !state.deleteTaskModal;
    },

    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
});

export const {
  toggleConnectModal,
  toggleCreateProjectModal,
  toggleCreateTaskModal,
  toggleUpdateTaskModal,
  toggleDeleteTaskModal,
  setSelectedTask,
} = modalSlice.actions;

export default modalSlice.reducer;
