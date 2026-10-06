from fastapi import APIRouter, HTTPException, Path, Body
from pydantic import ValidationError
from app.errors import error_response, validation_details

from app.models import Student
from app.services.students import (
    add_student,
    get_students,
    get_student_by_isu,
    del_student,
    upd_student,
    filter_students,
)


router =  APIRouter(prefix="/api/requests", tags=["requests"])


@router.get("", response_model=list[Student])
def get_filter_students(
    isu: str | None = None,
    fio: str | None = None,
    group: str | None = None,
    dormNumber: int | None = None,
    roomNumber: int | None = None,
    dateInDorm: str | None = None,
    isForeign: bool | None = None,
    notes: str | None = None):

    filters = {
        name: value
        for name, value in {
            "isu": isu,
            "fio": fio,
            "group": group,
            "dormNumber": dormNumber,
            "roomNumber": roomNumber,
            "dateInDorm": dateInDorm,
            "isForeign": isForeign,
            "notes": notes
        }.items()
        if value is not None
    }
     
    if len(filters) >= 3:
        raise HTTPException(
            status_code=400,
            detail="Для GET укажите максимум два свойства",
        )
    
    return filter_students(filters)


@router.post("", response_model=Student, status_code=201)
def creat_student(student: Student) -> Student:
    return add_student(student)

@router.get("/{isu}", response_model=Student)
def get_request(isu: str = Path(pattern=r"^[1-9][0-9]{5}$")) -> Student:
    student = get_student_by_isu(isu)

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Студент не найден"
            )
    
    return student


@router.delete("/{isu}", status_code=204)
def delete_student(isu: str = Path(pattern=r"^[1-9][0-9]{5}$")) -> None:
    fl = del_student(isu)
    if fl == False:
        raise HTTPException(
            status_code=404,
            detail="Студент не найден"
            )

    return None

@router.patch("/{isu}", response_model=Student, status_code=200)
def patch_student(isu: str = Path(pattern=r"^[1-9][0-9]{5}$"),
                  patch: dict = Body(...)):
    if get_student_by_isu(isu) is None:
        raise HTTPException(status_code=404, detail="Студент не найден")

    try: 
        return upd_student(isu, patch)
    except ValidationError as exc:
        return error_response(
        422, 
        "VALIDATION_ERROR",
        "Некорректные данные студента",
        validation_details(exc.errors()),
    )
    
@router.api_route("", methods=["QUERY"], response_model=list[Student])
def query__students(filters: dict = Body(...)) -> list[Student]:
    if len(filters) < 3:
        raise HTTPException(
            status_code=400,
            detail="Для QUERY укажите минимум три свойства",
        )
    
    return filter_students(filters)