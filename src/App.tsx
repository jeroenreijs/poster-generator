import "./App.css";
import { Link, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Poster from "./components/Poster";

function App() {
  return (
    <div className="App">
      <nav>
        <div className="menu">
          <Link to="/">Home</Link>
          <Link to="/poster">Poster</Link>
        </div>
      </nav>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/poster" component={Poster} />
      </Switch>
    </div>
  );
}

export default App;
