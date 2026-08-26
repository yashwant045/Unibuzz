package com.unibuzz.crm.service;

import com.unibuzz.crm.entity.Event;
import com.unibuzz.crm.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EmailService emailService;
    private final com.unibuzz.crm.repository.UserRepository userRepository;
    private final com.unibuzz.crm.repository.RegistrationRepository registrationRepository;

    @Transactional
    public void cleanupExpiredEvents() {
        LocalDate today = LocalDate.now();
        List<Event> expiredEvents = eventRepository.findByEventDateBefore(today);
        if (!expiredEvents.isEmpty()) {
            for (Event event : expiredEvents) {
                registrationRepository.deleteByEventId(event.getId());
                eventRepository.delete(event);
            }
        }
    }

    private String formatTime12Hour(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) return "";
        if (timeStr.toUpperCase().contains("AM") || timeStr.toUpperCase().contains("PM")) {
            return timeStr;
        }
        try {
            String[] parts = timeStr.split(":");
            if (parts.length >= 2) {
                int hour = Integer.parseInt(parts[0].trim());
                String minute = parts[1].trim();
                String ampm = hour >= 12 ? "PM" : "AM";
                hour = hour % 12;
                if (hour == 0) hour = 12;
                return String.format("%d:%s %s", hour, minute, ampm);
            }
        } catch (Exception ignored) {}
        return timeStr;
    }

    private void validateEventDateTime(LocalDate eventDate, String eventTime) {
        if (eventDate == null) {
            throw new RuntimeException("Event date is required.");
        }
        LocalDate today = LocalDate.now();
        if (eventDate.isBefore(today)) {
            throw new RuntimeException("Event date cannot be in the past.");
        }
        if (eventDate.isEqual(today) && eventTime != null && !eventTime.isBlank()) {
            try {
                String[] parts = eventTime.split(":");
                if (parts.length >= 2) {
                    int hour = Integer.parseInt(parts[0].trim());
                    int minute = Integer.parseInt(parts[1].trim());
                    java.time.LocalTime time = java.time.LocalTime.of(hour, minute);
                    if (java.time.LocalTime.now().isAfter(time)) {
                        throw new RuntimeException("Event time cannot be in the past for today's date.");
                    }
                }
            } catch (NumberFormatException ignored) {}
        }
    }

    public Event createEvent(Event event, String facultyEmail) {
        validateEventDateTime(event.getEventDate(), event.getEventTime());
        event.setFacultyEmail(facultyEmail);
        Event savedEvent = eventRepository.save(event);

        String formattedTime = formatTime12Hour(savedEvent.getEventTime());
        String dateWithTime = savedEvent.getEventDate().toString() + (!formattedTime.isBlank() ? " at " + formattedTime : "");

        // Notify all students
        userRepository.findByRoles_Name("STUDENT").forEach(student -> {
            emailService.sendNewEventNotification(
                student.getEmail(),
                savedEvent.getTitle(),
                dateWithTime,
                savedEvent.getLocation()
            );
        });

        return savedEvent;
    }

    @Transactional
    public List<Event> getAllEvents() {
        cleanupExpiredEvents();
        return eventRepository.findAll();
    }

    @Transactional
    public List<Event> getMyEvents(String email) {
        cleanupExpiredEvents();
        return eventRepository.findByFacultyEmail(email);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            String eventTitle = event.getTitle();
            registrationRepository.findByEventId(id).forEach(registration -> {
                emailService.sendEventCancellationNotification(
                    registration.getStudentEmail(),
                    eventTitle
                );
            });
            registrationRepository.deleteByEventId(id);
            eventRepository.delete(event);
        }
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        validateEventDateTime(updatedEvent.getEventDate(), updatedEvent.getEventTime());
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setEventDate(updatedEvent.getEventDate());
        existingEvent.setEventTime(updatedEvent.getEventTime());
        existingEvent.setLocation(updatedEvent.getLocation());
        existingEvent.setSeats(updatedEvent.getSeats());
        existingEvent.setCategory(updatedEvent.getCategory());

        Event savedEvent = eventRepository.save(existingEvent);

        String formattedTime = formatTime12Hour(savedEvent.getEventTime());
        String dateWithTime = savedEvent.getEventDate().toString() + (!formattedTime.isBlank() ? " at " + formattedTime : "");

        // Notify all registered students
        registrationRepository.findByEventId(id).forEach(registration -> {
            emailService.sendEventUpdateNotification(
                registration.getStudentEmail(),
                savedEvent.getTitle(),
                dateWithTime,
                savedEvent.getLocation(),
                savedEvent.getDescription(),
                savedEvent.getCategory()
            );
        });

        return savedEvent;
    }
}
