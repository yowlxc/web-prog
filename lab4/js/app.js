const btnAdd = document.querySelector("#btn-add");
const btnCancel = document.querySelector("#btn-cancel");
const listStudents = document.querySelector("#list-students");
const formStudents = document.querySelector("#form-students");

renderStudents();

btnAdd.addEventListener("click", function() {
    editingIsu = null;

    const form = formStudents.querySelector("form");
    form.reset();

    document.getElementById("isu").readOnly = false;

    document.getElementById("fio-error").textContent = "";
    document.getElementById("group-error").textContent = "";
    document.getElementById("isu-error").textContent = "";

    const h2 = formStudents.querySelector("h2");
    h2.textContent = "Форма добавления студента";

    listStudents.classList.add("hidden");
    formStudents.classList.remove("hidden");
});


btnCancel.addEventListener("click", function() {
    formStudents.classList.add("hidden");
    listStudents.classList.remove("hidden");
});
