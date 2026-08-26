package com.unibuzz.crm.service;

import com.unibuzz.crm.entity.Event;
import com.unibuzz.crm.entity.Registration;
import com.unibuzz.crm.repository.EventRepository;
import com.unibuzz.crm.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventReminderScheduler {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EmailService emailService;

    // Run every day at midnight to clean up expired events
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanupExpiredEvents() {
        log.info("Starting daily expired event cleanup job");
        LocalDate today = LocalDate.now();
        List<Event> expiredEvents = eventRepository.findByEventDateBefore(today);
        if (!expiredEvents.isEmpty()) {
            for (Event event : expiredEvents) {
                registrationRepository.deleteByEventId(event.getId());
                eventRepository.delete(event);
            }
            log.info("Deleted {} expired events and their registrations.", expiredEvents.size());
        }
    }

    // Run every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendUpcomingEventReminders() {
        log.info("Starting daily upcoming event reminder job");
        
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Event> upcomingEvents = eventRepository.findByEventDate(tomorrow);
        
        for (Event event : upcomingEvents) {
            List<Registration> registrations = registrationRepository.findByEventId(event.getId());
            
            for (Registration registration : registrations) {
                emailService.sendUpcomingEventReminder(
                    registration.getStudentEmail(),
                    event.getTitle(),
                    event.getEventDate().toString(),
                    event.getLocation()
                );
            }
        }
        
        log.info("Completed daily upcoming event reminder job. Processed {} events.", upcomingEvents.size());
    }
}
