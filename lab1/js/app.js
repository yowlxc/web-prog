const listStudents = document.getElementById('list-students');
const formStudents = document.getElementById('form-students');
const btnAdd = document.getElementById('btn-add');

btnAdd.addEventListener('click', function() {
    // прячем список студентов
    listStudents.classList.add('hidden');

    // показываем форму, убрав класс
    formStudents.classList.remove('hidden');
});