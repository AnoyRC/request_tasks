"use client";

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slice/counterSlice";
import modalReducer from "./slice/modalSlice";
import projectReducer from "./slice/projectSlice";
import loadingReducer from "./slice/loadingSlice";
import boardReducer from "./slice/boardSlice";

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `counter`, handled by `counterReducer`
    counter: counterReducer,
    modal: modalReducer,
    project: projectReducer,
    loading: loadingReducer,
    board: boardReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
