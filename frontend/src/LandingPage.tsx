import { useState } from "react";
import "./App.css";

function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Anfrage ans Backend schicken (Port 3000)
      const res = await fetch("http://localhost:3000", {
        method: "GET",
      });

      if (res.ok) {
        const text = await res.text();
        setMessage(`Backend antwortet: ${text}`);
      } else {
        setMessage("Fehler: Server hat nicht richtig geantwortet ");
      }
    } catch (error) {
      console.error(error);
      setMessage("Fehler beim Verbinden mit dem Backend ");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #a5b4fc, #93c5fd)",
        color: "#333",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>TrainEm</h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.2rem", textAlign: "center", maxWidth: 400 }}>
        Willkommen bei <strong>TrainEm</strong> — deiner Plattform für Motivation,
        Spaß und Fortschritt beim Training!
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
          }}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "0.8rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Hier kannst du dich anmelden
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default LandingPage;
