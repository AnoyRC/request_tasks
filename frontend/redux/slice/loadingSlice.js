import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",

  initialState: {
    loading: false,
    taskLoading: false,
    currentTask: "",
  },

  reducers: {
    setloading: (state, action) => {
      state.loading = action.payload;
    },

    setTaskLoading: (state, action) => {
      state.taskLoading = action.payload;
    },

    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
});

export const {
  setloading,
  setTaskLoading,
  setCurrentTask,
} = loadingSlice.actions;

export default loadingSlice.reducer;
