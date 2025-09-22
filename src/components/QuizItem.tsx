import { Card, CardContent, Typography, IconButton, Stack, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store";
import { deleteQuiz } from "../store/quizSlice";
import type { RootState } from "../store";
import { useSelector } from "react-redux";


interface Props {
  id: string;
  title: string;
  index: number;
}

const makeSelectHasAttempted = () =>
  createSelector(
    [
      (state: RootState) => state.results.results,
      (state: RootState) => state.auth.user,
      (_: RootState, quizId: string) => quizId,
    ],
    (results, user, quizId) => {
      if (!user) return false;
      return results.some(
        (r) => r.quizId === quizId && r.studentName === (user.name ?? user.username)
      );
    }
  );


export default function QuizItem({ id, title, index }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useSelector((s: RootState) => s.auth.user);
  const isTeacher = user?.role === "teacher"
  
  const selectHasAttempted = makeSelectHasAttempted();
  const hasAttempted = useSelector((state: RootState) =>
    selectHasAttempted(state, id)
  );
  
  return (
    <Card sx={{ mb: 1,  maxWidth: "500px"}}>
      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">{title}</Typography>

        <Stack direction="row" spacing={1}>
          { isTeacher && <>
            <IconButton
              color="primary"
              onClick={() => navigate(`/quizzes/preview/${id}`)}
              aria-label="preview"
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => {
                if (confirm("Delete this quiz?")) dispatch(deleteQuiz(id));
              }}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>

            <Button variant="outlined" onClick={() => navigate(`/quizzes/${id}/results`)}>
              View Results
            </Button>
          
          </>}

          {!isTeacher && (
            <>
              {hasAttempted ? (
                <Button variant="outlined" disabled>
                  Attempted
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/quizzes/${id}`)}
                >
                  Attend
                </Button>
              )}
            </>
          )}
          
        </Stack>
      </CardContent>
    </Card>
  );
}
