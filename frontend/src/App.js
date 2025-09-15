import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Screen Component
const HomeScreen = ({ onContinue }) => {
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
        <h1 className="text-4xl font-bold mb-2 text-blue-800">CEIP Josefina Carabias</h1>
        <p className="text-xl mb-8 text-blue-700">CONTROL DE ALUMNOS</p>
        
        <button 
          onClick={onContinue}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Main Screen - Menu with Classes
const MainScreen = ({ classes }) => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">C.E.I.P JOSEFINA CARABIAS</h1>
        
        <div className="bg-pink-300 text-black font-bold text-lg text-center py-3 mb-6 rounded-lg">
          SELECCIONAR AULA:
        </div>
        
        <div className="space-y-3 mb-8">
          {classes.map((classItem, index) => (
            <button
              key={classItem.id}
              className="w-full p-4 rounded-lg text-black font-bold text-lg hover:opacity-90 transition-opacity shadow-md text-left"
              style={{ backgroundColor: classItem.background_color }}
            >
              {classItem.class_name} - {classItem.teacher_name.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="fixed bottom-6 right-6">
          <button className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg">
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

function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [classes, setClasses] = useState([]);
  
  // Load classes when component mounts
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
  
  if (currentScreen === "home") {
    return <HomeScreen onContinue={() => setCurrentScreen("main")} />;
  }
  
  if (currentScreen === "main") {
    return <MainScreen classes={classes} />;
  }
  
  return <div>Screen not found</div>;
}

export default App;