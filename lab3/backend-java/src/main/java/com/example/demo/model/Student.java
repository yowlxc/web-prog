
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @Pattern(regexp = "^[1-9][0-9]{5}$")
    @Column(nullable = false, length = 6)
    private String isu;

    @jakarta.validation.constraints.NotBlank
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[А-Яа-яЁё]+(?: [А-Яа-яЁё]+)+$")
    @Column(nullable = false, length = 50)
    private String fio;

    @Pattern(regexp = "^[A-Z][1-9][0-9]{3}$")
    @Column(name = "student_group", nullable = false, length = 5)
    private String group;

    @NotNull
    @Min(1)
    @Max(100)
    @Column(nullable = false)
    private Integer dormNumber;

    @NotNull
    @Min(1)
    @Max(99999)
    @Column(nullable = false)
    private Integer roomNumber;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateInDorm;

    @NotNull
    @Column(nullable = false)
    private Boolean isForeign = false;

    @Size(max = 300)
    @Column(nullable = false, length = 300)
    private String notes = "";

    public Student() {
    }

    @PrePersist
    @PreUpdate
    private void applyDefaults() {
        if (isForeign == null) {
            isForeign = false;
        }
        if (notes == null) {
            notes = "";
        }
    }

    @AssertTrue(message = "Дата заселения должна быть от 1999-01-01 до текущей даты")
    @JsonIgnore
    public boolean isDateInDormValid() {
        return dateInDorm == null ||
                (!dateInDorm.isBefore(LocalDate.of(1999, 1, 1))
                && !dateInDorm.isAfter(LocalDate.now()));
    }

    public String getIsu() {
        return isu;
    }

    public void setIsu(String isu) {
        this.isu = isu;
    }

    public String getFio() {
        return fio;
    }

    public void setFio(String fio) {
        this.fio = fio;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public Integer getDormNumber() {
        return dormNumber;
    }

    public void setDormNumber(Integer dormNumber) {
        this.dormNumber = dormNumber;
    }

    public Integer getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(Integer roomNumber) {
        this.roomNumber = roomNumber;
    }

    public LocalDate getDateInDorm() {
        return dateInDorm;
    }

    public void setDateInDorm(LocalDate dateInDorm) {
        this.dateInDorm = dateInDorm;
    }

    public Boolean getIsForeign() {
        return isForeign;
    }

    public void setIsForeign(Boolean isForeign) {
        this.isForeign = isForeign;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
