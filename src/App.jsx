import React, { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admindashboard";
import Instruksi from "./pages/instruksi";
import SiswaForm from "./pages/SiswaForm";
import Ujian from "./pages/Ujian";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500 text-xl font-bold">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      courseId: "MAT101",
      question: "Apa hasil dari 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
    },
    {
      id: 2,
      courseId: "FIS101",
      question: "Apa hukum Newton yang pertama?",
      options: [
        "Hukum Inersia",
        "Hukum Aksi-Reaksi",
        "Hukum Gravitasi",
        "Hukum Termodinamika",
      ],
      answer: "Hukum Inersia",
    },
  ]);

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/siswa" element={<SiswaForm />} />
            <Route path="/instruksi" element={<Instruksi />} />
            <Route path="/ujian" element={<Ujian questions={questions} />} />
            <Route path="/" element={<Navigate to="/siswa" />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
