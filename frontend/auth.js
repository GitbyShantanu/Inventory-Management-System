const API_AUTH = "http://127.0.0.1:8000/auth";

// BOUNCER (Smart Redirection)
// Agar user ke paas token hai, toh usko wapas dashboard par bhej do
if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}

// Check if redirected due to expired session
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("expired")) {
    const msgBox = document.getElementById("loginMessage");
    msgBox.style.color = "red";
    msgBox.innerText = "Your session has expired. Please log in again.";
}

// --- UI TOGGLE LOGIC ---
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault(); // Link ko page reload karne se roko
    loginSection.classList.add("d-none"); // Login chupao
    registerSection.classList.remove("d-none"); // Register dikhao
    document.getElementById("registerMessage").innerText = ""; // Purane messages clear karo
});

document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.classList.add("d-none"); // Register chupao
    loginSection.classList.remove("d-none"); // Login dikhao
    document.getElementById("loginMessage").innerText = ""; // Purane messages clear karo
});

// LOGIN LOGIC
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const msgBox = document.getElementById("loginMessage");

    msgBox.style.color = "blue";
    msgBox.innerText = "Checking credentials...";

    try {
        const res = await fetch(`${API_AUTH}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json(); // API response ko data me store kiya

        if (!res.ok) { 
            throw new Error(data.message || "Login failed!");
        }

        // Asli Jadoo Yahan Hai: Token ko browser mein save karo
        localStorage.setItem("token", data.access_token);
        
        msgBox.style.color = "green";
        msgBox.innerText = "Login successful! Going to dashboard...";
        
        // 1 second baad Dashboard par bhej do
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        msgBox.style.color = "red";
        msgBox.innerText = error.message;
    }
});


// REGISTER LOGIC
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("regName").value;
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const msgBox = document.getElementById("registerMessage");

    msgBox.style.color = "blue";
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

        // reset the form after successful registration
        document.getElementById("registerForm").reset();
        
        // Thodi der baad automatically Login screen par le aao
        setTimeout(() => {
            document.getElementById("showLogin").click();
        }, 1500);

    } catch (error) {
        msgBox.style.color = "red";
        msgBox.innerText = error.message;
    }
});


// --- THEME TOGGLE LOGIC ---
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