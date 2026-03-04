import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuestionDetail from "./components/QuestionDetail";

import { Question, User } from "./types";
import { initialQuestions } from "./data/mockData";

const STORAGE_KEY = "codevirus_data";
const USER_KEY = "codevirus_user";
const THEME_KEY = "codevirus_theme";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return (savedTheme as "light" | "dark") || "dark";
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialQuestions;
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddQuestion = (newQuestion: Question) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-slate-200"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <Routes>

        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} theme={theme} />}
        />

        <Route
          path="/register"
          element={<RegisterPage onLogin={handleLogin} theme={theme} />}
        />

        <Route
          path="/"
          element={
            <Homepage
              user={user}
              theme={theme}
              questions={filteredQuestions}
              onLogout={handleLogout}
              onAddQuestion={handleAddQuestion}
              onThemeToggle={toggleTheme}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          }
        />

        <Route
          path="/question/:id"
          element={
            <QuestionDetail
              questions={questions}
              onUpdate={handleUpdateQuestion}
              currentUser={user}
              theme={theme}
            />
          }
        />

      </Routes>
    </div>
  );
};

export default App;