// Helper function to get token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

// Helper function to get user role from localStorage
function getRole() {
    return localStorage.getItem("role");
}

// const API = "http://127.0.0.1:8000/products";
const API = "https://inventory-management-system-cjr4.onrender.com/products"; 

const nameField = document.querySelector("#productName");
const descriptionField = document.querySelector("#description");
const priceField = document.querySelector("#price");
const qtyField = document.querySelector("#qty");

const table = document.querySelector("#tableBody");
const searchInput = document.querySelector("#searchInput");
const overlay = document.getElementById("modalOverlay");
const profileModalOverlay = document.getElementById("profileModalOverlay");
const profileBtn = document.getElementById("profileBtn");

// Modal fields
const idField = document.getElementById("idField");
const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const editPrice = document.getElementById("editPrice");
const editQty = document.getElementById("editQty");

let products = [];
let searchQuery = "";
let currentPage = 1;
const limit = 10;
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");


// ---------------- UI ROLE ENFORCEMENT ----------------
const formColumn = document.getElementById("formColumn");
const tableColumn = document.getElementById("tableColumn");
const actionsHeader = document.getElementById("actionsHeader");

if (getRole() !== "admin") {
    // in index.html Hide form, expand table to full width, hide action column header
    if (formColumn) formColumn.style.display = "none";  
    if (tableColumn) {
        tableColumn.classList.remove("col-md-9");
        tableColumn.classList.add("col-md-12");
    }
    if (actionsHeader) actionsHeader.style.display = "none";
} else {
    const adminUsersLink = document.getElementById("adminUsersLink");
    if (adminUsersLink) adminUsersLink.classList.remove("d-none");
}


// ---------------- ERROR HANDLING ----------------
function handleError(error, status) { // error recieve when fetch itself fails (e.g. network error), status recive when we get a response but it's an error status code (e.g. 500)
    // Detect generic fetch failure (usually means server is down)
    // This must come first, as there might not be a status code for a network error
    if (error && (error.message === "Failed to fetch" || error.message.includes("NetworkError"))) {
        return "Server is unreachable. Please ensure the backend server is running.";
    }

    // If not a network error, then check status codes for API-specific errors
    if (status === 405) return "Method not allowed (405)";
    if (status === 422) return "Validation error (422)";
    if (status === 500) return "Server error (500)";
    if (status === 400) return "Bad Request (400)";
    
    // If we have an error object with a message (like the backend error we threw), return it
    if (error && error.message) return error.message;
    if (!status) return "An unexpected error occurred."; // Fallback for no status and not a network error and dont have error message. 
    return `Unexpected error (${status})`; // Fallback for any other status codes we haven't explicitly handled
}


// ---------------- TOAST ----------------
function showToast(message, type = "danger") {
    const toastEl = document.getElementById("toastBox");
    const msg = document.getElementById("toastMessage");

    msg.textContent = message;

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;

    const toast = new bootstrap.Toast(toastEl); // we are creating a new instance of the toast every time we show it, which allows us to reset the timer if the same toast is triggered multiple times in a row. If we reused the same instance, triggering the toast again while it's already visible would not reset the timer, and the toast would disappear after the original duration instead of staying visible for the full duration from the last trigger.
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


// ---------------- PROFILE MODAL ----------------
async function loadMyProfile() {
    // Reset fields to loading state
    document.getElementById("profileName").textContent = "Loading...";
    document.getElementById("profileUsername").textContent = "Loading...";
    document.getElementById("profileEmail").textContent = "Loading...";
    document.getElementById("profileRole").textContent = "Loading...";
    document.getElementById("profileRole").className = "badge bg-secondary";

    // const API_PROFILE = "http://127.0.0.1:8000/users/me";
    const API_PROFILE = "https://inventory-management-system-cjr4.onrender.com/users/me";
    try {
        const res = await fetch(API_PROFILE, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "login.html?expired=true";
                return;
            }
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.message || handleError(null, res.status));
        }

        const user = await res.json();
        
        document.getElementById("profileName").textContent = user.name || "N/A";
        document.getElementById("profileUsername").textContent = user.username;
        document.getElementById("profileEmail").textContent = user.email;
        
        const roleBadge = document.getElementById("profileRole");
        roleBadge.textContent = user.role.toUpperCase();
        roleBadge.className = user.role === 'admin' ? 'badge bg-danger' : 'badge bg-primary';

    } catch (error) {
        console.error("Error loading profile:", error);
        showToast("Failed to load profile: " + handleError(error, null), "danger");
        closeProfileModal();
    }
}

// when profile button is clicked, open profile modal and load profile data
function openProfileModal() {
    profileModalOverlay.style.display = "flex";
    loadMyProfile(); // Fetch fresh data every time modal is opened
}

function closeProfileModal() {
    profileModalOverlay.style.display = "none";
}

// click outside profile modal
profileModalOverlay.addEventListener("click", (e) => {
    if (e.target === profileModalOverlay) closeProfileModal(); 
});

// if we are on dashboard and have profile button, add event listener to open profile modal when clicked
if (profileBtn) {
    profileBtn.addEventListener("click", openProfileModal);
}


// ---------------- LOAD PRODUCTS ----------------
async function loadProducts(page = 1) {
    currentPage = page;

    // Show loading spinner while fetching
    const colspan = getRole() === "admin" ? "6" : "5";
    table.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="text-center py-5 text-muted">
                <div class="spinner-border text-secondary" role="status"></div>
                <div class="mt-2 small fw-medium">Loading products...</div>
            </td>
        </tr>
    `;

    try {
        // Construct URL with pagination and search parameters
        let url = `${API}/?page=${currentPage}&limit=${limit}`;
        if (searchQuery) {
            // We use encodeURIComponent to ensure that any special characters in the search query (like spaces, &, ?, etc.) are properly encoded in the URL, preventing potential issues with the request. This is important for ensuring that the backend receives the search query correctly, especially if it contains characters that have special meanings in URLs.
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        
        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        }); 

        if (!res.ok) {
            if (res.status === 401) { // If token has expired or is invalid
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "login.html?expired=true"; // Redirect to login with expired query param to show session expired message
                return; // Stop further execution of this function since we're redirecting the user to login page
            }

            const errData = await res.json().catch(() => null); // res may not always return json (e.g. 500 error), so catch parsing errors and return null instead.
            throw new Error(errData?.message || handleError(null, res.status)); // Optional chaining (?.) safely attempts to read message. If errData is null, it gracefully returns undefined without crashing.
        } 

        products = await res.json();
        renderTable(products);
        console.log("Products loaded:", products);

        // Update Pagination UI
        pageInfo.textContent = `Page ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = products.length < limit; // Disable next if we didn't get a full page of results
    } catch (error) {
        console.error("Error loading products:", error);
        showToast("Failed to load products: " + handleError(error, null), "danger");
        
        // Show error message in table as well for better visibility.
        const colspan = getRole() === "admin" ? "6" : "5";
        table.innerHTML = ` 
            <tr>
                <td colspan="${colspan}" class="text-center py-4 text-danger">
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
        const colspan = getRole() === "admin" ? "6" : "5";
        table.innerHTML = `
            <tr>
                <td colspan="${colspan}" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-4 d-block mb-2"></i>
                    No products found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(p => {
        const row = document.createElement("tr");
        const isAdmin = getRole() === "admin";

        let htmlContent = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.description}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
        `;

        if (isAdmin) {
            htmlContent += '<td class="text-nowrap"></td>'; // empty action cell
        }
        row.innerHTML = htmlContent;

        // Only create and append action buttons if the user is admin
        if (isAdmin) {
            const actionCell = row.querySelector("td:last-child"); // Select the last cell
            
            const editBtn = document.createElement("button");
            editBtn.className = "btn btn-outline-primary btn-sm border-0 me-1 hover-lift";
            editBtn.title = "Edit";
            editBtn.innerHTML = "<i class='bi bi-pencil-square'></i>";    
            editBtn.addEventListener("click", () => openModal(p));
            
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-outline-danger btn-sm border-0 hover-lift";
            deleteBtn.title = "Delete";
            deleteBtn.innerHTML = "<i class='bi bi-trash3'></i>";
            deleteBtn.addEventListener("click", () => deleteProduct(p.id, deleteBtn));
            
            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
        }

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
    if (!body.name) {
        showToast("Please enter a valid name.", "warning");
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
        // await new Promise(resolve => setTimeout(resolve, 500)); // Artificial delay for UX presentation

        const res = await fetch(API, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) { // server connected but returned an error status code
            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "login.html?expired=true";
                return;
            }
            const errData = await res.json().catch(() => null);  // res may not always return json (e.g. 500 error), so catch parsing errors and return null instead
            // if errorData exist, wrap its msg in Error & throw it to catch block with the message from backend, otherwise handleError will generate a message based on the status code
            throw new Error(errData?.message || handleError(null, res.status));
        } 

        const newProduct = await res.json();
        console.log("Product created:", newProduct);
        showToast("Product added successfully", "success");
        e.target.reset(); 
        loadProducts(currentPage); // Reload current page to preserve UI state

        // Auto-close form on mobile screens (less than 768px)
        if (window.innerWidth < 768) {
            const formCollapseEl = document.getElementById("productFormCollapse");
            if (formCollapseEl) {
                const bsCollapse = bootstrap.Collapse.getInstance(formCollapseEl);
                if (bsCollapse) bsCollapse.hide();
            }
        }
    } catch (error) {
        console.error("Error creating product:", error);
        showToast("Failed to create product: " + handleError(error, null), "danger"); // pass error object to handleError in case it's a network error, and pass null for status since we don't have a response status code in that case
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
    if (!body.name) {
        showToast("Please enter a valid name", "warning");
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

    // Disable update button and show loading state
    const updateBtn = document.getElementById("updateBtn");
    const originalText = updateBtn.innerHTML;
    updateBtn.disabled = true;
    updateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Updating...';

    try {
        // await new Promise(resolve => setTimeout(resolve, 500)); // Artificial delay for UX presentation

        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "login.html?expired=true";
                return;
            }
            const errData = await res.json().catch(() => null);  
            throw new Error(errData?.message || handleError(null, res.status));
        }

        const updatedProduct = await res.json();
        console.log("Product updated:", updatedProduct);
        showToast("Product updated successfully", "success");
        
        closeModal();
        loadProducts(currentPage);

    } catch (error) {
        console.error("Error updating product:", error);
        showToast("Failed to update product: " + handleError(error, null), "danger");
    } finally {
        updateBtn.disabled = false;
        updateBtn.innerHTML = originalText;
    }
}

// Add event listener for the modal form submission
document.getElementById("editProductForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    updateProduct();
});


// ---------------- DELETE ----------------
async function deleteProduct(id, btn) {
    if (!confirm(`Delete product with id: ${id}?`)) return;

    // Show loading state specifically on the clicked delete button
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';

    try {
        // await new Promise(resolve => setTimeout(resolve, 500)); // Artificial delay for UX presentation

        const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "login.html?expired=true";
                return;
            }
            const errData = await res.json().catch(() => null);  
            throw new Error(errData?.message || handleError(null, res.status));
        }

        const result = await res.json();
        console.log("Product deleted:", result);
        showToast("Product deleted successfully", "success");
        loadProducts(currentPage);
    } catch (error) {
        console.error("Error deleting product:", error);
        showToast("Failed to delete product: " + handleError(error, null), "danger");
        // Only re-enable the button if delete failed (if it succeeds, the entire table re-renders anyway)
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function clearForm() {
    nameField.value = "";
    descriptionField.value = "";
    priceField.value = "";
    qtyField.value = "";    
}


// ---------------- SEARCH ----------------
let searchTimeout = null;

searchInput.addEventListener("input", () => { 
    clearTimeout(searchTimeout); // 1. Cancel the previous timer if they are still typing
    
    searchTimeout = setTimeout(() => { // 2. Start a new timer for 300ms
        searchQuery = searchInput.value.trim();
        loadProducts(1); // Fetch new results from backend starting at page 1
    }, 300); // 300 milliseconds
});


// ---------------- PAGINATION ----------------
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) loadProducts(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
    loadProducts(currentPage + 1);
});


// ---------------- THEME TOGGLE ----------------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
    // Set Bootstrap theme attribute
    document.documentElement.setAttribute("data-bs-theme", theme); // It sets the data-bs-theme attribute on the root html element to either "light" or "dark". Bootstrap's CSS uses this attribute to apply the corresponding theme styles throughout the page. By changing this attribute, we can toggle between light and dark themes without needing to reload the page or change any other classes.
    localStorage.setItem("theme", theme); // Save preference in browser storage so after reload, theme remains the same
    
    if (theme === "dark") {
        themeIcon.className = "bi bi-sun-fill fs-5";
    } else {
        themeIcon.className = "bi bi-moon-fill fs-5";
    }
}

// On page load, set theme based on saved preference or default to light
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

// Add click event to toggle theme
themeToggle.addEventListener("click", () => { // When the theme toggle button is clicked, we determine the current theme by checking the data-bs-theme attribute on the root html element. We then decide what the new theme should be (if current is dark, switch to light; if current is light, switch to dark). We add a rotate effect class to the icon for a nice visual transition, and after a short delay (150ms), we call setTheme with the new theme and remove the rotate effect class.
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark"; // if current theme is dark, we want to switch to light, otherwise switch to dark
    
    themeIcon.classList.add("rotate-effect");
    
    setTimeout(() => {
        setTheme(newTheme);
        themeIcon.classList.remove("rotate-effect");
    }, 150);
});


// ---------------- LOGOUT ----------------
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("role"); 
    window.location.href = "login.html"; 
});

// ---------------- INIT ----------------
loadProducts();
console.log("App started...");