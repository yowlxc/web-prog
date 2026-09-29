import json
from pathlib import Path

from app.models import Student


DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "students.json"


def read_students() -> list[Student]:
    if not DATA_FILE.exists():
        return []

    with DATA_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError("Файл студентов должен содержать массив")

    return [Student.model_validate(item) for item in data]

def write_students(students: list[Student]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    temporary_file = DATA_FILE.with_suffix(".tmp")

    with temporary_file.open("w", encoding="utf-8") as file:
        json.dump(
            [student.model_dump() for student in students],
            file,
            ensure_ascii=False,
        )

    temporary_file.replace(DATA_FILE)