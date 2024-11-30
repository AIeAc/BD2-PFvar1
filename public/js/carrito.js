document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Obtener los productos del carrito desde el backend
        const response = await fetch("http://localhost:3000/carrito");
        const cartItems = await response.json();

        const cartList = document.getElementById("cart-list");
        cartList.innerHTML = ""; // Limpia la lista antes de llenarla

        if (cartItems.length > 0) {
            cartItems.forEach((item) => {
                const li = document.createElement("li");

                const img = document.createElement("img");
                img.src = item.IMAGEN_URL;
                img.alt = item.NOMBRE;

                const infoDiv = document.createElement("div");
                infoDiv.className = "cart-item-info";

                const name = document.createElement("span");
                name.className = "cart-item-name";
                name.textContent = item.NOMBRE;

                const price = document.createElement("span");
                price.className = "cart-item-price";
                price.textContent = `Precio: $${item.PRECIO_UNITARIO}`;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Eliminar";
                deleteBtn.className = "delete-btn";

                // Verificar que el ID_PRODUCTO exista antes de añadir la acción
                if (!item.ID_PRODUCTO) {
                    console.error("El producto no tiene un ID definido:", item);
                } else {
                    deleteBtn.addEventListener("click", async () => {
                        try {
                            const deleteResponse = await fetch(`http://localhost:3000/carrito/delete`, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productId: item.ID_PRODUCTO }), // Enviar el ID_PRODUCTO correcto
                            });

                            if (deleteResponse.ok) {
                                //alert("Producto eliminado del carrito.");
                                li.remove(); // Eliminar el producto de la interfaz
                            } else {
                                const error = await deleteResponse.json();
                                console.error("Error al eliminar el producto:", error);
                                //alert(`No se pudo eliminar el producto: ${error.error}`);
                            }
                        } catch (error) {
                            console.error("Error al procesar la eliminación:", error);
                            //alert("Ocurrió un error al eliminar el producto.");
                        }
                    });
                }

                infoDiv.appendChild(name);
                infoDiv.appendChild(price);

                li.appendChild(img);
                li.appendChild(infoDiv);
                li.appendChild(deleteBtn);
                cartList.appendChild(li);
            });
        } else {
            cartList.innerHTML = "<p>No hay productos en el carrito.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los productos del carrito:", error);
        const cartList = document.getElementById("cart-list");
        cartList.innerHTML = "<p>Error al cargar los productos del carrito.</p>";
    }
});
