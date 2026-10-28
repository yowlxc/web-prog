package com.example.demo.service;

import com.example.demo.dto.StudentPatchRequest;
import com.example.demo.dto.StudentRequest;
import com.example.demo.dto.StudentResponse;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.DuplicateIsuException;
import com.example.demo.exception.StudentNotFoundException;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Comparator;
import java.util.List;

@Service
public class StudentService {
    private static final Logger log = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<StudentResponse> getStudents(
            Integer roomMin, Integer roomMax, String group, String fio,
            Integer isu, Integer dormNumber, Boolean isForeign,
            String sortBy, String sortDir, Integer page, Integer size) {

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
        if (sortDir.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        return studentRepository.findAll().stream()
                .filter(s -> roomMin == null || s.getRoomNumber() >= roomMin)
                .filter(s -> roomMax == null || s.getRoomNumber() <= roomMax)
                .filter(s -> group == null || s.getGroup().equals(group))
                .filter(s -> fio == null || s.getFio().toLowerCase().contains(fio.toLowerCase()))
                .filter(s -> isu == null || s.getIsu().equals(isu))
                .filter(s -> dormNumber == null || s.getDormNumber().equals(dormNumber))
                .filter(s -> isForeign == null || s.getIsForeign().equals(isForeign))
                .sorted(comparator)
                .skip((long) page * size)
                .limit(size)
                .map(StudentResponse::from)
                .toList();
    }

    public StudentResponse getStudentByIsu(Integer isu) {
        return StudentResponse.from(findStudent(isu));
    }

    private Student findStudent(Integer isu) {
        return studentRepository.findById(isu)
                .orElseThrow(() -> new StudentNotFoundException(isu));
    }

    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsById(request.isu())) {
            throw new DuplicateIsuException(String.valueOf(request.isu()));
        }
        Student saved = studentRepository.save(request.toStudent());
        log.info("Студент создан: isu={}", saved.getIsu());
        return StudentResponse.from(saved);
    }

    public StudentResponse replaceStudent(Integer isu, StudentRequest request) {
        if (!isu.equals(request.isu())) {
            throw new BadRequestException("ИСУ в адресе и теле запроса должны совпадать");
        }
        findStudent(isu);
        Student saved = studentRepository.save(request.toStudent());
        log.info("Студент полностью обновлён: isu={}", isu);
        return StudentResponse.from(saved);
    }

    public StudentResponse updateStudent(Integer isu, StudentPatchRequest request) {
        Student student = findStudent(isu);
        if (request.fio() != null) student.setFio(request.fio());
        if (request.group() != null) student.setGroup(request.group());
        if (request.dormNumber() != null) student.setDormNumber(request.dormNumber());
        if (request.roomNumber() != null) student.setRoomNumber(request.roomNumber());
        if (request.dateInDorm() != null) student.setDateInDorm(request.dateInDorm());
        if (request.isForeign() != null) student.setIsForeign(request.isForeign());
        if (request.notes() != null) student.setNotes(request.notes());
        Student saved = studentRepository.save(student);
        log.info("Студент частично обновлён: isu={}", isu);
        return StudentResponse.from(saved);
    }

    public void deleteStudent(Integer isu) {
        findStudent(isu);
        studentRepository.deleteById(isu);
        log.info("Студент удалён: isu={}", isu);
    }
}
