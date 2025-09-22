import { Stack } from "@mui/material";
import type { QuestionData } from "../store/quizSlice";
import QuestionItem from "./QuestionItem";

interface Props {
  questions: QuestionData[];
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
}

export default function QuestionList({ questions, onEdit, onDelete }: Props) {
  return (
    <Stack spacing={2} mt={2}>
      {questions.map((q, i) => (
        <QuestionItem
          key={q.id}
          index={i}
          question={q}
          onEdit={() => onEdit(i)}
          onDelete={() => onDelete(i)}
        />
      ))}
    </Stack>
  );
}
