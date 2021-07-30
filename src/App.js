import { useState } from "react";
import "./App.css";
import Login from "./views/Login/";

function App() {
  const [username, setUsername] = useState("");
  return (
    <Login
      username={username}
      handleUsername={(e) => setUsername(e.target.value)}
    />
  );
}

export default App;
