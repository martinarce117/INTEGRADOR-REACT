import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Productos from "./componentes/Productos";
import Registro from "./componentes/Registro";
import Login from "./componentes/Login";
import SubirProducto from "./componentes/SubirProducto";

function App() {
  return (  
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#f2f2f2" }}>
        <Link to="/">Productos</Link> | <Link to="/registro">Registro</Link> | <Link to="/login">Login</Link> |  <Link to="/subirproducto">Subir Producto</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Productos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subirproducto" element={<SubirProducto />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
