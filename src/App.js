import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./views/Login/";
import Dashboard from "./views/Dashboard/";
import OneTime from "./views/OneTime/";
import AddCredential from "./views/AddCredential/";
import Authorize from "./views/Authorize/";
import Private from "./components/PrivateRoute/";

function App() {
  const [username, setUsername] = useState("");
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login
            username={username}
            handleUsername={(e) => setUsername(e.target.value)}
          />
        </Route>
        <Route path="/push" exact>
          <OneTime />
        </Route>
        <Route path="/add_credential" exact>
          <AddCredential />
        </Route>
        <Route path="/authorize" exact>
          <Authorize />
        </Route>
        <Private path="/dashboard">
          <Dashboard />
        </Private>
      </Switch>
    </Router>
  );
}

export default App;
