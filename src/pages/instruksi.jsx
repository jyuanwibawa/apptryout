import React from "react";
import { useNavigate } from "react-router-dom";
import "./Instruksi.css";

const Instruksi = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/ujian");
  };

  return (
    <div className="instruksi-container">
      <h2>Instruksi Ujian</h2>
      <p>Berikut adalah instruksi untuk mengikuti ujian:</p>
      <ul>
        <li>Pastikan Anda memiliki koneksi internet yang stabil.</li>
        <li>Siapkan alat tulis dan kertas untuk mencatat.</li>
        <li>Jangan menutup atau me-refresh halaman selama ujian berlangsung.</li>
        <li>Kerjakan soal dengan teliti dan sesuai waktu yang diberikan.</li>
      </ul>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Instruksi;