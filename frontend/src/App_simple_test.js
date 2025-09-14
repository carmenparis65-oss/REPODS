import React from "react";
import "./App.css";

function App() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "white", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "32px" }}>
          <img 
            src="https://i.ibb.co/XxTxQTfp/LOGO-COLE.jpg"
            alt="CEIP Josefina Carabias Logo"
            style={{ 
              width: "192px", 
              height: "192px", 
              margin: "0 auto", 
              borderRadius: "8px", 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
              objectFit: "contain", 
              backgroundColor: "white", 
              padding: "8px" 
            }}
          />
        </div>
        <h1 style={{ 
          fontSize: "36px", 
          fontWeight: "bold", 
          marginBottom: "8px", 
          color: "#1e40af" 
        }}>
          CEIP Josefina Carabias
        </h1>
        <p style={{ 
          fontSize: "20px", 
          marginBottom: "32px", 
          color: "#1d4ed8" 
        }}>
          CONTROL DE ALUMNOS
        </p>
        
        <button
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "16px 32px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "18px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default App;