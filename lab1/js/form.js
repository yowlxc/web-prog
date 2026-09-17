const form = document.querySelector('form');
const isuError = document.querySelector("#isu-error");
const fioError = document.querySelector("#fio-error");
const groupError = document.querySelector("#group-error");
let editingIsu = null;

form.addEventListener('submit', function(event) {
    console.log("Кнопка нажата");
    event.preventDefault();

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


    // проверяем, не существует ли уже такой ИСУ
    const students = getStudents();
    const isIsuExists = students.some(function(student) {
        return student.isu === isu && student.isu !== editingIsu;
    });
    if (isIsuExists) {
        isuError.textContent = "Студент с таким ИСУ уже существует"; 
        return;
    }
    isuError.textContent = "";

    const dormNumber = document.getElementById('num-dorm').value;
    const roomNumber = document.getElementById('num-room').value;
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

    if (editingIsu === null) {
        addStudent(student);
    } else {
        updateStudent(student);
    }

    renderStudents();
    console.log('aaaa');

    form.parentElement.classList.add("hidden");
    document.querySelector("#list-students").classList.remove("hidden");
});

