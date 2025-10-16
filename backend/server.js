import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { verify } from "crypto";

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

function VerificarToken(req, res, next){
  const header = req.headers.authorizacion;

  if(!header)
    return res.status(401).json({message: "Token faltante"});

  const token = header.split(" ")[1];

  try{
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.usuario = decoded; // guarda los datos del usuario
    next();
  } catch (error){
    res.status(403).json({message: "Token invalido o expirado"})
  }
}

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente!");
});

// Obtener todos los productos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// Ruta para registrar usuario
app.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log("Datos recibido", req.body);
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    // Cifrar la contraseña
    const saltRounds = 10; // nivel de seguridad
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Guardar el usuario en la base de datos
    const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    db.query(sql, [nombre, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "El email ya está registrado" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Usuario registrado correctamente", id: result.insertId });
    });

  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ error: "Faltan datos" });

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

    const usuario = results[0];

    // Verificar contraseña
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      {id: usuario.id, email: usuario.email},
      process.env.jwt_secret,
      {expiresIn: "2h"}
    );
    res.json({ message: "Login exitoso",
       token,
       usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  });
});

// Subir un nuevo producto 
app.post("/productos", VerificarToken, (req, res) => {
  const { nombre, descripcion, categoria, precio, imagen } = req.body;

  const sql = "INSERT INTO productos (nombre, descripcion, categoria, precio, imagen) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, descripcion, categoria, precio, imagen], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Producto agregado correctamente", id: result.insertId });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});




