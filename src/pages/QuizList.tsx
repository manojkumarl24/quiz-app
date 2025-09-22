import { Container, Button, Typography } from "@mui/material";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import QuizList from "../components/QuizList";

export default function QuizListPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  
  const isTeacher = user?.role === "teacher" ? true: false;

  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4, maxWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom>
        My Quizzes
      </Typography>
      
      { isTeacher && <>
        <Button variant="contained" onClick={() => navigate("/quizzes/create")}>
          Create Quiz
        </Button>
      </>}
      

      <QuizList />
    </Container>
  );
}
