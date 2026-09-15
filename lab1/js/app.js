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