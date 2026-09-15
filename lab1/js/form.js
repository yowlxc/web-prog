const form = document.querySelector('form');
const isuError = document.querySelector("#isu-error");
let editingIsu = null;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const fio = document.getElementById('fio').value;
    const group = document.getElementById('group').value;
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

    form.parentElement.classList.add("hidden");
    document.querySelector("#list-students").classList.remove("hidden");
});


