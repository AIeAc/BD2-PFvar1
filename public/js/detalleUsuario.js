const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

// Verificar que el ID existe
if (!userId) {
    document.getElementById("userDetails").innerHTML = "<p>Error: No se proporcionó un ID de usuario.</p>";
} else {
    // Cargar detalles del usuario
    fetch(`http://localhost:3000/usuarios/details?id=${userId}`)
        .then((response) => response.json())
        .then((user) => {
            console.log("Usuario recibido en el cliente:", user);

            // Mostrar detalles
            document.getElementById("userDetails").innerHTML = `
                <p><strong>Nombre:</strong> ${user.NOMBRE}</p>
                <p><strong>Apellidos:</strong> ${user.APELLIDOS}</p>
                <p><strong>Email:</strong> ${user.EMAIL}</p>
                <p><strong>Teléfono:</strong> ${user.TELEFONO}</p>
                <p><strong>Dirección:</strong> ${user.DIRECCION}</p>
                <p><strong>Tipo de Usuario:</strong> ${user.TIPO_USUARIO}</p>
            `;

            // Llenar formulario de edición
            document.getElementById("editNombre").value = user.NOMBRE;
            document.getElementById("editApellidos").value = user.APELLIDOS;
            document.getElementById("editEmail").value = user.EMAIL;
            document.getElementById("editTelefono").value = user.TELEFONO;
            document.getElementById("editDireccion").value = user.DIRECCION;
            document.getElementById("editTipoUsuario").value = user.TIPO_USUARIO;
        })
        .catch((error) => {
            console.error("Error al obtener los detalles del usuario:", error);
            document.getElementById("userDetails").innerHTML = "<p>Error al cargar los detalles del usuario.</p>";
        });
}

// Mostrar formulario de edición
document.getElementById("editButton").addEventListener("click", () => {
    document.getElementById("editFormContainer").style.display = "block";
});

// Enviar formulario de edición
document.getElementById("editUserForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedUser = {
        id: userId,
        nombre: document.getElementById("editNombre").value,
        apellidos: document.getElementById("editApellidos").value,
        email: document.getElementById("editEmail").value,
        telefono: document.getElementById("editTelefono").value,
        direccion: document.getElementById("editDireccion").value,
        tipo_usuario: document.getElementById("editTipoUsuario").value,
    };

    fetch(`http://localhost:3000/usuarios/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
    })
        .then((response) => response.json())
        .then((data) => {
            location.reload(); // Recargar la página para reflejar los cambios
        })
        .catch((error) => {
            console.error("Error al actualizar el usuario:", error);
            alert("Hubo un problema al actualizar el usuario.");
        });
});

// Manejar el botón "Eliminar Usuario"
document.getElementById("deleteUserBtn").addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                alert("Usuario eliminado exitosamente.");
                window.location.href = "/usuarios.html"; // Redirigir a la lista de usuarios
            } else {
                const error = await response.json();
                alert(`Error al eliminar el usuario: ${error.error}`);
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            alert("Hubo un problema al eliminar el usuario.");
        }
    }
});

