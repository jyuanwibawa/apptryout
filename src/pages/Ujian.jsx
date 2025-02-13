import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Ujian.css";

const Ujian = () => {
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(location.state?.time || 0); // Menggunakan waktu dari state atau default 0
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Apa hasil dari 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
    },
    {
      id: 2,
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Bersihkan interval saat komponen di-unmount
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours} Jam ${minutes} Menit ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds} Detik`;
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
    } else {
      alert("Ujian selesai!");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption("");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="header">SOAL UJIAN</div>
      <div className="timer">{formatTime(timeLeft)}</div>
      <div className="container">
        <div className="question-container">
          <div className="question-header">
            <div className="number">{currentQuestionIndex + 1}</div>
            <div className="text">SOAL NO</div>
          </div>
          <div className="question-text">
            {currentQuestion.question}
          </div>
          <ul className="options">
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <input
                  type="radio"
                  name="option"
                  id={`option${index}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <label htmlFor={`option${index}`}>{option}</label>
              </li>
            ))}
          </ul>
          <div className="buttons">
            <button className="prev" onClick={handlePrevQuestion}>Sebelumnya</button>
            <button className="doubt">Ragu-Ragu</button>
            <button className="next" onClick={handleNextQuestion}>Selanjutnya</button>
          </div>
        </div>
        <div className="navigation">
          <h3>Navigasi Soal</h3>
          <div className="grid">
            {questions.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <div className="legend">
            <div className="answered"><span></span> Telah dijawab</div>
            <div className="not-answered"><span></span> Belum Dijawab</div>
            <div className="doubt"><span></span> Ragu-Ragu</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ujian;