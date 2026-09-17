const btnAdd = document.querySelector("#btn-add");
const btnCancel = document.querySelector("#btn-cancel");
const listStudents = document.querySelector("#list-students");
const formStudents = document.querySelector("#form-students");

renderStudents();

btnAdd.addEventListener("click", function() {
    editingIsu = null;

    const form = formStudents.querySelector("form");
    form.reset();

    // разблокируем ИСУ
    document.getElementById("isu").readOnly = false;

    // очищаем ошибки
    document.getElementById("fio-error").textContent = "";
    document.getElementById("group-error").textContent = "";
    document.getElementById("isu-error").textContent = "";

    // меняем заголовок
    const h2 = formStudents.querySelector("h2");
    h2.textContent = "Форма добавления студента";

    // переключаем отображение
    listStudents.classList.add("hidden");
    formStudents.classList.remove("hidden");
});


// Отмена
btnCancel.addEventListener("click", function() {
    formStudents.classList.add("hidden");
    listStudents.classList.remove("hidden");
});