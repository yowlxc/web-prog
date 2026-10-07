const form = document.querySelector('form');
form.noValidate = true;
const isuError = document.querySelector("#isu-error");
const fioError = document.querySelector("#fio-error");
const groupError = document.querySelector("#group-error");
const dormError = document.querySelector("#dorm-error");
const roomError = document.querySelector("#room-error");
const dateError = document.querySelector("#date-error");

let editingIsu = null;

form.addEventListener('submit', async function(event) {
    console.log("Кнопка нажата");
    event.preventDefault();

    isuError.textContent = "";
    fioError.textContent = "";
    groupError.textContent = "";
    dormError.textContent = "";
    roomError.textContent = "";
    dateError.textContent = "";

    //валидация фио
    const fioInput = document.getElementById('fio');
    const fio = fioInput.value;
    if (!fioInput.checkValidity()) {
        fioError.textContent = "ФИО должно быть полным и содержать только буквы";
        return;
    }
    fioError.textContent = "";

    // валидация группы
    const groupInput = document.getElementById('group');
    const group = groupInput.value;
    if (!groupInput.checkValidity()) {
        groupError.textContent = "Группа должна иметь формат: латинская буква и 4 цифры";
        return;
    }
    groupError.textContent = "";

    //валидация ису-шника
    const isuInput = document.getElementById('isu');
    const isu = isuInput.value;
    if (!isuInput.checkValidity()) {
        isuError.textContent = "ИСУ должен иметь формат: шестизначное число";
        return;
    } 
    isuError.textContent = "";

    const dormNumber = Number(document.getElementById('num-dorm').value);

    const dormInput = document.getElementById('num-dorm');

    if (!dormInput.checkValidity()) {
        dormError.textContent = "Номер общежития должен быть от 1 до 100";
        return;
    }

    const roomInput = document.getElementById('num-room');

    const roomNumber = Number(document.getElementById('num-room').value);

    if (!roomInput.checkValidity()) {
        roomError.textContent = "Номер общежития должен быть от 1 до 100";
        return;
    }

    const dateInDorm = document.getElementById('date-in-dorm').value;

    const dateInput = document.getElementById('date-in-dorm');

    if (!dateInput.checkValidity()) {
        dateError.textContent = "Дата заселения должна быть от 01.01.1999 до сегодняшнего дня";
        return;
    }

    const isForeign = document.getElementById('no-rus').checked;
    const notes = document.getElementById('notes').value;

    const student = {
        fio: fio,
        group: group,
        isu: isu,
        dormNumber: dormNumber,
        roomNumber: roomNumber,
        dateInDorm: dateInDorm,
        isForeign: isForeign,
        notes: notes
    };

    try {
        if (editingIsu === null) {
            await addStudent(student);
        } else {
            await updateStudent(editingIsu, student);
        }
    } catch (error) {
        isuError.textContent = error.message;
        return;
    }

    await renderStudents();
    console.log('aaaa');

    form.parentElement.classList.add("hidden");
    document.querySelector("#list-students").classList.remove("hidden");
});

