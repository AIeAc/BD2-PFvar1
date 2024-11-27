document.getElementById("productSearchForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchQuery = document.getElementById("searchProduct").value;

    try {
        const response = await fetch(`http://localhost:3000/productos/search?nombre=${encodeURIComponent(searchQuery)}`);
        const results = await response.json();

        const resultsList = document.getElementById("searchResults");
        resultsList.innerHTML = "";

        if (results.length > 0) {
            results.forEach((product) => {
                const li = document.createElement("li");
                li.textContent = `Nombre: ${product[0]}, Precio: ${product[1]}, Estado: ${product[2]}`;
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