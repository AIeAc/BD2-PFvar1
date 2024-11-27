const express = require("express");
const cors = require("cors");
const { insertUser, insertProduct, searchProductsByName, searchUsersByName, getUserDetailsById, updateUser } = require("./db/queries");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Endpoint para insertar en la tabla "usuarios"
app.post("/registerUser", async (req, res) => {
  const { nombre, apellidos, email, telefono, direccion, contrasena, tipo_usuario } = req.body;

  // Validar campos requeridos
  if (!nombre || !apellidos || !email || !contrasena || !tipo_usuario) {
    return res.status(400).json({ error: "Por favor, completa todos los campos obligatorios." });
  }

  try {
    await insertUser({ nombre, apellidos, email, telefono, direccion, contrasena, tipo_usuario });
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Endpoint para insertar en otra tabla
app.post("/registerProduct", async (req, res) => {
    const { nombre, descripcion, precio, id_categoria, sku, talla, color, imagen_url, estado } = req.body;

    if (!nombre || !precio || !id_categoria || !sku) {
        return res.status(400).json({ error: "Por favor, completa todos los campos obligatorios." });
    }

    try {
        await insertProduct({ nombre, descripcion, precio, id_categoria, sku, talla, color, imagen_url, estado });
        res.status(201).json({ message: "Producto registrado exitosamente." });
    } catch (error) {
        console.error("Error al insertar producto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

app.get("/productos/search", async (req, res) => {
    const { nombre } = req.query;

    if (!nombre) {
        return res.status(400).json({ error: "El parámetro 'nombre' es obligatorio." });
    }

    try {
        const results = await searchProductsByName(nombre);
        res.json(results);
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

const { searchUsersByCriteria } = require("./db/queries");

app.get("/usuarios/search", async (req, res) => {
    const { nombre, apellidos, email, tipo_usuario } = req.query;

    // Llamamos a la función que busca usuarios en la base de datos
    try {
        const results = await searchUsersByCriteria({ nombre, apellidos, email, tipo_usuario });
        res.json(results); // Enviar los resultados al cliente
    } catch (error) {
        console.error("Error al buscar usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});


app.get("/usuarios/details", async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "El parámetro 'id' es obligatorio." });
    }

    try {
        const userDetails = await getUserDetailsById(id);

        if (!userDetails) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        console.log("Detalles del usuario enviados al cliente:", userDetails);

        res.json(userDetails); // Envía los detalles del usuario
    } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

app.put("/usuarios/update", async (req, res) => {
    const { id, nombre, apellidos, email, telefono, direccion, tipo_usuario } = req.body;

    if (!id || !nombre || !apellidos || !email || !tipo_usuario) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
    }

    try {
        await updateUser({ id, nombre, apellidos, email, telefono, direccion, tipo_usuario });
        res.status(200).json({ message: "Usuario actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});


// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
