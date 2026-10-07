const form = document.querySelector('form');
form.noValidate = true;
const isuError = document.querySelector("#isu-error");
const fioError = document.querySelector("#fio-error");
const groupError = document.querySelector("#group-error");
let editingIsu = null;

form.addEventListener('submit', async function(event) {
    console.log("Кнопка нажата");
    event.preventDefault();

    isuError.textContent = "";
    fioError.textContent = "";
    groupError.textContent = "";

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
    const roomNumber = Number(document.getElementById('num-room').value);
    const dateInDorm = document.getElementById('date-in-dorm').value;
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
        isuError.textContent = "Студент с таким ИСУ уже существует";
        return;
    }

    await renderStudents();
    console.log('aaaa');

    form.parentElement.classList.add("hidden");
    document.querySelector("#list-students").classList.remove("hidden");
});

