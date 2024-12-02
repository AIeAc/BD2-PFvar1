document.getElementById("registrationForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {
    nombre: document.getElementById("nombre").value,
    apellidos: document.getElementById("apellidos").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    contrasena: document.getElementById("contrasena").value,
    tipo_usuario: document.getElementById("tipo_usuario").value,
  };

  try {
    const response = await fetch("http://localhost:3000/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    const message = document.getElementById("responseMessage");
    if (response.ok) {
      message.textContent = "Usuario registrado exitosamente.";
      message.style.color = "green";
    } else {
      message.textContent = `Error: ${result.error}`;
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("responseMessage").textContent =
      "Ocurrió un error al procesar la solicitud.";
    document.getElementById("responseMessage").style.color = "red";
  }
});

document.getElementById("buscarUsuario").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const email = document.getElementById("email").value;
  const tipoUsuario = document.getElementById("tipo_usuario").value;

  try {
    let searchQuery = `http://localhost:3000/usuarios/search?`;

    if (nombre) searchQuery += `nombre=${encodeURIComponent(nombre)}&`;
    if (apellidos) searchQuery += `apellidos=${encodeURIComponent(apellidos)}&`;
    if (email) searchQuery += `email=${encodeURIComponent(email)}&`;
    if (tipoUsuario) searchQuery += `tipo_usuario=${encodeURIComponent(tipoUsuario)}&`;

    // Eliminar el último "&"
    if (searchQuery.endsWith("&")) {
      searchQuery = searchQuery.slice(0, -1);
    }

    const response = await fetch(searchQuery);
    const results = await response.json();

    const resultsList = document.getElementById("userSearchResults");
    resultsList.innerHTML = "";

    if (results.length > 0) {
      results.forEach((user) => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        // URL con el ID del usuario como parámetro de consulta
        a.href = `detalleUsuario.html?id=${user[0]}`; // user[0] es el ID del usuario
        a.textContent = `Nombre: ${user[1]} ${user[2]}, Email: ${user[3]}`;

        li.appendChild(a);
        resultsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No se encontraron usuarios.";
      resultsList.appendChild(li);
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    const resultsList = document.getElementById("userSearchResults");
    resultsList.innerHTML = "<li>Error al buscar usuarios. Verifica la consola para más detalles.</li>";
  }
});
