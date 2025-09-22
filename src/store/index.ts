import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./authSlice";
import quizReducer, { type Quiz } from "./quizSlice";
import resultReducer from "./resultSlice";
import { loadQuizzes } from "./quizSlice";

const PERSIST_KEY = "quiz_app_state_v1";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    results: resultReducer,
  },
});

const raw = localStorage.getItem(PERSIST_KEY);
if (raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      store.dispatch(loadQuizzes(parsed));
    }
  } catch (e) {
     console.log(e);
  }
}

store.subscribe(() => {
  const state = store.getState();
  const quizzes: Quiz[] = state.quizzes.quizzes;
  localStorage.setItem(PERSIST_KEY, JSON.stringify(quizzes));
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
