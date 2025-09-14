import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
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
        
        <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg">
          EMPEZAR
        </button>
      </div>
    </div>
  );
}

export default App;