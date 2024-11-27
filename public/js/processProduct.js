document.getElementById("productForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: parseFloat(document.getElementById("precio").value),
        id_categoria: parseInt(document.getElementById("id_categoria").value),
        sku: document.getElementById("sku").value,
        talla: document.getElementById("talla").value,
        color: document.getElementById("color").value,
        imagen_url: document.getElementById("imagen_url").value,
        estado: document.getElementById("estado").value,
    };

    try {
        const response = await fetch("http://localhost:3000/registerProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        const message = document.getElementById("responseMessage");
        if (response.ok) {
            message.textContent = "Producto registrado exitosamente.";
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
