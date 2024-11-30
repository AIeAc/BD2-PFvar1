document.getElementById("productSearchForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Capturar valores de los campos de búsqueda
    const searchQuery = document.getElementById("searchProduct").value.trim(); // Elimina espacios en blanco
    const searchTalla = document.getElementById("searchTalla").value.trim();
    const searchColor = document.getElementById("searchColor").value.trim();

    // Construir la URL con parámetros opcionales
    const params = new URLSearchParams();
    if (searchQuery) params.append("nombre", searchQuery);
    if (searchTalla) params.append("talla", searchTalla);
    if (searchColor) params.append("color", searchColor);

    try {
        const response = await fetch(`http://localhost:3000/productos/search?${params.toString()}`);
        const results = await response.json();

        const resultsList = document.getElementById("searchResults");
        resultsList.innerHTML = "";

        if (results.length > 0) {
            results.forEach((product) => {
                const li = document.createElement("li");
                const link = document.createElement("a");

                link.href = `../html/detallleProducto.html?id=${product[0]}`; // product[0] es ID_PRODUCTO
                link.textContent = `Nombre: ${product[1]}, Precio: ${product[2]}, Estado: ${product[3]}`;
                link.style.textDecoration = "none";
                link.style.color = "blue";

                li.appendChild(link);
                resultsList.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No se encontraron productos.";
            resultsList.appendChild(li);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        const resultsList = document.getElementById("searchResults");
        resultsList.innerHTML = "<li>Error al buscar productos. Verifica la consola para más detalles.</li>";
    }
});
