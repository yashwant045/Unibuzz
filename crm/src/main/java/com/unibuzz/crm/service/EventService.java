package com.unibuzz.crm.service;

import com.unibuzz.crm.entity.Event;
import com.unibuzz.crm.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EmailService emailService;
    private final com.unibuzz.crm.repository.UserRepository userRepository;
    private final com.unibuzz.crm.repository.RegistrationRepository registrationRepository;

    public Event createEvent(Event event, String facultyEmail) {
        event.setFacultyEmail(facultyEmail);
        Event savedEvent = eventRepository.save(event);

        // Notify all students
        userRepository.findByRoles_Name("STUDENT").forEach(student -> {
            emailService.sendNewEventNotification(
                student.getEmail(),
                savedEvent.getTitle(),
                savedEvent.getEventDate().toString(),
                savedEvent.getLocation()
            );
        });

        return savedEvent;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getMyEvents(String email) {
        return eventRepository.findByFacultyEmail(email);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setEventDate(updatedEvent.getEventDate());
        existingEvent.setLocation(updatedEvent.getLocation());
        existingEvent.setSeats(updatedEvent.getSeats());
        existingEvent.setCategory(updatedEvent.getCategory());

        Event savedEvent = eventRepository.save(existingEvent);

        // Notify all registered students
        registrationRepository.findByEventId(id).forEach(registration -> {
            emailService.sendEventUpdateNotification(
                registration.getStudentEmail(),
                savedEvent.getTitle(),
                savedEvent.getEventDate().toString(),
                savedEvent.getLocation()
            );
        });

        return savedEvent;
    }
}
