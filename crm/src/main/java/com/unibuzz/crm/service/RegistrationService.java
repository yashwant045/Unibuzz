package com.unibuzz.crm.service;

import com.unibuzz.crm.entity.Event;
import com.unibuzz.crm.entity.Registration;
import com.unibuzz.crm.repository.EventRepository;
import com.unibuzz.crm.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    @Transactional
    public void register(String email, Long eventId) {
        boolean exists = registrationRepository.existsByStudentEmailAndEventId(email, eventId);
        if (exists) {
            throw new RuntimeException("Already registered");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        int registeredCount = event.getRegisteredCount() == null ? 0 : event.getRegisteredCount();
        int seats = event.getSeats() == null ? 0 : event.getSeats();
        if (registeredCount >= seats) {
            throw new RuntimeException("Seats Full");
        }

        Registration reg = Registration.builder()
                .studentEmail(email)
                .eventId(eventId)
                .build();

        registrationRepository.save(reg);

        event.setRegisteredCount(registeredCount + 1);
        eventRepository.save(event);
    }

    public List<Registration> getByStudent(String email) {
        return registrationRepository.findByStudentEmail(email);
    }

    public List<Registration> getByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}
