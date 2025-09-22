import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { Container, Typography, Button, Stack, Divider } from "@mui/material";
import { useState } from "react";
import QuestionItem from "../components/QuestionItem";
import QuestionDialog from "../components/QuestionDialog";
import { addResult } from "../store/resultSlice";
import {  editQuestion, deleteQuestion } from "../store/quizSlice";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quiz = useSelector((s: RootState) =>
    s.quizzes.quizzes.find((q) => q.id === id)
  );

  const user = useSelector((s: RootState) => s.auth.user);

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const isPreviewRoute = location.pathname.includes("/preview/");
  const isTeacher = user?.role === "teacher";

  if (!quiz) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Quiz not found</Typography>
        <Button onClick={() => navigate("/quizzes")}>Back</Button>
      </Container>
    );
  }

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      const given = answers[q.id];
      if (Array.isArray(q.answer)) {
        if (
          Array.isArray(given) &&
          q.answer.length === given.length &&
          q.answer.every((ans) => given.includes(ans))
        ) {
          correct++;
        }
      } else if (q.answer === given) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    const resultAnswers = quiz.questions.map((q) => ({
      questionId: q.id,
      selected: answers[q.id] ?? (Array.isArray(q.answer) ? [] : ""),
      correct: q.answer,
    }));

    const studentId = user?.id ?? user?.username ?? "unknown";
    const studentName =  user?.username ?? "Unknown";

    dispatch(
      addResult({
        quizId: quiz.id,
        studentId,
        studentName,
        score: correct,
        total: quiz.questions.length,
        answers: resultAnswers,
      })
    );
  };

  const handleDialogSave = (q: any) => {
    if (editIndex !== null) {
      dispatch(editQuestion({ quizId: quiz.id, questionId: quiz.questions[editIndex].id, updatedQuestion: q }));
    }
    setDialogOpen(false);
    setEditIndex(null);
  };

  const handleDelete = (i: number) => {
    if (confirm("Delete this question?")) {
      dispatch(deleteQuestion({ quizId: quiz.id, questionId: quiz.questions[i].id }));
    }
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "800px" }}>
      <Stack spacing={2}>
        <Typography variant="h4">{quiz.title}</Typography>

        {!isPreviewRoute && submitted && score !== null && (
          <>
            <Typography variant="h6" color="primary">
              Your Score: {score} / {quiz.questions.length}
            </Typography>
            <Divider />
          </>
        )}

        {quiz.questions.map((ques, idx) => (
          <QuestionItem
            key={ques.id}
            question={ques}
            index={idx}
            mode={
              isPreviewRoute || isTeacher || submitted ? "preview" : "answer"
            }
            selectedAnswer={answers[ques.id]}
            onAnswer={(ans) => handleAnswer(ques.id, ans)}
            onEdit={() => {
              setEditIndex(idx);
              setDialogOpen(true);
            }}
            onDelete={() => handleDelete(idx)}
          />
        ))}

        <Stack direction="row" spacing={2}>
          <Button onClick={() => navigate("/quizzes")}>Back</Button>

          {!isPreviewRoute && !isTeacher && !submitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quiz.questions.length}
            >
              Submit
            </Button>
          )}
        </Stack>
      </Stack>

      <QuestionDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditIndex(null);
        }}
        onSave={handleDialogSave}
        initialData={editIndex !== null ? quiz.questions[editIndex] : null}
      />

    </Container>
  );
}
