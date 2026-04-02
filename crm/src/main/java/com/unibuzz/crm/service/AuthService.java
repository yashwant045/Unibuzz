package com.unibuzz.crm.service;

import com.unibuzz.crm.dto.RegisterRequest;
import com.unibuzz.crm.model.Faculty;
import com.unibuzz.crm.model.Interest;
import com.unibuzz.crm.model.Role;
import com.unibuzz.crm.model.Student;
import com.unibuzz.crm.model.User;
import com.unibuzz.crm.repository.FacultyRepository;
import com.unibuzz.crm.repository.InterestRepository;
import com.unibuzz.crm.repository.RoleRepository;
import com.unibuzz.crm.repository.StudentRepository;
import com.unibuzz.crm.repository.UserRepository;
import com.unibuzz.crm.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final InterestRepository interestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        if (request.getRole() == null || request.getRole().isBlank()) {
            throw new RuntimeException("Role is required");
        }

        String roleInput = request.getRole().trim().toUpperCase(Locale.ROOT);

        if (!roleInput.equals("STUDENT") && !roleInput.equals("FACULTY")) {
            throw new RuntimeException("Invalid role");
        }

        Role role = roleRepository.findByName(roleInput)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(roleInput).build()
                ));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();

        userRepository.save(user);

        if (roleInput.equals("STUDENT")) {

            Student student = new Student();
            student.setUser(user);
            student.setEnrollmentNumber(request.getEnrollmentNumber());
            student.setPhoneNumber(request.getPhoneNumber());
            student.setDepartment(request.getDepartment());
            student.setSection(request.getSection());
            student.setYear(request.getYear());

            studentRepository.save(student);

            Set<Interest> interestSet = new HashSet<>();
            List<String> interests = request.getInterests() == null
                    ? List.of()
                    : request.getInterests();

            for (String interestName : interests) {

                Interest interest = interestRepository.findByName(interestName)
                        .orElseGet(() -> {
                            Interest newInterest = new Interest();
                            newInterest.setName(interestName);
                            return interestRepository.save(newInterest);
                        });

                interestSet.add(interest);
            }

            user.setInterests(interestSet);
            userRepository.save(user);
        }

        else {

            Faculty faculty = new Faculty();
            faculty.setUser(user);
            faculty.setDesignation(request.getDesignation());
            faculty.setDepartment(request.getDepartment());
            faculty.setExpertise(request.getExpertise());
            faculty.setOfficeLocation(request.getOfficeLocation());

            facultyRepository.save(faculty);
        }

        return "User registered successfully!";
    }
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String role = user.getRoles()
                .stream()
                .findFirst()
                .map(Role::getName)
                .orElse("STUDENT");

        return jwtUtil.generateToken(user.getEmail(), role, user.getFullName());
    }
}
