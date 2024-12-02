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
    console.log("Registro insertado en la tabla persona.");
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


async function searchProductsByCriteria({ nombre, talla, color }) {
    let searchQuery = `
        SELECT ID_PRODUCTO, NOMBRE, PRECIO, ESTADO 
        FROM productos
        WHERE 1=1
    `;
    const queryParams = {};

    if (nombre) {
        searchQuery += " AND NOMBRE LIKE :nombre";
        queryParams.nombre = `%${nombre}%`;
    }
    if (talla) {
        searchQuery += " AND TALLA LIKE :talla";
        queryParams.talla = `%${talla}%`;
    }
    if (color) {
        searchQuery += " AND COLOR LIKE :color";
        queryParams.color = `%${color}%`;
    }

    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(searchQuery, queryParams);
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

async function getTopSalesProducts() {
  const query = `
      SELECT IMAGEN_URL, ID_PRODUCTO
      FROM productos
      ORDER BY ID_PRODUCTO DESC
      FETCH FIRST 8 ROWS ONLY
  `;

  let connection;
  try {
      connection = await getConnection();
      const result = await connection.execute(query);
      return result.rows.map(row => ({ IMAGEN_URL: row[0], ID_PRODUCTO: row[1] }));  // Transforma los resultados
  } catch (error) {
      console.error("Error al obtener los productos más vendidos:", error);
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

async function getProductDetailsById(id) {
  const query = `
      SELECT NOMBRE, DESCRIPCION, PRECIO, IMAGEN_URL
      FROM productos
      WHERE ID_PRODUCTO = :id
  `;

  let connection;
  try {
      connection = await getConnection();
      const result = await connection.execute(query, { id });
      if (result.rows.length > 0) {
          const product = result.rows[0];
          return {
              NOMBRE: product[0],
              DESCRIPCION: product[1],
              PRECIO: product[2],
              IMAGEN_URL: product[3]
          };
      }
      return null; // Si no se encuentra el producto
  } catch (error) {
      console.error("Error al ejecutar la consulta:", error);
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


async function addToCart(productId, productPrice) {
    const query = `
        INSERT INTO CARRITO_PRODUCTOS (ID_PRODUCTO, CANTIDAD, PRECIO_UNITARIO)
        VALUES (:productId, 1, :productPrice)
    `;

    let connection;
    try {
        connection = await getConnection();
        await connection.execute(query, { productId, productPrice }, { autoCommit: true });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
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



async function getProductPrice(productId) {
    const query = `
        SELECT PRECIO
        FROM PRODUCTOS
        WHERE ID_PRODUCTO = :productId
    `;

    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(query, { productId });
        if (result.rows.length > 0) {
            return result.rows[0][0]; // Retorna el precio del producto
        }
        return null; // Producto no encontrado
    } catch (error) {
        console.error("Error al obtener el precio del producto:", error);
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


async function getCartItems() {
    const query = `
        SELECT p.IMAGEN_URL, p.NOMBRE, cp.PRECIO_UNITARIO, cp.ID_PRODUCTO
        FROM CARRITO_PRODUCTOS cp
        JOIN PRODUCTOS p ON cp.ID_PRODUCTO = p.ID_PRODUCTO
    `;

    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(query);
        return result.rows.map((row) => ({
            IMAGEN_URL: row[0],
            NOMBRE: row[1],
            PRECIO_UNITARIO: row[2],
            ID_PRODUCTO: row[3], // Asegúrate de incluir este campo
        }));
    } catch (error) {
        console.error("Error al obtener los productos del carrito:", error);
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


async function deleteFromCart(productId) {
    const query = `
        DELETE FROM CARRITO_PRODUCTOS
        WHERE ID_PRODUCTO = :productId
    `;

    let connection;
    try {
        connection = await getConnection();
        await connection.execute(query, { productId }, { autoCommit: true });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
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


async function deleteUser(userId) {
    const query = `
        DELETE FROM PERSONA
        WHERE ID_USUARIO = :userId
    `;

    let connection;
    try {
        connection = await getConnection();
        await connection.execute(query, { userId }, { autoCommit: true });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
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

async function deleteProduct(productId) {
    const query = `
        DELETE FROM PRODUCTOS
        WHERE ID_PRODUCTO = :productId
    `;

    let connection;
    try {
        connection = await getConnection();
        await connection.execute(query, { productId }, { autoCommit: true });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
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


async function updateProduct(data) {
    const updateQuery = `
        UPDATE PRODUCTOS
        SET 
            NOMBRE = :nombre,
            DESCRIPCION = :descripcion,
            PRECIO = :precio,
            IMAGEN_URL = :imagen_url
        WHERE ID_PRODUCTO = :id
    `;

    let connection;
    try {
        connection = await getConnection();
        await connection.execute(updateQuery, data, { autoCommit: true });
        console.log("Producto actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
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



module.exports = { insertUser, insertProduct, searchProductsByCriteria, 
                   searchUsersByCriteria, getUserDetailsById, updateUser,
                   getTopSalesProducts, getProductDetailsById, addToCart,
                   getProductPrice, getCartItems, deleteFromCart, deleteUser,
                   deleteProduct, updateProduct };
