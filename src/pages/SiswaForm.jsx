import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "./SiswaForm.css";

const SiswaForm = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHp: "",
    instansi: "",
    ptnTujuan: "",
    token: "", // Hanya gunakan token
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi token ujian
    if (formData.token) {
      setSubmitted(true);
    } else {
      setError("Token Ujian tidak valid.");
    }
  };

  if (submitted) {
    return <Navigate to="/instruksi" />;
  }

  return (
    <div className="siswa-form-container">
      <h2>Formulir Pendaftaran Ujian</h2>
      <form onSubmit={handleSubmit}>
        {["Nama", "Email", "No HP (WhatsApp)", "Asal Instansi", "PTN Tujuan"].map((field, index) => (
          <div key={index} className="form-group">
            <label>{field}</label>
            <input
              type={field === "Email" ? "email" : "text"}
              name={field.toLowerCase().replace(/[^a-z]/g, '')}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="form-group">
          <label>Token Ujian</label>
          <input
            type="text"
            name="token"
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Mulai Ujian</button>
      </form>
    </div>
  );
};

export default SiswaForm;
