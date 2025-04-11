const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Clave secreta para firmar los tokens (¡mantén esto seguro!)
const SECRET_KEY = "tu_clave_secreta";

// Simulación de una base de datos
const users = [
  {
    id: 1,
    email: "prueba@a.com",
    password: bcrypt.hashSync("a123456", 10), // Contraseña encriptada
  },
];

// Ruta para iniciar sesión
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  // Comparar la contraseña ingresada con la almacenada
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  // Generar el token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h", // El token expira en 1 hora
  });

  res.json({ token });
});

// Ruta protegida (requiere token)
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Acceso permitido", data: decoded });
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
});

// Iniciar el servidor
app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});