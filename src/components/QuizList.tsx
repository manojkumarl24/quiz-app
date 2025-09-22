import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import QuizItem from "./QuizItem";

export default function QuizList() {
  const quizzes = useSelector((s: RootState) => s.quizzes.quizzes);

  if (!quizzes || quizzes.length === 0) {
    return <Typography>No quizzes created yet.</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      {quizzes.map((q, idx) => (
        <QuizItem key={q.id} id={q.id} title={q.title} index={idx} />
      ))}
    </Box>
  );
}
