const API_AUTH = "http://127.0.0.1:8000/auth";

// Route Guard (Smart Redirection)
// If the user already has a token, redirect them to the dashboard
if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}


// ---------------- SESSION EXPIRED LOGIC ----------------
const urlParams = new URLSearchParams(window.location.search); // create URLSearchParams object to easily access search query parameters
if (urlParams.get("expired")) {
    const msgBox = document.getElementById("loginMessage");
    msgBox.style.color = "red";
    msgBox.innerText = "Your session has expired. Please log in again.";
}


// ---------------- UI TOGGLE LOGIC ----------------
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    loginSection.classList.add("d-none"); // Hide login section
    registerSection.classList.remove("d-none"); // Show register section
    document.getElementById("registerMessage").innerText = ""; // Clear previous messages
});

document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.classList.add("d-none"); // Hide register section
    loginSection.classList.remove("d-none"); // Show login section
    document.getElementById("loginMessage").innerText = ""; // Clear previous messages
});


// ---------------- LOGIN LOGIC ----------------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const msgBox = document.getElementById("loginMessage");

    msgBox.style.color = "skyblue"; 
    msgBox.innerText = "Checking credentials...";

    try {
        const res = await fetch(`${API_AUTH}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json(); 

        if (!res.ok) { 
            throw new Error(data.message || "Login failed!");
        }

        // Save the JWT token in browser's local storage
        localStorage.setItem("token", data.access_token);

        // Save the user's role for role-based access in frontend. 
        localStorage.setItem("role", data.role);
        
        msgBox.style.color = "green";
        msgBox.innerText = "Login successful! Going to dashboard...";
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        msgBox.style.color = "red";
        if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
            msgBox.innerText = "Server is unreachable. Please ensure the backend is running.";
        } else {
            msgBox.innerText = error.message;
        }
    }
});


// ---------------- REGISTER LOGIC ----------------
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("regName").value;
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const msgBox = document.getElementById("registerMessage");

    msgBox.style.color = "skyblue";
    msgBox.innerText = "Creating account...";

    try {
        const res = await fetch(`${API_AUTH}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Registration failed!");
        }

        msgBox.style.color = "green";
        msgBox.innerText = "Account created! Now you can login.";

        // Reset the form after successful registration
        document.getElementById("registerForm").reset();
        
        // Automatically switch to login screen after a short delay
        setTimeout(() => {
            document.getElementById("showLogin").click();
        }, 1500);

    } catch (error) {
        msgBox.style.color = "red";
        if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
            msgBox.innerText = "Server is unreachable. Please ensure the backend is running.";
        } else {
            msgBox.innerText = error.message;
        }
    }
});


// ---------------- THEME TOGGLE LOGIC ----------------
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
    setTimeout(() => {
        setTheme(newTheme);
        themeIcon.classList.remove("rotate-effect");
    }, 150);
});