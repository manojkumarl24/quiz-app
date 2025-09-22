import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface QuizResult {
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  total: number;
  answers: {
    questionId: string;
    selected: string | string[];
    correct: string | string[];
  }[];
}

interface ResultState {
  results: QuizResult[];
}

const initialState: ResultState = {
  results: [],
};

const resultSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    addResult: (state, action: PayloadAction<QuizResult>) => {
      const existing = state.results.find(
        r => r.quizId === action.payload.quizId && r.studentId === action.payload.studentId
      );
      if (!existing) {
        state.results.push(action.payload);
      } else {
        Object.assign(existing, action.payload);
      }
    },

    clearResults: (state) => {
      state.results = [];
    },
    loadResults: (state, action: PayloadAction<QuizResult[]>) => {
      state.results = action.payload;
    },
  },
});

export const { addResult, clearResults, loadResults } = resultSlice.actions;

export default resultSlice.reducer;
