import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface QuestionData {
  id: string;
  type: "mcq" | "maq" | "fill";
  question: string;
  choices: string[];
  answer: string | string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuestionData[];
  createdAt: number;
}

interface QuizState {
  quizzes: Quiz[];
}

const initialState: QuizState = {
  quizzes: [],
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    loadQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },
    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },
    deleteQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
    },
    updateQuiz(state, action: PayloadAction<Quiz>) {
      const idx = state.quizzes.findIndex((q) => q.id === action.payload.id);
      if (idx >= 0) state.quizzes[idx] = action.payload;
    },

    editQuestion(
      state,
      action: PayloadAction<{
        quizId: string;
        questionId: string;
        updatedQuestion: QuestionData;
      }>
    ) {
      const { quizId, questionId, updatedQuestion } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        const idx = quiz.questions.findIndex((q) => q.id === questionId);
        if (idx >= 0) quiz.questions[idx] = updatedQuestion;
      }
    },

    deleteQuestion(
      state,
      action: PayloadAction<{ quizId: string; questionId: string }>
    ) {
      const { quizId, questionId } = action.payload;
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        quiz.questions = quiz.questions.filter((q) => q.id !== questionId);
      }
    },
  },
});

export const { addQuiz, deleteQuiz, updateQuiz, loadQuizzes, editQuestion, deleteQuestion } =
  quizSlice.actions;

export default quizSlice.reducer;
