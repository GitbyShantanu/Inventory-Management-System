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
            // Change Role Button
            const roleBtn = document.createElement("button");
            const isTargetAdmin = user.role === "admin";
            roleBtn.className = `btn btn-sm border-0 me-1 hover-lift ${isTargetAdmin ? 'btn-outline-warning' : 'btn-outline-success'}`;
            roleBtn.title = isTargetAdmin ? "Demote to User" : "Promote to Admin";
            roleBtn.innerHTML = isTargetAdmin ? "<i class='bi bi-arrow-down-circle'></i>" : "<i class='bi bi-arrow-up-circle'></i>";
            roleBtn.addEventListener("click", () => changeUserRole(user.id, isTargetAdmin ? 'user' : 'admin', roleBtn));
            actionCell.appendChild(roleBtn);

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

async function changeUserRole(id, newRole, btn) {
    const actionText = newRole === "admin" ? "promote to Admin" : "demote to User";
    if (!confirm(`Are you sure you want to ${actionText} user ID ${id}?`)) return;

    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';

    try {
        const res = await fetch(`${API_USERS}/${id}/role?role=${newRole}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        
        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.message || "Failed to change user role");
        }
        showToast("User role updated successfully", "success");
        loadUsers();
    } catch (error) {
        console.error("Error changing role:", error);
        showToast(error.message || "Failed to change user role", "danger");
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
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

// ---------------- PROFILE MODAL ----------------
const profileModalOverlay = document.getElementById("profileModalOverlay");
const profileBtn = document.getElementById("profileBtn");

async function loadMyProfile() {
    document.getElementById("profileName").textContent = "Loading...";
    document.getElementById("profileUsername").textContent = "Loading...";
    document.getElementById("profileEmail").textContent = "Loading...";
    document.getElementById("profileRole").textContent = "Loading...";
    document.getElementById("profileRole").className = "badge bg-secondary";

    try {
        const res = await fetch(API_USERS + "/me", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "login.html?expired=true";
                return;
            }
            throw new Error("Failed to load profile");
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
        showToast("Failed to load profile", "danger");
        closeProfileModal();
    }
}

function openProfileModal() {
    profileModalOverlay.style.display = "flex";
    loadMyProfile();
}
function closeProfileModal() {
    profileModalOverlay.style.display = "none";
}
if (profileModalOverlay) profileModalOverlay.addEventListener("click", (e) => { if (e.target === profileModalOverlay) closeProfileModal(); });
if (profileBtn) profileBtn.addEventListener("click", openProfileModal);

loadUsers();