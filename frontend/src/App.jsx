import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Productos from "./components/Productos";
import Registro from "./components/Registro";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#f2f2f2" }}>
        <Link to="/">Productos</Link> | <Link to="/registro">Registro</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Productos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
