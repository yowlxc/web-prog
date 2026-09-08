const listStudents = document.getElementById('list-students');
const formStudents = document.getElementById('form-students');
const dosieStudents = document.getElementById('dosie-students');
const btnAdd = document.getElementById('btn-add');
const btnCancel = document.getElementById('btn-cancel');
const btnBack = document.getElementById('btn-back');

function showSection(section) {
    // скрывает все секции кроме переданной
    listStudents.classList.add('hidden');
    formStudents.classList.add('hidden');
    dosieStudents.classList.add('hidden');

    section.classList.remove('hidden');
};


btnAdd.addEventListener('click', function() {
    showSection(formStudents);
});

btnCancel.addEventListener('click', function() {
    showSection(listStudents);
});

btnBack.addEventListener('click', function() {
    showSection(listStudents);
});