
const btnAdd = document.querySelector("#btn-add");
const btnCancel = document.querySelector("#btn-cancel");
const listStudents = document.querySelector("#list-students");
const formStudents = document.querySelector("#form-students");
const filterButton = document.querySelector("#btn-filter");
const filterResetButton = document.querySelector("#btn-reset-filter");

const authScreen = document.querySelector("#auth-screen");
const loginPanel = document.querySelector("#login-panel");
const registerPanel = document.querySelector("#register-panel");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const authMessage = document.querySelector("#auth-message");

const sessionBar = document.querySelector("#session-bar");
const currentUser = document.querySelector("#current-user");
const logoutButton = document.querySelector("#btn-logout");
const appMessage = document.querySelector("#app-message");
const detailsSection = document.querySelector("#dosie-students");

function showAuthMessage(message, success = false) {
    authMessage.textContent = message;
    authMessage.classList.toggle("success", success);
    authMessage.classList.remove("hidden");
}

function clearAuthMessage() {
    authMessage.textContent = "";
    authMessage.classList.add("hidden");
    authMessage.classList.remove("success");
}

function showAuthPanel(panel) {
    loginPanel.classList.toggle("hidden", panel !== "login");
    registerPanel.classList.toggle("hidden", panel !== "register");
    clearAuthMessage();
}

function showAuthScreen(message = "", success = false) {
    authScreen.classList.remove("hidden");
    listStudents.classList.add("hidden");
    formStudents.classList.add("hidden");
    detailsSection.classList.add("hidden");
    sessionBar.classList.add("hidden");

    showAuthPanel("login");

    if (message) {
        showAuthMessage(message, success);
    }
}

function showAppMessage(message = "") {
    appMessage.textContent = message;
    appMessage.classList.toggle("hidden", !message);
}

async function loadStudents(params = currentFilters) {
    try {
        await renderStudents(params);
        showAppMessage();
    } catch (error) {
        showAppMessage(`Не удалось загрузить студентов: ${error.message}`);
    }
}

async function showAuthenticatedApp() {
    const user = window.authState?.user;

    if (!user) {
        showAuthScreen();
        return;
    }

    authScreen.classList.add("hidden");
    listStudents.classList.remove("hidden");
    formStudents.classList.add("hidden");
    detailsSection.classList.add("hidden");
    sessionBar.classList.remove("hidden");

    currentUser.textContent = `${user.name} (${user.role})`;

    const isAdmin = user.role === "ADMIN";
    btnAdd.closest(".btn-add").classList.toggle("hidden", !isAdmin);

    currentPage = 0;
    await loadStudents({});
}

document.querySelector("#sort-by").addEventListener("change", () => {
    currentPage = 0;
    loadStudents();
});

document.querySelector("#sort-dir").addEventListener("change", () => {
    currentPage = 0;
    loadStudents();
});

document.querySelector("#page-prev").addEventListener("click", () => {
    if (currentPage > 0) currentPage--;
    loadStudents();
});

document.querySelector("#page-next").addEventListener("click", () => {
    currentPage++;
    loadStudents();
});

// Переключение между входом и регистрацией
document.querySelector("#btn-show-register").addEventListener("click", () => {
    showAuthPanel("register");
});

document.querySelector("#btn-show-login").addEventListener("click", () => {
    showAuthPanel("login");
});

// Вход
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessage();

    const login = document.querySelector("#login-login").value.trim();
    const password = document.querySelector("#login-password").value;
    const button = loginForm.querySelector('[type="submit"]');

    button.disabled = true;

    try {
        await loginUser(login, password);
        loginForm.reset();
        await showAuthenticatedApp();
    } catch (error) {
        showAuthMessage(error.message);
    } finally {
        button.disabled = false;
    }
});

// Регистрация
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessage();

    const name = document.querySelector("#register-name").value.trim();
    const login = document.querySelector("#register-login").value.trim();
    const password = document.querySelector("#register-password").value;
    const button = registerForm.querySelector('[type="submit"]');

    button.disabled = true;

    try {
        await registerUser(name, login, password);

        registerForm.reset();

        // После регистрации пользователь сам входит в систему.
        document.querySelector("#login-login").value = login;
        showAuthPanel("login");

        showAuthMessage(
            "Регистрация прошла успешно! Теперь войдите в систему.",
            true
        );
    } catch (error) {
        showAuthMessage(error.message);
    } finally {
        button.disabled = false;
    }
});

// Выход
logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    try {
        await logoutUser();
        showAuthScreen("Вы вышли из системы.", true);
    } catch (error) {
        showAuthScreen(
            `Сессия завершена локально, но сервер не подтвердил выход: ${error.message}`
        );
    } finally {
        logoutButton.disabled = false;
    }
});

// Добавление студента
btnAdd.addEventListener("click", () => {
    if (window.authState?.user?.role !== "ADMIN") {
        showAppMessage("Добавлять студентов может только администратор.");
        return;
    }

    editingIsu = null;

    const form = formStudents.querySelector("form");
    form.reset();

    document.querySelector("#isu").readOnly = false;

    [
        "fio-error",
        "group-error",
        "isu-error",
        "dorm-error",
        "room-error",
        "date-error"
    ].forEach((id) => {
        document.getElementById(id).textContent = "";
    });

    formStudents.querySelector("h2").textContent = "Форма добавления студента";

    showAppMessage();
    listStudents.classList.add("hidden");
    formStudents.classList.remove("hidden");
});

// Отмена добавления или редактирования
btnCancel.addEventListener("click", () => {
    formStudents.classList.add("hidden");
    listStudents.classList.remove("hidden");

    formStudents.querySelector("h2").textContent =
        "Форма редактирования студента";
});

// Применение фильтров
filterButton.addEventListener("click", async () => {
    const params = {};

    const fio = document.querySelector("#filter-fio").value.trim();
    const group = document.querySelector("#filter-group").value.trim();
    const isu = document.querySelector("#filter-isu").value.trim();
    const dormitory = document.querySelector("#filter-dormitory").value.trim();
    const foreign = document.querySelector("#filter-foreign").checked;
    const roomMin = document.querySelector("#filter-room-min").value;
    const roomMax = document.querySelector("#filter-room-max").value;

    if (fio) params.fio = fio;
    if (group) params.group = group;
    if (isu) params.isu = isu;
    if (dormitory) params.dormNumber = Number(dormitory);
    if (foreign) params.isForeign = true;
    if (roomMin) params.roomMin = Number(roomMin);
    if (roomMax) params.roomMax = Number(roomMax);

    currentPage = 0;
    await loadStudents(params);
});

// Сброс фильтров
filterResetButton.addEventListener("click", async () => {
    [
        "filter-fio",
        "filter-group",
        "filter-isu",
        "filter-dormitory",
        "filter-room-min",
        "filter-room-max"
    ].forEach((id) => {
        document.getElementById(id).value = "";
    });

    document.querySelector("#filter-foreign").checked = false;

    currentPage = 0;
    await loadStudents({});
});

// При открытии страницы восстанавливаем сессию
async function initializeApp() {
    formStudents.classList.add("hidden");
    detailsSection.classList.add("hidden");

    formStudents.querySelector("form").reset();

    const user = await restoreSession();

    if (user) {
        await showAuthenticatedApp();
    } else {
        showAuthScreen();
    }
}

initializeApp();
