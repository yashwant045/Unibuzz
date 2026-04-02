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

    public Event createEvent(Event event, String facultyEmail) {
        event.setFacultyEmail(facultyEmail);
        return eventRepository.save(event);
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
}
