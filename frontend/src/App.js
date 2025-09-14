import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Screen Component
const HomeScreen = ({ onContinue, schoolName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=200&h=200&fit=crop&crop=center"
            alt="Globe"
            className="w-32 h-32 mx-auto rounded-full shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2">{schoolName}</h1>
        <p className="text-xl mb-8 opacity-90">Sistema de Seguimiento de Estudiantes</p>
        
        <button
          onClick={onContinue}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Main Screen with Classes
const MainScreen = ({ classes, onClassSelect, onSettingsClick }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Seleccionar Clase</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {classes.map((classItem, index) => (
            <button
              key={classItem.id}
              onClick={() => onClassSelect(classItem.class_name)}
              className="p-6 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
              style={{ backgroundColor: classItem.background_color }}
            >
              <div className="text-center">
                <div className="text-sm mb-2">{classItem.class_name}</div>
                <div className="text-xs opacity-90">{classItem.teacher_name}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="fixed bottom-6 left-6">
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
const StudentListScreen = ({ className, students, onStudentSelect, onBack, selectedStudents }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Volver
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{className}</h2>
          <div></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Lista de Estudiantes ({students.length})</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => (
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
const StudentDetailsModal = ({ student, onClose, onAddStudent, onFinish }) => {
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
              Agregar Estudiante
            </button>
            <button
              onClick={onFinish}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Students to Call Screen
const StudentsToCallScreen = ({ selectedStudents, onBackToMenu }) => {
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
            onClick={onBackToMenu}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            IR AL MENÚ
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Screen
const SettingsScreen = ({ onBack, onAddStudent, onEditStudent, onAdvancedOptions }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Volver
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Opciones</h2>
          <div></div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onAddStudent}
            className="w-full bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            AGREGAR ESTUDIANTE
          </button>
          
          <button
            onClick={onEditStudent}
            className="w-full bg-yellow-600 text-white p-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
          >
            EDITAR ESTUDIANTE
          </button>
          
          <button
            onClick={onAdvancedOptions}
            className="w-full bg-purple-600 text-white p-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            OPCIONES AVANZADAS
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-gray-600 text-white p-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            VOLVER AL MENÚ
          </button>
        </div>
      </div>
    </div>
  );
};

// Student Selection Screen
const StudentSelectionScreen = ({ students, onStudentSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Volver
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Seleccionar Estudiante para Editar</h2>
          <div></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Todos los Estudiantes ({students.length})</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => onStudentSelect(student)}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{student.first_and_last_name}</div>
                    <div className="text-sm text-gray-600">{student.class_name}</div>
                  </div>
                  <div className="text-blue-600 text-sm">Editar →</div>
                </div>
              </button>
            ))}
          </div>
          
          {students.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay estudiantes registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Student Form Component
const StudentForm = ({ student, onSave, onDelete, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    first_and_last_name: student?.first_and_last_name || "",
    class_name: student?.class_name || "",
    mother_name: student?.mother_name || "",
    mother_phone: student?.mother_phone || "",
    father_name: student?.father_name || "",
    father_phone: student?.father_phone || "",
    allergies: student?.allergies || "",
    comments: student?.comments || ""
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const classes = [
    "INFANTIL 3 AÑOS", "INFANTIL 4 AÑOS", "INFANTIL 5 AÑOS",
    "1º DE PRIMARIA", "2º DE PRIMARIA", "3º DE PRIMARIA",
    "4º DE PRIMARIA", "5º DE PRIMARIA", "6º DE PRIMARIA"
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(student.id);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {isEdit ? "Editar Estudiante" : "Agregar Estudiante"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre y Apellidos *</label>
              <input
                type="text"
                required
                value={formData.first_and_last_name}
                onChange={(e) => setFormData({...formData, first_and_last_name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Clase *</label>
              <select
                required
                value={formData.class_name}
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar clase</option>
                {classes.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Madre</label>
              <input
                type="text"
                value={formData.mother_name}
                onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono de la Madre</label>
              <input
                type="tel"
                value={formData.mother_phone}
                onChange={(e) => setFormData({...formData, mother_phone: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Padre</label>
              <input
                type="text"
                value={formData.father_name}
                onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono del Padre</label>
              <input
                type="tel"
                value={formData.father_phone}
                onChange={(e) => setFormData({...formData, father_phone: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Alergias</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Comentarios</label>
              <textarea
                rows="3"
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEdit ? "Actualizar" : "Crear"}
              </button>
              
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
            
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors mt-2"
              >
                ELIMINAR ESTUDIANTE
              </button>
            )}
          </form>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-bold mb-4">¿Eliminar estudiante?</h4>
            <p className="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar este estudiante?</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                SÍ
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  
  // Load initial data
  useEffect(() => {
    loadClasses();
    loadAllStudents();
  }, []);
  
  const loadClasses = async () => {
    try {
      const response = await axios.get(`${API}/classes`);
      setClasses(response.data);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };
  
  const loadAllStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`);
      setAllStudents(response.data);
    } catch (error) {
      console.error("Error loading students:", error);
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
  };
  
  const handleFinish = () => {
    setSelectedStudent(null);
    setCurrentScreen("studentsToCall");
  };
  
  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await axios.put(`${API}/students/${editingStudent.id}`, studentData);
      } else {
        await axios.post(`${API}/students`, studentData);
      }
      
      setShowStudentForm(false);
      setEditingStudent(null);
      loadAllStudents();
      if (selectedClass) {
        loadStudentsByClass(selectedClass);
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };
  
  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`${API}/students/${studentId}`);
      setShowStudentForm(false);
      setEditingStudent(null);
      loadAllStudents();
      if (selectedClass) {
        loadStudentsByClass(selectedClass);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  
  // Render current screen
  switch (currentScreen) {
    case "home":
      return (
        <HomeScreen
          onContinue={() => setCurrentScreen("main")}
          schoolName={schoolName}
        />
      );
      
    case "main":
      return (
        <MainScreen
          classes={classes}
          onClassSelect={handleClassSelect}
          onSettingsClick={() => setCurrentScreen("settings")}
        />
      );
      
    case "studentList":
      return (
        <>
          <StudentListScreen
            className={selectedClass}
            students={students}
            onStudentSelect={handleStudentSelect}
            onBack={() => setCurrentScreen("main")}
            selectedStudents={selectedStudents}
          />
          {selectedStudent && (
            <StudentDetailsModal
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
              onAddStudent={handleAddStudent}
              onFinish={handleFinish}
            />
          )}
        </>
      );
      
    case "studentsToCall":
      return (
        <StudentsToCallScreen
          selectedStudents={selectedStudents}
          onBackToMenu={() => {
            setCurrentScreen("main");
            setSelectedStudents([]);
          }}
        />
      );
      
    case "settings":
      return (
        <>
          <SettingsScreen
            onBack={() => setCurrentScreen("main")}
            onAddStudent={() => {
              setEditingStudent(null);
              setShowStudentForm(true);
            }}
            onEditStudent={() => {
              // Go to student selection screen
              setCurrentScreen("studentSelection");
            }}
            onAdvancedOptions={() => {
              // Placeholder for advanced options
              alert("Opciones avanzadas - En desarrollo");
            }}
          />
          {showStudentForm && (
            <StudentForm
              student={editingStudent}
              onSave={handleSaveStudent}
              onDelete={handleDeleteStudent}
              onCancel={() => {
                setShowStudentForm(false);
                setEditingStudent(null);
              }}
              isEdit={!!editingStudent}
            />
          )}
        </>
      );
      
    case "studentSelection":
      return (
        <StudentSelectionScreen
          students={allStudents}
          onStudentSelect={(student) => {
            setEditingStudent(student);
            setShowStudentForm(true);
            setCurrentScreen("settings");
          }}
          onBack={() => setCurrentScreen("settings")}
        />
      );
      
    default:
      return <div>Screen not found</div>;
  }
}

export default App;