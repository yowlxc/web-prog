const authSection = document.querySelector("#auth-section");
const authMessage = document.querySelector("#auth-message");
const userPanel = document.querySelector("#user-panel");
const loginView = document.querySelector("#login-view");
const registerView = document.querySelector("#register-view");

function showLoginForm() {
    loginView.classList.remove("hidden");
    registerView.classList.add("hidden");
}

document.querySelector("#btn-show-register").addEventListener("click", function() {
    authMessage.textContent = "";
    loginView.classList.add("hidden");
    registerView.classList.remove("hidden");
});

document.querySelector("#btn-back-login").addEventListener("click", function() {
    authMessage.textContent = "";
    showLoginForm();
});

async function showApp() {
    document.querySelector("#auth-loading").classList.remove("hidden");
    authSection.classList.add("hidden");
    document.querySelector("#current-user").textContent =
        currentUser.name + " (" + currentUser.role + ")";
    document.querySelector("#btn-add").classList.toggle("hidden", currentUser.role !== "ADMIN");
    await renderStudents();
    document.querySelector("#auth-loading").classList.add("hidden");
    userPanel.classList.remove("hidden");
    document.querySelector("#list-students").classList.remove("hidden");
}

function showAuth() {
    lastRenderRequest++;
    document.querySelector("#auth-loading").classList.add("hidden");
    showLoginForm();
    authSection.classList.remove("hidden");
    userPanel.classList.add("hidden");
    document.querySelector("#list-students").classList.add("hidden");
    document.querySelector("#form-students").classList.add("hidden");
    document.querySelector("#dosie-students").classList.add("hidden");
}

document.querySelector("#login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    authMessage.textContent = "";
    try {
        await loginUser(
            document.querySelector("#login").value,
            document.querySelector("#password").value
        );
        await showApp();
    } catch (error) {
        showAuth();
        authMessage.textContent = error.message;
    }
});

document.querySelector("#register-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    authMessage.textContent = "";
    try {
        await registerUser(
            document.querySelector("#register-name").value,
            document.querySelector("#register-login").value,
            document.querySelector("#register-password").value
        );
        showLoginForm();
        authMessage.textContent = "Регистрация завершена. Теперь войдите.";
    } catch (error) {
        authMessage.textContent = error.message;
    }
});

document.querySelector("#btn-logout").addEventListener("click", async function() {
    try {
        await logoutUser();
        showAuth();
    } catch (error) {
        authMessage.textContent = error.message;
    }
});

refreshAuth().then(showApp).catch(showAuth);
