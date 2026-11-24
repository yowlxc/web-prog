package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.exception.DuplicateIsuException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Comparator;
import java.text.Collator;
import java.util.Locale;
import java.time.LocalDate;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentEventService eventService;

    public StudentService(StudentRepository studentRepository, StudentEventService eventService) {
        this.studentRepository = studentRepository;
        this.eventService = eventService;
    }

    public List<Student> getAllStudents(
            String sortBy, String sortDir, Integer page, Integer size) {
        return filterStudents(null, null, null, null, null, null, null,
                null, null, null,
                sortBy, sortDir, page, size);
    }

    public List<Student> filterStudents(
            Integer roomMin,
            Integer roomMax,
            String group,
            String fio,
            Integer isu,
            Integer dormNumber,
            Boolean isForeign,
            LocalDate dateFrom,
            LocalDate dateTo,
            String notes,
            String sortBy,
            String sortDir,
            Integer page,
            Integer size) {

        if (page < 0 || size < 1 || size > 1000) {
            throw new BadRequestException("page должен быть >= 0, size — от 1 до 1000");
        }
        if (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc")) {
            throw new BadRequestException("sortDir должен быть asc или desc");
        }
        if (roomMin != null && roomMax != null && roomMin > roomMax) {
            throw new BadRequestException("Начало диапазона комнат больше конца");
        }
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new BadRequestException("Начало диапазона дат позже конца");
        }

        Collator fioCollator = Collator.getInstance(
                Locale.forLanguageTag("ru-RU")
        );
        fioCollator.setStrength(Collator.PRIMARY);
        Comparator<Student> comparator = switch (sortBy) {
            case "isu" -> Comparator.comparing(Student::getIsu);
            case "fio" -> Comparator.comparing(Student::getFio, fioCollator);
            case "group" -> Comparator.comparing(Student::getGroup);
            case "dormNumber" -> Comparator.comparing(Student::getDormNumber);
            case "roomNumber" -> Comparator.comparing(Student::getRoomNumber);
            case "dateInDorm" -> Comparator.comparing(Student::getDateInDorm);
            default -> throw new BadRequestException("Неизвестное поле сортировки: " + sortBy);
        };
        comparator = comparator.thenComparing(Student::getIsu);
        if (sortDir.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        return studentRepository.findAll().stream()
                .filter(s -> roomMin == null || s.getRoomNumber() >= roomMin)
                .filter(s -> roomMax == null || s.getRoomNumber() <= roomMax)
                .filter(s -> group == null || s.getGroup().toLowerCase().contains(group.toLowerCase()))
                .filter(s -> fio == null || s.getFio().toLowerCase().contains(fio.toLowerCase()))
                .filter(s -> isu == null || String.valueOf(s.getIsu()).contains(String.valueOf(isu)))
                .filter(s -> dormNumber == null || String.valueOf(s.getDormNumber()).contains(String.valueOf(dormNumber)))
                .filter(s -> isForeign == null || s.getIsForeign().equals(isForeign))
                .sorted(comparator)
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    public Optional<Student> getStudentByIsu(Integer isu) {
        return studentRepository.findById(isu);
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsById(student.getIsu())) {
            throw new DuplicateIsuException(String.valueOf(student.getIsu()));
        }
        eventService.broadcast();
        return studentRepository.save(student);
    }

    public Student updateStudent(Integer isu, Student updatedStudent) {
        Student existing = studentRepository.findById(isu)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Студент не найден: " + isu
                ));
        if (updatedStudent.getFio() != null) {
            existing.setFio(updatedStudent.getFio());
        }
        if (updatedStudent.getGroup() != null) {
            existing.setGroup(updatedStudent.getGroup());
        }
        if (updatedStudent.getDormNumber() != null) {
            existing.setDormNumber(updatedStudent.getDormNumber());
        }
        if (updatedStudent.getRoomNumber() != null) {
            existing.setRoomNumber(updatedStudent.getRoomNumber());
        }
        if (updatedStudent.getDateInDorm() != null) {
            existing.setDateInDorm(updatedStudent.getDateInDorm());
        }
        if (updatedStudent.getIsForeign() != null) {
            existing.setIsForeign(updatedStudent.getIsForeign());
        }
        if (updatedStudent.getNotes() != null) {
            existing.setNotes(updatedStudent.getNotes());
        }
        eventService.broadcast();
        return studentRepository.save(existing);
    }

    public void deleteStudent(Integer isu) {
        if (!studentRepository.existsById(isu)) {
            throw new IllegalArgumentException(
                    "Студент не найден: " + isu
            );
        }
        eventService.broadcast();
        studentRepository.deleteById(isu);
    }
}
