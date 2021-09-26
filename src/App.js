import "./App.css";
import SpotifyLogin from "./SpotifyLogin";
import Callback from "./Callback";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Link to="/login">Login with Spotify</Link>
      </div>
      <Switch>
        <Route path="/login" component={SpotifyLogin} />
        <Route path="/callback" component={Callback} />
      </Switch>
    </Router>
  );
}

export default App;
