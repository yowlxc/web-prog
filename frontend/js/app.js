const btnAdd = document.querySelector("#btn-add");
const btnCancel = document.querySelector("#btn-cancel");
const listStudents = document.querySelector("#list-students");
const formStudents = document.querySelector("#form-students");
const filterButton = document.querySelector("#btn-filter");
const filterResetButton = document.querySelector("#btn-reset-filter");

renderStudents();

btnAdd.addEventListener("click", function() {
    editingIsu = null;

    const h2 = formStudents.querySelector("h2");
    h2.textContent = "Форма добавления студента";

    const form = formStudents.querySelector("form");
    form.reset();

    // разблокируем ИСУ
    document.getElementById("isu").readOnly = false;

    // очищаем ошибки
    document.getElementById("fio-error").textContent = "";
    document.getElementById("group-error").textContent = "";
    document.getElementById("isu-error").textContent = "";
    document.getElementById("dorm-error").textContent = "";
    document.getElementById("room-error").textContent = "";
    document.getElementById("date-error").textContent = "";

    // меняем заголовок
    // const h2 = formStudents.querySelector("h2");
    // h2.textContent = "Форма добавления студента";

    // переключаем отображение
    listStudents.classList.add("hidden");
    formStudents.classList.remove("hidden");
});


// Отмена
btnCancel.addEventListener("click", function() {
    const h2 = formStudents.querySelector("h2");
    h2.textContent = "Форма редактирования студента";

    formStudents.classList.add("hidden");
    listStudents.classList.remove("hidden");
});

filterButton.addEventListener("click", async function() {

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

    await renderStudents(params);
});

filterResetButton.addEventListener("click", async function() {
    document.querySelector("#filter-fio").value = "";
    document.querySelector("#filter-group").value = "";
    document.querySelector("#filter-isu").value = "";
    document.querySelector("#filter-dormitory").value = "";
    document.querySelector("#filter-foreign").checked = false;
    document.querySelector("#filter-room-min").value = "";
    document.querySelector("#filter-room-max").value = "";
    const params = {}

    await renderStudents(params);
});