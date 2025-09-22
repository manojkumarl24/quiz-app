import  { useState } from "react";
import { Container, Button, TextField, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "../store";
import { addQuiz } from "../store/quizSlice";
import QuestionDialog from "../components/QuestionDialog"; 
import QuestionList from "../components/QuestionList"; 

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDialogSave = (q: any) => {
    if (editIndex !== null) {
      const copy = [...questions];
      copy[editIndex] = q;
      setQuestions(copy);
    } else {
      setQuestions([...questions, q]);
    }
    setDialogOpen(false);
    setEditIndex(null);
  };

  const handleSaveQuiz = () => {
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }
    const quiz = {
      id: uuidv4(),
      title: title.trim(),
      questions,
      createdAt: Date.now(),
    };
    dispatch(addQuiz(quiz));
    navigate("/quizzes");
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "800px" }}>
      <TextField
        label="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <QuestionList
        questions={questions}
        onEdit={(i: number) => {
          setEditIndex(i);
          setDialogOpen(true);
        }}
        onDelete={(i: number) => setQuestions(questions.filter((_, idx) => idx !== i))}
      />

      <Stack direction="row" spacing={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => {
            setEditIndex(null);
            setDialogOpen(true);
          }}
        >
          Add Question
        </Button>

        <Button variant="outlined" onClick={() => navigate("/quizzes")}>
          Cancel
        </Button>

        <Button variant="contained" color="success" onClick={handleSaveQuiz} disabled={questions.length === 0}>
          Save Quiz
        </Button>
      </Stack>

      <QuestionDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditIndex(null);
        }}
        onSave={handleDialogSave}
        initialData={editIndex !== null ? questions[editIndex] : null}
      />
    </Container>
  );
}
