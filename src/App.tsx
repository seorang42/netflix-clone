import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Series";
import Search from "./Routes/Search";
import Header from "./Header";
import Movie from "./Routes/Movies";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="info/:id" element={<Home />}></Route>
        </Route>
        <Route path="/series" element={<Tv />}>
          <Route path="info/:id" element={<Home />}></Route>
        </Route>
        <Route path="/movies" element={<Movie />}>
          <Route path="info/:id" element={<Home />}></Route>
        </Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
