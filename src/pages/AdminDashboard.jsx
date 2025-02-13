import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [page, setPage] = useState("dashboard");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();

    const handleStartExam = (course) => {
        setSelectedCourse(course);
        navigate("/ujian", { state: { time: course.time * 60 } }); // Mengirim waktu ujian dalam detik
    };

    return (
        <div className="admin-container">
            <Sidebar onNavigate={setPage} />
            <div className="main-content adjusted-content">
                {page === "courses" && <Courses onStartExam={handleStartExam} />}
                {page === "questions" && <Questions />}
                {page === "dashboard" && <DashboardHome />}
            </div>
        </div>
    );
};

const Sidebar = ({ onNavigate }) => (
    <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate("courses"); }}>Mata Kuliah</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate("questions"); }}>Soal</a></li>
        </ul>
    </div>
);

const DashboardHome = () => (
    <div className="dashboard-home">
        <h2>Selamat Datang di Dashboard Admin</h2>
        <p>Kelola mata kuliah dan soal dengan mudah melalui dashboard ini.</p>
    </div>
);

const AddCourseForm = ({ onAdd }) => {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCourse = { name, code, time: parseInt(time) };
        const response = await fetch("/api/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCourse),
        });
        const course = await response.json();
        onAdd(course);
        setName("");
        setCode("");
        setTime("");
    };

    return (
        <div className="add-course">
            <h2>Tambah Mata Kuliah</h2>
            <form onSubmit={handleSubmit}>
                <label>Nama Mata Kuliah:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama mata kuliah" />
                <label>Token Ujian:</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Masukkan token ujian" />
                <label>Waktu Ujian (menit):</label>
                <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Masukkan waktu ujian dalam menit" />
                <button type="submit">Tambah</button>
            </form>
        </div>
    );
};

const EditCourseForm = ({ course, onSave }) => {
    const [name, setName] = useState(course.name);
    const [code, setCode] = useState(course.code);
    const [time, setTime] = useState(course.time);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedCourse = { ...course, name, code, time: parseInt(time) };
        const response = await fetch(`/api/courses/${course.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCourse),
        });
        const savedCourse = await response.json();
        onSave(savedCourse);
    };

    return (
        <div className="edit-course">
            <h2>Edit Mata Kuliah</h2>
            <form onSubmit={handleSubmit}>
                <label>Nama Mata Kuliah:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Token Ujian:</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                <label>Waktu Ujian (menit):</label>
                <input type="number" value={time} onChange={(e) => setTime(e.target.value)} />
                <button type="submit">Simpan</button>
            </form>
        </div>
    );
};

const Courses = ({ onStartExam }) => {
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [addingCourse, setAddingCourse] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await fetch("/api/courses");
            const data = await response.json();
            setCourses(data);
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCourses(courses.map(course => {
                if (course.isExamStarted && course.remainingTime > 0) {
                    return { ...course, remainingTime: course.remainingTime - 1 };
                }
                return course;
            }));
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [courses]);

    const handleEdit = (course) => {
        setEditingCourse(course);
    };

    const handleSave = (updatedCourse) => {
        setCourses(courses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
        setEditingCourse(null);
    };


    const handleDelete = async (courseId) => {
        await fetch(`/api/courses/${courseId}`, {
            method: "DELETE",
        });
        setCourses(courses.filter(course => course.id !== courseId));
    };

    const handleAdd = (newCourse) => {
        setCourses([...courses, newCourse]);
        setAddingCourse(false);
    };

    const handleStartExamClick = (course) => {
        onStartExam(course);
    };

    return (
        <div className="courses">
            <h2>Daftar Mata Kuliah</h2>
            <button onClick={() => setAddingCourse(true)}>Tambah Mata Kuliah</button>
            {addingCourse && <AddCourseForm onAdd={handleAdd} />}
            {editingCourse ? (
                <EditCourseForm course={editingCourse} onSave={handleSave} />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Token Ujian</th>
                            <th>Waktu Ujian (menit)</th>
                            <th>Mata Pelajaran</th>
                            <th>Waktu Tersisa</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.code}</td>
                                <td>{course.time}</td>
                                <td>{course.name}</td>
                                <td>{course.isExamStarted ? course.remainingTime : course.time}</td>
                                <td>
                                    <button onClick={() => handleEdit(course)}>Edit</button>
                                    <button onClick={() => handleDelete(course.id)}>Hapus</button>
                                    {!course.isExamStarted && <button onClick={() => handleStartExamClick(course)}>Mulai Ujian</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ courseId: "", question: "", options: ["", "", "", ""], answer: "" });
    const [selectedCourse, setSelectedCourse] = useState("");
    const [editingQuestion, setEditingQuestion] = useState(null);

    const handleAddQuestion = (e) => {
        e.preventDefault();
        setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
        setNewQuestion({ courseId: "", question: "", options: ["", "", "", ""], answer: "" });
    };

    const handleInputChange = (e, index) => {
        const options = [...newQuestion.options];
        options[index] = e.target.value;
        setNewQuestion({ ...newQuestion, options });
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
    };

    const handleSaveQuestion = (e) => {
        e.preventDefault();
        setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
        setEditingQuestion(null);
    };

    const handleDeleteQuestion = (questionId) => {
        setQuestions(questions.filter(question => question.id !== questionId));
    };

    const filteredQuestions = selectedCourse
        ? questions.filter(question => question.courseId === selectedCourse)
        : questions;

    return (
        <div className="questions">
            <h2>Soal Pilihan Ganda</h2>
            <form onSubmit={editingQuestion ? handleSaveQuestion : handleAddQuestion}>
                <label>Mata Kuliah:</label>
                <select value={editingQuestion ? editingQuestion.courseId : newQuestion.courseId} onChange={(e) => {
                    const value = e.target.value;
                    if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, courseId: value });
                    } else {
                        setNewQuestion({ ...newQuestion, courseId: value });
                    }
                }}>
                    <option value="">Pilih Mata Kuliah</option>
                    <option value="MAT101">Matematika</option>
                    <option value="FIS101">Fisika</option>
                    <option value="KIM101">Kimia</option>
                </select>
                <label>Pertanyaan:</label>
                <input type="text" value={editingQuestion ? editingQuestion.question : newQuestion.question} onChange={(e) => {
                    const value = e.target.value;
                    if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, question: value });
                    } else {
                        setNewQuestion({ ...newQuestion, question: value });
                    }
                }} />
                <label>Pilihan:</label>
                {(editingQuestion ? editingQuestion.options : newQuestion.options).map((option, index) => (
                    <input key={index} type="text" value={option} onChange={(e) => {
                        const value = e.target.value;
                        if (editingQuestion) {
                            const options = [...editingQuestion.options];
                            options[index] = value;
                            setEditingQuestion({ ...editingQuestion, options });
                        } else {
                            handleInputChange(e, index);
                        }
                    }} placeholder={`Pilihan ${index + 1}`} />
                ))}
                <label>Jawaban:</label>
                <input type="text" value={editingQuestion ? editingQuestion.answer : newQuestion.answer} onChange={(e) => {
                    const value = e.target.value;
                    if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, answer: value });
                    } else {
                        setNewQuestion({ ...newQuestion, answer: value });
                    }
                }} />
                <button type="submit">{editingQuestion ? "Simpan Soal" : "Tambah Soal"}</button>
            </form>
            <h3>Daftar Soal</h3>
            <label>Filter berdasarkan Mata Kuliah:</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">Semua Mata Kuliah</option>
                <option value="MAT101">Matematika</option>
                <option value="FIS101">Fisika</option>
                <option value="KIM101">Kimia</option>
            </select>
            <ul>
                {filteredQuestions.map(question => (
                    <li key={question.id}>
                        <strong>{question.courseId}</strong>: {question.question}
                        <ul>
                            {question.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                        <strong>Jawaban:</strong> {question.answer}
                        <button onClick={() => handleEditQuestion(question)}>Edit</button>
                        <button onClick={() => handleDeleteQuestion(question.id)}>Hapus</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;