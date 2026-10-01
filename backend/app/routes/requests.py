from fastapi import APIRouter, HTTPException, Path

from app.models import Student
from app.services.students import (
    DuplicateIsuError,
    add_student,
    get_students,
    get_student_by_isu,
    del_student,
)

router =  APIRouter(prefix="/api/requests", tags=["requests"])


@router.get("", response_model=list[Student])
def get_requests():
    return get_students()

@router.post("", response_model=Student, status_code=201)
def creat_student(student: Student) -> Student:
    try:
        return add_student(student)
    except DuplicateIsuError as exc:
        raise HTTPException(
            status_code=409,
            detail="Студент с таким ИСУ уже существует",
        ) from exc

@router.get("/{isu}", response_model=Student)
def get_request(isu: str = Path(pattern=r"^[1-9][0-9]{5}$")) -> Student:
    student = get_student_by_isu(isu)

    if student is None:
        raise HTTPException(status_code=404, detail="Студент не найден")
    
    return student

@router.delete("/{isu}", status_code=204)
def delete_student(isu: str = Path(pattern=r"^[1-9][0-9]{5}$")) -> None:
    fl = del_student(isu)
    if fl == False:
        raise HTTPException(status_code=404, detail="Студент не найден")

    return None