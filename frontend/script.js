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
    if (status === 400) return "Bad Request (400)";
    if (status === 409) return "Name already exists (409)";
    return `Unexpected error (${status})`;
}


// ---------------- TOAST ----------------
function showToast(message, type = "danger") {
    const toastEl = document.getElementById("toastBox");
    const msg = document.getElementById("toastMessage");

    msg.textContent = message;

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
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

        if (!res.ok) {
            const errData = await res.json().catch(() => null); // res may not always return json (e.g. 500 error), so catch parsing errors and return null instead 
            throw new Error((errData && errData.message) || handleError(res.status)); // if errData is null, then errData.message would throw an error, so we check if errData exists first before trying to access its message property. If errData is null, we skip accessing message and just call handleError with the status code. This prevents our error handling from breaking when the response doesn't contain valid JSON.
        }

        products = await res.json();
        renderTable(products);
        console.log("Products loaded:", products);

    } catch (error) {
        console.error(error);
        showToast("Failed to load products: " + error.message, "danger");
        table.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-triangle fs-4 d-block mb-2"></i>
                    Failed to connect to the server.
                </td>
            </tr>
        `;
    }
}


// ---------------- RENDER TABLE ----------------
function renderTable(data) { 
    table.innerHTML = "";

    // if no products, show empty state
    if (data.length === 0) { 
        table.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                    No products found
                </td>
            </tr>
        `;
        return;
    }

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
        name: nameField.value.trim(),
        description: descriptionField.value.trim(),
        price: parseFloat(priceField.value),
        quantity: parseInt(qtyField.value)
    };

    // Frontend Validation
    if (!body.name || !body.description) {
        showToast("Please enter a valid name and description.", "warning");
        return;
    }
    if (isNaN(body.price) || body.price <= 0) {
        showToast("Price must be greater than 0.", "warning");
        return;
    }
    if (isNaN(body.quantity) || body.quantity < 0) { //we allow quantity to be 0, but not negative
        showToast("Quantity cannot be negative.", "warning");
        return;
    }

    // Disable submit button and show loading state
    const submitBtn = document.getElementById("submit");
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Saving...';

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);  // res may not always return json (e.g. 500 error), so catch parsing errors and return null instead
            throw new Error((errData && errData.message) || handleError(res.status)); 
        } 

        const newProduct = await res.json();
        console.log("Product created:", newProduct);
        showToast("Product added successfully", "success");

        e.target.reset();
        loadProducts();

    } catch (error) {
        console.error(error);
        showToast("Failed to create product: "+error.message, "danger");
        table.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-triangle fs-4 d-block mb-2"></i>
                    Failed to connect to the server.
                </td>
            </tr>
        `;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});


// ---------------- UPDATE PRODUCT (MODAL) ----------------
async function updateProduct() {
    const id = idField.value;

    const body = {
        name: editName.value.trim(),
        description: editDesc.value.trim(),
        price: parseFloat(editPrice.value),
        quantity: parseInt(editQty.value)
    };

    // Frontend Validation
    if (!body.name || !body.description) {
        showToast("Please enter a valid name and description.", "warning");
        return;
    }
    if (isNaN(body.price) || body.price <= 0) {
        showToast("Price must be greater than 0.", "warning");
        return;
    }
    if (isNaN(body.quantity) || body.quantity < 0) { 
        showToast("Quantity cannot be negative.", "warning");
        return;
    }

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);  
            throw new Error((errData && errData.message) || handleError(res.status)); 
        }

        const updatedProduct = await res.json();
        console.log("Product updated:", updatedProduct);
        showToast("Product updated successfully", "success");
        
        closeModal();
        loadProducts();

    } catch (error) {
        console.error(error);
        showToast("Failed to update product: " + error.message, "danger");
    }
}

// ---------------- DELETE ----------------
async function deleteProduct(id) {
    if (!confirm(`Delete product with id: ${id}?`)) return;

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);  
            throw new Error((errData && errData.message) || handleError(res.status)); 
        }

        const result = await res.json();
        console.log("Product deleted:", result);
        showToast("Product deleted successfully", "success");
        loadProducts();

    } catch (error) {
        console.error(error);
        showToast("Failed to delete product: " + error.message, "danger");
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

    const filtered = products.filter(p => {
        return p.name.toLowerCase().includes(value) ||
               (p.description && p.description.toLowerCase().includes(value)) || // we check if description exists before trying to call toLowerCase on it
               p.id.toString().includes(value) ||
               p.price.toString().includes(value);
    });

    renderTable(filtered);
});


// ---------------- THEME TOGGLE ----------------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
    // Set Bootstrap theme attribute
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme); // Save preference
    
    if (theme === "dark") {
        themeIcon.className = "bi bi-sun-fill fs-5";
    } else {
        themeIcon.className = "bi bi-moon-fill fs-5";
    }
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    themeIcon.classList.add("rotate-effect");
    
    setTimeout(() => {
        setTheme(newTheme);
        themeIcon.classList.remove("rotate-effect");
    }, 150);
});

// ---------------- INIT ----------------
loadProducts();
console.log("App started...");