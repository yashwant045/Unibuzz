package com.unibuzz.crm.controller;

import com.unibuzz.crm.entity.Registration;
import com.unibuzz.crm.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/{eventId}")
    public ResponseEntity<String> register(
            @PathVariable Long eventId,
            Authentication auth
    ) {
        registrationService.register(auth.getName(), eventId);
        return ResponseEntity.ok("Registered successfully");
    }

    @GetMapping("/my")
    public List<Registration> myRegistrations(Authentication auth) {
        return registrationService.getByStudent(auth.getName());
    }

    @GetMapping("/event/{eventId}")
    public List<Registration> eventRegistrations(@PathVariable Long eventId) {
        return registrationService.getByEvent(eventId);
    }
}
