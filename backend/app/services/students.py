from app.models import Student
from app.repositories.json_repository import read_students, write_students

from app.errors import DuplicateIsuError



def get_students() -> list[Student]:
    return read_students()

def get_student_by_isu(isu: str) -> Student | None:
    students = read_students()

    for student in students:
        if student.isu == isu:
            return student

    return None

def add_student(student: Student) -> Student:
    students = read_students()

    if any(old_student.isu == student.isu for old_student in students):
        raise DuplicateIsuError(student.isu)

    students.append(student)
    write_students(students)
    return student

def del_student(isu: str) ->  None:
    students = read_students()

    for i, student in enumerate(students):
        if student.isu == isu:
            students.pop(i)
            write_students(students)
            return True

    return False

def upd_student(isu: str, patch: dict) -> Student:
    students = read_students()

    for i, student in enumerate(students):
        if student.isu == isu:
            upd_student = student.update_student(patch)
            if any(other.isu == upd_student.isu for j, other in enumerate(students) if j != i):
                raise DuplicateIsuError(upd_student.isu)
            students[i] = upd_student
            write_students(students)
            
            return upd_student
        
    return None

def filter_students(param: dict) -> list[Student]:
    students = read_students()

    result = []

    for student in students:
        match = True

        for key, value in param.items():
            if key == "roomMin":
                if student.roomNumber < value:
                    match = False

            elif key == "roomMax":
                if student.roomNumber > value:
                    match = False

            elif getattr(student, key) != value:
                match = False

        if match:
            result.append(student)

    return result