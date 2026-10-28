package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.exception.DuplicateIsuException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Comparator;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents(
            String sortBy, String sortDir, Integer page, Integer size) {
        return filterStudents(null, null, null, null, null, null, null,
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
            String sortBy,
            String sortDir,
            Integer page,
            Integer size) {

        if (page < 0 || size < 1 || size > 100) {
            throw new BadRequestException("page должен быть >= 0, size — от 1 до 100");
        }
        if (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc")) {
            throw new BadRequestException("sortDir должен быть asc или desc");
        }

        Comparator<Student> comparator = switch (sortBy) {
            case "isu" -> Comparator.comparing(Student::getIsu);
            case "fio" -> Comparator.comparing(Student::getFio);
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
                .filter(s -> group == null || s.getGroup().equals(group))
                .filter(s -> fio == null || s.getFio().equals(fio))
                .filter(s -> isu == null || s.getIsu().equals(isu))
                .filter(s -> dormNumber == null || s.getDormNumber().equals(dormNumber))
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

        return studentRepository.save(existing);
    }

    public void deleteStudent(Integer isu) {
        if (!studentRepository.existsById(isu)) {
            throw new IllegalArgumentException(
                    "Студент не найден: " + isu
            );
        }

        studentRepository.deleteById(isu);
    }
}
