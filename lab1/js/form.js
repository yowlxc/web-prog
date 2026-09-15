const form = document.querySelector('form');
const isuError = document.querySelector("#isu-error");
let editingIsu = null;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const fio = document.getElementById('fio').value;

    //валидация фио
    const fioError = document.querySelector("#fio-error");
    const fioPattern = /^[A-Za-zА-Яа-яЁё]+( +[A-Za-zА-Яа-яЁё]+)+$/;
    if (!fioPattern.test(fio)) {
        fioError.textContent = "ФИО должно содержать минимум 2 слова и только буквы";
        return;
    }
    if (fio.length >= 40) {
        fioError.textContent = "ФИО должно быть меньше 40 символов";
        return;
    }
    fioError.textContent = "";

    const group = document.getElementById('group').value;
    
    // валидация группы
    const groupError = document.querySelector("#group-error");
    const groupPattern = /^[A-Z][0-9]{4}$/;
    if (!groupPattern.test(group)) {
        groupError.textContent = "Группа должна иметь формат: латинская буква и 4 цифры";
        return;
    }

    groupError.textContent = "";

    const isu = document.getElementById('isu').value;

    // Проверяем, не существует ли уже такой ИСУ
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

