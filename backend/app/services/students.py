from app.models import Student
from app.repositories.json_repository import read_students, write_students


class DuplicateIsuError(Exception):
    pass

def get_students() -> list[Student]:
    return read_students()

def add_student(student: Student) -> Student:
    students = read_students()

    if any(tr_student.isu == student.isu for tr_student in students):
        raise DuplicateIsuError()

    students.append(student)
    write_students(students)
    return student

def get_student_by_isu(isu: str) -> Student | None:
    students = read_students()

    for student in students:
        if student.isu == isu:
            return student

    return None