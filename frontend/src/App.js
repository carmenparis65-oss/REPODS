import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Screen Component
const HomeScreen = ({ onContinue, schoolName }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="https://i.ibb.co/XxTxQTfp/LOGO-COLE.jpg"
            alt="CEIP Josefina Carabias Logo"
            className="w-48 h-48 mx-auto rounded-lg shadow-lg object-contain bg-white p-2"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-blue-800">{schoolName}</h1>
        <p className="text-xl mb-8 text-blue-700">CONTROL DE ALUMNOS</p>
        
        <button
          onClick={onContinue}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          EMPEZAR
        </button>
      </div>
    </div>
  );
};

// Main Screen with Classes - Mobile Design
const MainScreen = ({ classes, onClassSelect, onSettingsClick }) => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6 text-black">C.E.I.P JOSEFINA CARABIAS</h1>
        
        {/* Subtitle with pink background */}
        <div className="bg-pink-300 text-black font-bold text-lg text-center py-3 mb-6 rounded-lg">
          SELECCIONAR AULA:
        </div>
        
        {/* Vertical buttons */}
        <div className="space-y-3 mb-8">
          {classes.map((classItem, index) => (
            <button
              key={classItem.id}
              onClick={() => onClassSelect(classItem.class_name)}
              className="w-full p-4 rounded-lg text-black font-bold text-lg hover:opacity-90 transition-opacity shadow-md text-left"
              style={{ backgroundColor: classItem.background_color }}
            >
              {classItem.class_name} - {classItem.teacher_name.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* Settings button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={onSettingsClick}
            className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Student List Screen
const StudentListScreen = ({ className, students, onStudentSelect, onBack, selectedStudents, teacherName }) => {
  const isInfantil = className.includes("INFANTIL");
  const isPrimaria123 = ["1º DE PRIMARIA", "2º DE PRIMARIA", "3º DE PRIMARIA"].includes(className);
  const isPrimaria456 = ["4º DE PRIMARIA", "5º DE PRIMARIA", "6º DE PRIMARIA"].includes(className);
  
  let backgroundColor = "#F3F4F6";
  let titleColor = "text-gray-800";
  
  if (isInfantil) {
    backgroundColor = "#93C5FD";
    titleColor = "text-black";
  } else if (isPrimaria123) {
    backgroundColor = "#FB923C";
    titleColor = "text-black";
  } else if (isPrimaria456) {
    backgroundColor = "#A3E635";
    titleColor = "text-black";
  }
  
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Volver
          </button>
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${titleColor}`}>{className}</h2>
            {teacherName && (
              <p className={`text-2xl font-bold ${titleColor} opacity-90 mt-1`}>{teacherName.toUpperCase()}</p>
            )}
          </div>
          <div></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b" style={{ backgroundColor: isPrimaria123 ? "#FBBF24" : "#F97316" }}>
            <h3 className="text-lg font-semibold text-black">SELECCIONAR ALUMNO/A ({students.length})</h3>
          </div>
          
          <div className="h-4" style={{ backgroundColor }}></div>
          
          <div className="max-h-96 overflow-y-auto px-4">
            {students
              .sort((a, b) => a.first_and_last_name.toLowerCase().localeCompare(b.first_and_last_name.toLowerCase()))
              .map((student) => (
                <button
                  key={student.id}
                  onClick={() => onStudentSelect(student)}
                  className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{student.first_and_last_name}</span>
                    {selectedStudents.some(s => s.id === student.id) && (
                      <span className="text-green-600 text-sm">✓ Seleccionado</span>
                    )}
                  </div>
                </button>
              ))}
          </div>
          
          {students.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay estudiantes en esta clase
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Student Details Modal
const StudentDetailsModal = ({ student, onClose, onAddStudent, onAddAndFinish }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{student.first_and_last_name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div><strong>Clase:</strong> {student.class_name}</div>
            {student.mother_name && <div><strong>Nombre de la Madre:</strong> {student.mother_name}</div>}
            {student.mother_phone && <div><strong>Teléfono de la Madre:</strong> {student.mother_phone}</div>}
            {student.father_name && <div><strong>Nombre del Padre:</strong> {student.father_name}</div>}
            {student.father_phone && <div><strong>Teléfono del Padre:</strong> {student.father_phone}</div>}
            {student.allergies && <div><strong>Alergias:</strong> {student.allergies}</div>}
            {student.comments && <div><strong>Comentarios:</strong> {student.comments}</div>}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onAddStudent(student)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              AÑADIR OTRO
            </button>
            <button
              onClick={() => onAddAndFinish(student)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              AGREGAR Y FINALIZAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schoolName, setSchoolName] = useState("CEIP Josefina Carabias");
  
  // Load initial data
  useEffect(() => {
    loadClasses();
  }, []);
  
  const loadClasses = async () => {
    try {
      const response = await axios.get(`${API}/classes`);
      setClasses(response.data);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };
  
  const loadStudentsByClass = async (className) => {
    try {
      const response = await axios.get(`${API}/students/class/${encodeURIComponent(className)}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error loading students by class:", error);
    }
  };
  
  const getTeacherName = (className) => {
    const classInfo = classes.find(c => c.class_name === className);
    return classInfo ? classInfo.teacher_name : "";
  };
  
  const handleClassSelect = (className) => {
    setSelectedClass(className);
    loadStudentsByClass(className);
    setCurrentScreen("studentList");
  };
  
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };
  
  const handleAddStudent = (student) => {
    const isAlreadySelected = selectedStudents.some(s => s.id === student.id);
    if (!isAlreadySelected) {
      setSelectedStudents([...selectedStudents, student]);
    }
    setSelectedStudent(null);
    setCurrentScreen("main");
  };
  
  const handleAddAndFinish = (student) => {
    const isAlreadySelected = selectedStudents.some(s => s.id === student.id);
    if (!isAlreadySelected) {
      setSelectedStudents([...selectedStudents, student]);
    }
    setSelectedStudent(null);
    setCurrentScreen("studentsToCall");
  };
  
  // Render screens
  if (currentScreen === "home") {
    return (
      <HomeScreen
        onContinue={() => setCurrentScreen("main")}
        schoolName={schoolName}
      />
    );
  }
  
  if (currentScreen === "main") {
    return (
      <MainScreen
        classes={classes}
        onClassSelect={handleClassSelect}
        onSettingsClick={() => alert("Configuración en desarrollo")}
      />
    );
  }
  
  if (currentScreen === "studentList") {
    return (
      <>
        <StudentListScreen
          className={selectedClass}
          students={students}
          onStudentSelect={handleStudentSelect}
          onBack={() => setCurrentScreen("main")}
          selectedStudents={selectedStudents}
          teacherName={getTeacherName(selectedClass)}
        />
        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onAddStudent={handleAddStudent}
            onAddAndFinish={handleAddAndFinish}
          />
        )}
      </>
    );
  }
  
  if (currentScreen === "studentsToCall") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">ESTUDIANTES PARA LLAMAR</h2>
          
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Lista de Estudiantes ({selectedStudents.length})</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {selectedStudents.map((student, index) => (
                <div key={student.id} className="p-4 border-b border-gray-100">
                  <div className="font-medium">{student.first_and_last_name}</div>
                  <div className="text-sm text-gray-600">{student.class_name}</div>
                </div>
              ))}
            </div>
            
            {selectedStudents.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay estudiantes seleccionados
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setCurrentScreen("main");
                setSelectedStudents([]);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              IR AL MENÚ
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return <div>Screen not found</div>;
}

export default App;