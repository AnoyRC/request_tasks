import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",

  initialState: {
    project: null,
    tasks: [
      { id: "todo", title: "To Do", tasks: [], color: "red", canCreate: true },
      { id: "in-progress", title: "In Progress", tasks: [], color: "blue" },
      { id: "submitted", title: "Submitted", tasks: [], color: "orange" },
      { id: "paid", title: "Paid", tasks: [], color: "green" },
    ],
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
  },
});

export const { setProject, setTasks, editTask } = boardSlice.actions;

export default boardSlice.reducer;
