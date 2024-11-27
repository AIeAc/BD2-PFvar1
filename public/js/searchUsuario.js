document.getElementById("userSearchForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener los valores de los campos de búsqueda
    const nombre = document.getElementById("searchNombre").value;
    const apellidos = document.getElementById("searchApellidos").value;
    const email = document.getElementById("searchEmail").value;
    const tipoUsuario = document.getElementById("searchTipoUsuario").value;

    try {
        // Construir la URL de búsqueda con los parámetros
        let searchQuery = `http://localhost:3000/usuarios/search?`;

        if (nombre) searchQuery += `nombre=${encodeURIComponent(nombre)}&`;
        if (apellidos) searchQuery += `apellidos=${encodeURIComponent(apellidos)}&`;
        if (email) searchQuery += `email=${encodeURIComponent(email)}&`;
        if (tipoUsuario) searchQuery += `tipo_usuario=${encodeURIComponent(tipoUsuario)}&`;

        // Eliminar el último "&" sobrante
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
