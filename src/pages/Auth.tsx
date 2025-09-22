import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Container, TextField, Typography, Stack } from "@mui/material";
import { login } from "../store/authSlice";
import { credentials } from "../data/credentials";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const allUsers = [...credentials.teacher, ...credentials.students];
    const found = allUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      dispatch(login({ username: found.username, role: found.role }));
      navigate("/quizzes");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Quiz Portal Login
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </Container>
  );
}
