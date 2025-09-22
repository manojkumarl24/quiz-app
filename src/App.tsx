import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Auth";
import QuizListPage from "./pages/QuizList";
import CreateQuizPage from "./pages/CreateQuiz";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/QuizResults";

function App() {
  return (
    <>
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quizzes/create" element={<CreateQuizPage />} />
            <Route path="/quizzes/:id" element={<QuizPage />} />
            <Route path="/quizzes/preview/:id" element={<QuizPage />} />
            <Route path="/quizzes/:id/results" element={<ResultsPage />} />
          </Routes>
      </BrowserRouter>
      </div> 
    </>
  )
}

export default App
