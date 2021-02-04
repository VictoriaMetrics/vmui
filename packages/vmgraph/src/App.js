import logo from './logo.png';
import './App.scss';

import Graph from "./graph/Graph";

function App() {
  return (
      <div id="App">
        <header>
          <img src={logo} className="logo" alt="logo"/> Victoria Metrics
        </header>

        <Graph/>

      </div>
  );
}

export default App;
