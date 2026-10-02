from datetime import date
from pydantic import (
    BaseModel,
    Field,
    StrictBool,
    StrictInt,
    StrictStr,
    field_validator,
)


class Student(BaseModel):
    isu: StrictStr = Field( pattern=r"^[1-9][0-9]{5}$" )
    fio: StrictStr = Field(
        min_length=2,
        max_length=50,
        pattern=r"^[А-Яа-яЁё]+(?: [А-Яа-яЁё]+)+$")
    group: StrictStr = Field(pattern=r"^[A-Z][1-9][0-9]{3}$")

    dormNumber : StrictInt = Field(ge=1, le=100)
    roomNumber: StrictInt = Field(ge=1, le=99999)

    dateInDorm: StrictStr = Field(pattern=r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
    isForeign: StrictBool = False
    notes : StrictStr = Field(default="", max_length=300)

    @field_validator('dateInDorm')
    @classmethod
    def check_date_in_dorm(cls, value: str) -> str:
        try:
            pars_date = date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError("Дата заселения не существует") from exc
        
        if pars_date < date(1999, 1 ,1):
            raise ValueError("Дата заселения должна быть не раньше 1999-01-01")
        
        if pars_date > date.today():
            raise ValueError("Дата заселения не может быть в будущем")
        
        return value
    
    def update_student(self, upd: dict) -> Student:
        data = self.model_dump()
        data.update(upd)

        return Student.model_validate(data)
    
