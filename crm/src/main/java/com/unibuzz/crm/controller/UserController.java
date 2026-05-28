package com.unibuzz.crm.controller;

import com.unibuzz.crm.dto.UserProfileDTO;
import com.unibuzz.crm.model.User;
import com.unibuzz.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public UserProfileDTO getProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .interests(user.getInterests() != null ? user.getInterests().stream().map(com.unibuzz.crm.model.Interest::getName).collect(Collectors.toList()) : java.util.Collections.emptyList())
                .build();
    }
}
