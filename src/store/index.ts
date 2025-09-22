import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./authSlice";
import quizReducer, { type Quiz, loadQuizzes } from "./quizSlice";
import resultReducer, { type QuizResult, loadResults } from "./resultSlice";

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
    if (parsed.quizzes && Array.isArray(parsed.quizzes)) {
      store.dispatch(loadQuizzes(parsed.quizzes));
    }
    if (parsed.results && Array.isArray(parsed.results)) {
      store.dispatch(loadResults(parsed.results));
    }
  } catch (e) {
    console.error("Failed to parse state", e);
  }
}

store.subscribe(() => {
  const state = store.getState();
  const saveData = {
    quizzes: state.quizzes.quizzes,
    results: state.results.results,
  };
  localStorage.setItem(PERSIST_KEY, JSON.stringify(saveData));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
