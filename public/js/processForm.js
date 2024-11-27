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
  