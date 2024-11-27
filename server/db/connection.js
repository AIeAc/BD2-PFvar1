const oracledb = require("oracledb");

// Configuración de la base de datos
const dbConfig = {
  user: "pablito", // Cambiar por tu usuario de Oracle
  password: "oracle1", // Cambiar por tu contraseña de Oracle
  connectString: "192.9.157.22:1521/MYPDB" // Cambiar por tu cadena de conexión
};

// Función para obtener una conexión
async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Conexión establecida con la base de datos.");
    return connection;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    throw error;
  }
}

module.exports = { getConnection };
