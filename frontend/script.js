const API = "http://127.0.0.1:8000/products";

const nameField = document.querySelector("#productName");
const descriptionField = document.querySelector("#description");
const priceField = document.querySelector("#price");
const qtyField = document.querySelector("#qty");

const table = document.querySelector("#tableBody");
const searchInput = document.querySelector("#searchInput");
const overlay = document.getElementById("modalOverlay");

// Modal fields
const idField = document.getElementById("idField");
const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const editPrice = document.getElementById("editPrice");
const editQty = document.getElementById("editQty");

let products = [];


// ---------------- ERROR HANDLING ----------------
function handleError(status) {
    if (status === 404) return "Resource not found (404)";
    if (status === 405) return "Method not allowed (405)";
    if (status === 422) return "Validation error (422)";
    if (status === 500) return "Server error (500)";
    return `Unexpected error (${status})`;
}


// ---------------- MODAL ----------------
function openModal(product) {
    overlay.style.display = "flex";

    idField.value = product.id;
    editName.value = product.name;
    editDesc.value = product.description;
    editPrice.value = product.price;
    editQty.value = product.quantity;
}

function closeModal() {
    overlay.style.display = "none";
}

// click outside modal
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(); 
});


// ---------------- LOAD PRODUCTS ----------------
async function loadProducts() {
    try {
        const res = await fetch(`${API}/?limit=100`);
        if (!res.ok) throw new Error(handleError(res.status));

        products = await res.json();
        renderTable(products);

        console.log("Products loaded...");
    } catch (error) {
        console.error(error);
        alert("Failed to load products");
    }
}


// ---------------- RENDER TABLE ----------------
function renderTable(data) { 
    table.innerHTML = "";

    data.forEach(p => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.description}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td></td>
        `;

        const actionCell = row.querySelector("td:last-child");

        // EDIT
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-warning me-2";
        // editBtn.innerText = "Edit";
        editBtn.innerHTML = "<i class='bi bi-pencil-fill'></i>";    
        editBtn.addEventListener("click", () => openModal(p));

        // DELETE
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger";
        // deleteBtn.innerText = "Delete";
        deleteBtn.innerHTML = "<i class='bi bi-trash'></i>";

        deleteBtn.addEventListener("click", () => deleteProduct(p.id));

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        table.appendChild(row);
    });
}


// ---------------- CREATE PRODUCT ----------------
document.querySelector("#productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: nameField.value,
        description: descriptionField.value,
        price: priceField.value,
        quantity: qtyField.value
    };

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(handleError(res.status));

        const newProduct = await res.json();
        console.log("Product created:", newProduct);
        alert("Product added successfully");
        e.target.reset();
        loadProducts();

    } catch (error) {
        console.error(error);
        alert("Failed to create product");
    }
});


// ---------------- UPDATE PRODUCT (MODAL) ----------------
async function updateProduct() {
    const id = idField.value;

    const body = {
        name: editName.value,
        description: editDesc.value,
        price: editPrice.value,
        quantity: editQty.value
    };

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(handleError(res.status));

        const updatedProduct = await res.json();
        console.log("Product updated:", updatedProduct);
        alert("Product updated successfully");
        
        closeModal();
        loadProducts();

    } catch (error) {
        console.error(error);
        alert("Failed to update product");
    }
}

// ---------------- DELETE ----------------
async function deleteProduct(id) {
    if (!confirm(`Delete product with id: ${id}?`)) return;

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error(handleError(res.status));

        const result = await res.json();
        console.log("Product deleted:", result);
        alert("Product deleted successfully");
        loadProducts();

    } catch (error) {
        console.error(error);
        alert("Failed to delete product");
    }
}

function clearForm() {
    nameField.value = "";
    descriptionField.value = "";
    priceField.value = "";
    qtyField.value = "";    
}


// ---------------- SEARCH ----------------
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value)
    );

    renderTable(filtered);
});


// ---------------- INIT ----------------
loadProducts();
console.log("App started...");