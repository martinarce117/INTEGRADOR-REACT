import { useEffect, useState } from "react";
import axios from "axios";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/productos")
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {productos.map(producto => (
          <div key={producto.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%" }} />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <strong>${producto.precio}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}