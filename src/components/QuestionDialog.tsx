import { useState, useEffect } from "react";
import {Dialog,DialogTitle, DialogContent,DialogActions, Button,TextField,MenuItem,Stack,Typography,
  RadioGroup,FormControlLabel,Radio,Checkbox,IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { QuestionData } from "../store/quizSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (q: QuestionData) => void;
  initialData: QuestionData | null;
}

export default function QuestionDialog({open,onClose,onSave,initialData,}: Props) {
  const [type, setType] = useState<QuestionData["type"]>("mcq");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>([""]);
  const [answer, setAnswer] = useState<string | string[]>("");

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setQuestion(initialData.question);
      setChoices(initialData.choices);
      setAnswer(initialData.answer);
    } else {
      setType("mcq");
      setQuestion("");
      setChoices([""]);
      setAnswer(type === "maq" ? [] : "");
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({
      id: initialData?.id || Date.now().toString(),
      type,question, choices,answer,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? "Edit Question" : "Add Question"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as QuestionData["type"])}
          >
            <MenuItem value="mcq">MCQ</MenuItem>
            <MenuItem value="maq">MAQ</MenuItem>
            <MenuItem value="fill">Fill in the Blank</MenuItem>
          </TextField>

          <TextField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
          />

          {type !== "fill" && (
  <>
    <Typography variant="subtitle2">Choices</Typography>
    {choices.map((c, i) => (
      <Stack key={i} direction="row" alignItems="center" spacing={1}>
        <TextField
          label={`Choice ${i + 1}`}
          value={c}
          onChange={(e) => {
            const copy = [...choices];
            copy[i] = e.target.value;
            setChoices(copy);
          }}
          fullWidth
        />
        <IconButton
          size="small"
          onClick={() => {
            const newChoices = choices.filter((_, idx) => idx !== i);
            setChoices(newChoices);

            if (type === "mcq" && answer === c) {
              setAnswer("");
            }
            if (type === "maq" && Array.isArray(answer)) {
              setAnswer(answer.filter((a) => a !== c));
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    ))}

    <Button onClick={() => setChoices([...choices, ""])} size="small">
      Add Choice
    </Button>

    {type === "mcq" ? (
        <RadioGroup
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => setAnswer(e.target.value)}
        >
          {choices.map((c, idx) => (
            <FormControlLabel
              key={idx}
              value={c}
              control={<Radio />}
              label={c}
            />
          ))}
        </RadioGroup>
        ) : (
          choices.map((c, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  checked={Array.isArray(answer) && answer.includes(c)}
                  onChange={(e) => {
                    const current = Array.isArray(answer) ? [...answer] : [];
                    if (e.target.checked) {
                      setAnswer([...current, c]);
                    } else {
                      setAnswer(current.filter((a) => a !== c));
                    }
                  }}
                />
              }
              label={c}
            />
          ))
        )}
      </>
    )}

          {type === "fill" && (
            <TextField
              label="Answer"
              value={answer as string}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
