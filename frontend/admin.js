// STRICT BOUNCER: Only Admins allowed here
if (!localStorage.getItem("token") || localStorage.getItem("role") !== "admin") {
    window.location.href = "index.html";
}

// const API_USERS = "http://127.0.0.1:8000/users";
const API_USERS = "https://inventory-management-system-cjr4.onrender.com/users";
const tableBody = document.getElementById("usersTableBody");

function getToken() {
    return localStorage.getItem("token");
}

// Helper to decode JWT and get current user info safely
function getCurrentUser() {
    try {
        const payload = JSON.parse(atob(getToken().split('.')[1]));
        return payload;
    } catch (e) {
        return null;
    }
}

function showToast(message, type = "danger") {
    const toastEl = document.getElementById("toastBox");
    document.getElementById("toastMessage").textContent = message;
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

async function loadUsers() {
    // Show loading spinner while fetching
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-5 text-muted">
                <div class="spinner-border text-secondary" role="status"></div>
                <div class="mt-2 small fw-medium">Loading users...</div>
            </td>
        </tr>
    `;

    try {
        const res = await fetch(API_USERS, {
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
            throw new Error(`Failed to load users (${res.status})`);
        }

        const users = await res.json();
        renderUsersTable(users);
    } catch (error) {
        console.error("Error loading users:", error);
        showToast(error.message || "Failed to load users", "danger");
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Error loading users</td></tr>`;
    }
}

function renderUsersTable(users) {
    tableBody.innerHTML = "";

    const currentUser = getCurrentUser();

    if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No users found</td></tr>`;
        return;
    }

    users.forEach(user => {
        const row = document.createElement("tr");
        
        // Format role badge
        const roleBadgeClass = user.role === "admin" ? "bg-danger" : "bg-primary";
        const roleBadge = `<span class="badge ${roleBadgeClass}">${user.role.toUpperCase()}</span>`;

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || "-"}</td>
            <td class="fw-medium">${user.username}</td>
            <td>${user.email}</td>
            <td>${roleBadge}</td>
            <td class="text-nowrap"></td>
        `;

        const actionCell = row.querySelector("td:last-child");

        // Delete Button (Prevent deleting yourself using decoded JWT user_id)
        if (currentUser && user.id !== currentUser.user_id) { 
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-outline-danger btn-sm border-0 hover-lift";
            deleteBtn.title = "Delete User";
            deleteBtn.innerHTML = "<i class='bi bi-trash3'></i>";
            deleteBtn.addEventListener("click", () => deleteUser(user.id, deleteBtn));
            actionCell.appendChild(deleteBtn);
        }

        tableBody.appendChild(row);
    });
}

async function deleteUser(id, btn) {
    if (!confirm(`Are you sure you want to delete user with ID ${id}?`)) return;

    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';

    try {
        const res = await fetch(`${API_USERS}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (!res.ok) throw new Error("Failed to delete user");
        showToast("User deleted successfully", "success");
        loadUsers();
    } catch (error) {
        console.error("Error deleting user:", error);
        showToast(error.message || "Failed to delete user", "danger");
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
}

// Quick setup for Theme and Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
});

// ---------------- THEME TOGGLE ----------------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
    themeIcon.className = theme === "dark" ? "bi bi-sun-fill fs-5" : "bi bi-moon-fill fs-5";
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    themeIcon.classList.add("rotate-effect");
    setTimeout(() => { setTheme(newTheme); themeIcon.classList.remove("rotate-effect"); }, 150);
});

loadUsers();