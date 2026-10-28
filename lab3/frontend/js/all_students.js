const studentsTable = document.querySelector(".students-table tbody");
let currentPage = 0;
let currentFilters = {};
const pageSize = 20;
let lastRenderRequest = 0;

async function renderStudents() {
    const page = currentPage;
    const requestId = ++lastRenderRequest;
    const prevButton = document.querySelector("#page-prev");
    const nextButton = document.querySelector("#page-next");
    prevButton.disabled = true;
    nextButton.disabled = true;
    const params = {
        ...currentFilters,
        page: page,
        size: pageSize,
        sortBy: document.querySelector("#sort-by").value,
        sortDir: document.querySelector("#sort-dir").value
    };
    let students;
    try {
        students = await getStudents(params);
    } catch (error) {
        if (requestId === lastRenderRequest) {
            prevButton.disabled = page === 0;
            nextButton.disabled = false;
        }
        throw error;
    }
    if (requestId !== lastRenderRequest) return;

    const rows = document.createDocumentFragment();
    students.forEach(function(student) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td id="isu_tbl">${student.isu}</td>
            <td id="fio_tbl">${student.fio}</td>
            <td id="group_tbl">${student.group}</td>
            <td class="actions-col">
                <div class="btn-group">
                    <button class="btn-details" data-id="${student.isu}">
                        Подробнее
                    </button>

                    <button class="btn-edit ${currentUser.role === "ADMIN" ? "" : "hidden"}" data-id="${student.isu}">
                        Редактировать
                    </button>

                    <button class="btn-delete ${currentUser.role === "ADMIN" ? "" : "hidden"}" data-id="${student.isu}">
                        Удалить
                    </button>
                </div>
            </td>
        `;
    rows.appendChild(row);
    })
    studentsTable.replaceChildren(rows);
    document.querySelector("#page-number").textContent = "Страница " + (page + 1);
    prevButton.disabled = page === 0;
    nextButton.disabled = students.length < pageSize;
}
