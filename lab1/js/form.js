const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const fio = document.getElementById('fio').value;
    const group = document.getElementById('group').value;
    const isu = document.getElementById('isu').value;
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

    addStudent(student);
});
