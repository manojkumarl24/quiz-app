import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Container, Typography, Button } from "@mui/material";
import QuestionItem from "../components/QuestionItem";
 
export default function QuizPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = useSelector((s: RootState) => s.quizzes.quizzes.find((q) => q.id === id));

  if (!quiz) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Quiz not found</Typography>
        <Button onClick={() => navigate("/")}>Back</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, maxWidth: "800px" }}>
      <Typography variant="h4">{quiz.title}</Typography>
      {quiz.questions.map((ques: any, idx: number) => (
        <QuestionItem
          key={ques.id}
          question={ques}
          index={idx}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}

      <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
        Back
      </Button>
    </Container>
  );
}
