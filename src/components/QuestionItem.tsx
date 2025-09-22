import { Paper,Typography,Stack,Button,Radio,Checkbox } from "@mui/material";
import type { QuestionData } from "../store/quizSlice";

interface Props {
  question: QuestionData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  mode?: "preview" | "answer"; 
  onAnswer?: (answer: string | string[]) => void;
  selectedAnswer?: string | string[];
}

export default function QuestionItem({question,index,onEdit,onDelete,mode = "preview",onAnswer,
  selectedAnswer,}: Props) {
  const isCorrect = (choice: string) => {
    if (Array.isArray(question.answer)) {
      return question.answer.includes(choice);
    }
    return question.answer === choice;
  };

  const isSelected = (choice: string) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(choice);
    }
    return selectedAnswer === choice;
  };

  const handleSelect = (choice: string) => {
    if (!onAnswer) return;
    if (question.type === "mcq") {
      onAnswer(choice);
    } else if (question.type === "maq") {
      const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      if (current.includes(choice)) {
        onAnswer(current.filter((c) => c !== choice));
      } else {
        onAnswer([...current, choice]);
      }
    }
  };

  return (
    <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
      <Stack spacing={1} flex={1}>
        <Typography variant="subtitle1" fontWeight={800} align="left">
          Q{index + 1}. {question.question}
        </Typography>

        {question.type === "fill" ? (
          mode === "answer" ? (
            <input
              type="text"
              value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
              onChange={(e) => onAnswer?.(e.target.value)}
              style={{
                border: "1px solid #ccc",
                fontSize: "1rem",
                width: "60%",
              }}
            />
          ) : (
            <Typography color="success.main">
              Answer: {question.answer}
            </Typography>
          )
        ) : (
          question.choices.map((c, idx) => (
            <Stack direction="row" alignItems="center" key={idx} pl={2}>
              {question.type === "mcq" ? (
                <Radio
                  checked={mode === "answer" ? isSelected(c) : isCorrect(c)}
                  onChange={() => handleSelect(c)}
                  disabled={mode === "preview"}
                  size="small"
                />
              ) : (
                <Checkbox
                  checked={mode === "answer" ? isSelected(c) : isCorrect(c)}
                  onChange={() => handleSelect(c)}
                  disabled={mode === "preview"}
                  size="small"
                />
              )}
              <Typography
                sx={{
                  fontWeight: (isCorrect(c) && mode=== "preview") ? 600 : 400,
                  color:
                    mode === "preview" && isCorrect(c)
                      ? "success.main"
                      : "inherit",
                }}
              >
                {c}
              </Typography>
            </Stack>
          ))
        )}
      </Stack>

      {mode === "preview" && (
        <Stack spacing={1} direction="row" justifyContent="right">
          <Button size="small" onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={onDelete}>
            Delete
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
