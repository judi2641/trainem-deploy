// src/App.tsx
import Dashboard from './pages/Dashboard'; // Importiere deine neue Dashboard-Seite

function App() {
  /*
    HINWEIS:
    Hier lag vorher der Backend-Test-Code.
    Den brauchen wir für die UI-Vorschau nicht.
    
    Später kommt hier der "Router" hin, der entscheidet:
    Zeige <Login /> ODER zeige <Dashboard />

    Fürs Erste laden wir einfach *immer* dein Dashboard.
  */
  
  return (
    <Dashboard />
  );
}

export default App;