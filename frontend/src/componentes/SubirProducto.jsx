import { useState } from "react";
import axios from "axios";

export default function SubirProducto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setMensaje("Debes iniciar sesion para subir productos");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/productos", {
                nombre,
                descripcion,
                categoria,
                precio,
                imagen,
            });
            setMensaje("Productos agregado correctamente");
            setNombre("");
            setDescripcion("");
            setCategoria("");
            setPrecio("");
            setImagen("");
        } catch (error) {
            console.log(error);
            setMensaje("Error al subir el producto");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Subir Producto</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Categoría"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="URL de imagen"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    required
                />
                <button type="submit">Subir Producto</button>
            </form>
            <p>{mensaje}</p>
        </div>
    )
}