/*import { useState } from 'react'
import './App.css'
import LandingPage from "./LandingPage";

function App() {

  const [error, setError] = useState("");
  const [responseText, setResponseText] = useState("");
  
  const sendTestRequestToAPI = async () =>  {
    try{

      const res = await fetch("http://localhost:3000");
      
      if(res.ok){
        const text = await res.text();
        setResponseText(text);
      }
      
      else{
        setError("error")
      }
    }
    catch(error){
      setError("error, backend running?");
      console.error(error);
    }
  }

  return (
    <>
      <button onClick={sendTestRequestToAPI}>send request to backend</button>
      <text>        
        {error} {responseText}
      </text>
    </>
  )
}

export default App
*/

import LandingPage from "./LandingPage";

function App() {
  return <LandingPage />;
}

export default App;
