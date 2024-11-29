const { getConnection } = require("./connection");

// Función para insertar un registro en la tabla "usuarios"
async function insertUser(data) {
  const insertQuery = `
    INSERT INTO PERSONA (
      NOMBRE, 
      APELLIDOS, 
      EMAIL, 
      TELEFONO, 
      DIRECCION, 
      CONTRASEÑA, 
      TIPO_USUARIO, 
      FECHA_REGISTRO
    ) VALUES (
      :nombre, 
      :apellidos, 
      :email, 
      :telefono, 
      :direccion, 
      :contrasena, 
      :tipo_usuario, 
      SYSDATE
    )
  `;
  
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(insertQuery, data, { autoCommit: true });
    console.log("Registro insertado en la tabla usuarios.");
  } catch (error) {
    console.error("Error al insertar en usuarios:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar la conexión:", err);
      }
    }
  }
}

// Función para insertar un registro en otra tabla
async function insertProduct(data) {
  const insertQuery = `
    INSERT INTO productos (
            NOMBRE, 
            DESCRIPCION, 
            PRECIO, 
            ID_CATEGORIA, 
            SKU, 
            TALLA, 
            COLOR, 
            IMAGEN_URL, 
            ESTADO
        ) VALUES (
            :nombre, 
            :descripcion, 
            :precio, 
            :id_categoria, 
            :sku, 
            :talla, 
            :color, 
            :imagen_url, 
            :estado
        )
    `;

  
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(insertQuery, data, { autoCommit: true });
    console.log("Registro insertado en la tabla otra_tabla.");
  } catch (error) {
    console.error("Error al insertar en otra_tabla:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar la conexión:", err);
      }
    }
  }
}


async function searchProductsByName(nombre) {
    const searchQuery = `
        SELECT NOMBRE, PRECIO, ESTADO 
        FROM productos 
        WHERE NOMBRE LIKE :nombre
    `;

    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(searchQuery, { nombre: `%${nombre}%` });
        return result.rows;
    } catch (error) {
        console.error("Error al buscar productos:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión:", err);
            }
        }
    }
}


async function searchUsersByCriteria({ nombre, apellidos, email, tipo_usuario }) {
  let searchQuery = `
      SELECT ID_USUARIO, NOMBRE, APELLIDOS, EMAIL
      FROM PERSONA
      WHERE 1=1
  `;

  const queryParams = [];

  if (nombre) {
      searchQuery += " AND NOMBRE LIKE :nombre";
      queryParams.push(`%${nombre}%`);
  }

  if (apellidos) {
      searchQuery += " AND APELLIDOS LIKE :apellidos";
      queryParams.push(`%${apellidos}%`);
  }

  if (email) {
      searchQuery += " AND EMAIL LIKE :email";
      queryParams.push(`%${email}%`);
  }

  if (tipo_usuario) {
      searchQuery += " AND TIPO_USUARIO = :tipo_usuario";
      queryParams.push(tipo_usuario);
  }

  let connection;
  try {
      connection = await getConnection();
      const result = await connection.execute(searchQuery, queryParams);
      return result.rows; // Devolver los resultados encontrados
  } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw error;
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error("Error al cerrar la conexión:", err);
          }
      }
  }
}

async function getUserDetailsById(id) {
  const UserDetailquery = `
      SELECT NOMBRE, APELLIDOS, EMAIL, TELEFONO, DIRECCION, TIPO_USUARIO
      FROM PERSONA
      WHERE ID_USUARIO = :id
  `;

  let connection;
  try {
      connection = await getConnection();
      const result = await connection.execute(UserDetailquery, { id });

      if (result.rows.length > 0) {
          // Transforma el resultado en un objeto
          const user = result.rows[0];
          return {
              NOMBRE: user[0],
              APELLIDOS: user[1],
              EMAIL: user[2],
              TELEFONO: user[3],
              DIRECCION: user[4],
              TIPO_USUARIO: user[5],
          };
      }

      return null; // Si no hay resultados, retorna null
  } catch (error) {
      console.error("Error al obtener detalles del usuario:", error);
      throw error;
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error("Error al cerrar la conexión:", err);
          }
      }
  }
}

async function updateUser(data) {
  const updateQuery = `
      UPDATE PERSONA
      SET 
          NOMBRE = :nombre,
          APELLIDOS = :apellidos,
          EMAIL = :email,
          TELEFONO = :telefono,
          DIRECCION = :direccion,
          TIPO_USUARIO = :tipo_usuario
      WHERE ID_USUARIO = :id
  `;

  let connection;
  try {
      connection = await getConnection();
      await connection.execute(updateQuery, data, { autoCommit: true });
      console.log("Usuario actualizado correctamente.");
  } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error("Error al cerrar la conexión:", err);
          }
      }
  }
}




module.exports = { insertUser, insertProduct, searchProductsByName, searchUsersByCriteria, getUserDetailsById, updateUser };
