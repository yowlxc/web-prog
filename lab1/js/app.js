const btnAdd = document.querySelector("#btn-add");
const btnCancel = document.querySelector("#btn-cancel");
const listStudents = document.querySelector("#list-students");
const formStudents = document.querySelector("#form-students");

renderStudents();

btnAdd.addEventListener("click", function() {
    const form = formStudents.querySelector("form");
    form.reset();
    listStudents.classList.add("hidden");
    formStudents.classList.remove("hidden");
});

btnCancel.addEventListener("click", function() {
    formStudents.classList.add("hidden");
    listStudents.classList.remove("hidden");
});

const addButton = document.querySelector("#btn-add");

addButton.addEventListener("click", function() {
    // режим добавления
    editingIsu = null;

    // очищаем форму
    document.getElementById("fio").value = "";
    document.getElementById("group").value = "";
    document.getElementById("isu").value = "";
    document.getElementById("num-dorm").value = "";
    document.getElementById("num-room").value = "";
    document.getElementById("date-in-dorm").value = "";
    document.getElementById("no-rus").checked = false;
    document.getElementById("notes").value = "";

    // ИСУ можно вводить
    document.getElementById("isu").readOnly = false;

    // Очищаем ошибки
    document.getElementById("fio-error").textContent = "";
    document.getElementById("group-error").textContent = "";
    document.getElementById("isu-error").textContent = "";

    // Показываем форму
    studentsList.classList.add("hidden");
    document.querySelector("#form-students").classList.remove("hidden");
});