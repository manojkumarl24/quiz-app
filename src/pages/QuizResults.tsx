import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Container,Typography,Button,Table,TableHead,TableRow,TableCell,TableBody,Stack,} from "@mui/material";
import { createSelector } from "@reduxjs/toolkit";

const makeSelectQuizResults = () =>
  createSelector(
    [(state: RootState) => state.results.results, (_: RootState, quizId: string | undefined) => quizId],
    (results, quizId) => results.filter((r) => r.quizId === quizId)
  );



export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const selectQuizResults = makeSelectQuizResults();
  
  const quiz = useSelector((s: RootState) =>
    s.quizzes.quizzes.find((q) => q.id === id)
  );

  const results = useSelector((s: RootState) => selectQuizResults(s, id));


  if (!quiz) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Quiz not found</Typography>
        <Button onClick={() => navigate("/quizzes")}>Back</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Results: {quiz.title}</Typography>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Stack>
      
      {results.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Score/Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((r:any, idx:number) => (
              <TableRow key={idx}>
                <TableCell>{r.studentName}</TableCell>
                <TableCell>{r.score}/{r.total} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
