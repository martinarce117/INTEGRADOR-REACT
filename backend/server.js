import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos MySQL");
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente!");
});

// Ejemplo de ruta para obtener productos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
