import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",

  initialState: {
    project: null,
    tasks: [],
    batchTasks: [],
  },

  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },

    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    editTask: (state, action) => {
      state.tasks = state.tasks.map((task) => {
        if (task._id === action.payload._id) {
          return action.payload;
        } else {
          return task;
        }
      });
    },

    setBatchTasks: (state, action) => {
      state.batchTasks = action.payload;
    },

    addBatchTask: (state, action) => {
      state.batchTasks.push(action.payload);
    },

    removeBatchTask: (state, action) => {
      state.batchTasks = state.batchTasks.filter(
        (task) => task._id !== action.payload
      );
    },
  },
});

export const {
  setProject,
  setTasks,
  editTask,
  setBatchTasks,
  addBatchTask,
  removeBatchTask,
} = boardSlice.actions;

export default boardSlice.reducer;
