document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>Error: No se proporcionó un ID de producto.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/productos/details?id=${productId}`);
        const product = await response.json();

        if (product) {
            document.getElementById("product-name").textContent = product.NOMBRE;
            document.getElementById("product-description").textContent = product.DESCRIPCION;
            document.getElementById("product-price").textContent = `Precio: $${product.PRECIO}`;
            document.getElementById("product-image").src = product.IMAGEN_URL;
            document.getElementById("product-image").alt = product.NOMBRE;
        } else {
            document.getElementById("product-details").innerHTML = "<p>Producto no encontrado.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los detalles del producto:", error);
        document.getElementById("product-details").innerHTML = "<p>Error al cargar los detalles del producto.</p>";
    }

    // Manejar el botón "Agregar al carrito"
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.addEventListener("click", async () => {
        try {
            const cartResponse = await fetch(`http://localhost:3000/carrito/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (cartResponse.ok) {
                showConfirmationMessage();
            } else {
                console.error("Error al agregar al carrito:", await cartResponse.text());
                alert("No se pudo agregar el producto al carrito.");
            }
        } catch (error) {
            console.error("Error al procesar la solicitud:", error);
            alert("Ocurrió un error al agregar al carrito.");
        }
    });

    const deleteProductBtn = document.getElementById("deleteProductBtn");
    deleteProductBtn.addEventListener("click", async () => {
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                const response = await fetch(`http://localhost:3000/productos/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId }),
                });

                if (response.ok) {
                    alert("Producto eliminado exitosamente.");
                    window.location.href = "/productos.html"; // Redirigir a la lista de productos
                } else {
                    const error = await response.json();
                    alert(`Error al eliminar el producto: ${error.error}`);
                }
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Hubo un problema al eliminar el producto.");
            }
        }
    });
});

// Mostrar mensaje de confirmación
function showConfirmationMessage() {
    const confirmationMessage = document.getElementById("confirmationMessage");
    confirmationMessage.classList.remove("hidden");
    confirmationMessage.classList.add("visible");

    setTimeout(() => {
        confirmationMessage.classList.remove("visible");
        confirmationMessage.classList.add("hidden");
    }, 3000); // El mensaje desaparece después de 3 segundos
}
