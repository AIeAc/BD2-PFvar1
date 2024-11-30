document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Obtener los productos más vendidos desde el backend
        const response = await fetch("http://localhost:3000/productos/top-sales");
        const products = await response.json();

        const gallery = document.getElementById("topSalesGallery");
        gallery.innerHTML = ""; // Limpia la galería antes de llenarla

        if (products.length > 0) {
            products.forEach((product, index) => {
                // Crear elementos para cada producto
                const div = document.createElement("div");
                div.className = "gallery-item";

                const a = document.createElement("a");
                a.href = `../html/detallleProducto.html?id=${product.ID_PRODUCTO}`;  // Generar enlace dinámico

                const img = document.createElement("img");
                img.src = product.IMAGEN_URL; // Usar la URL de la imagen del producto
                img.alt = `Producto ${index + 1}`;

                // Añadir imagen al enlace y el enlace al div
                a.appendChild(img);
                div.appendChild(a);

                // Añadir el div a la galería
                gallery.appendChild(div);
            });
        } else {
            gallery.innerHTML = "<p>No se encontraron productos más vendidos.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los productos más vendidos:", error);
        const gallery = document.getElementById("topSalesGallery");
        gallery.innerHTML = "<p>Error al cargar los productos más vendidos.</p>";
    }
});
