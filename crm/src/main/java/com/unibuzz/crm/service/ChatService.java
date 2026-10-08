package com.unibuzz.crm.service;

import com.unibuzz.crm.dto.ChatResponse;
import com.unibuzz.crm.entity.Event;
import com.unibuzz.crm.repository.EventRepository;
import com.unibuzz.crm.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final EventService eventService;
    private final RegistrationRepository registrationRepository;

    public ChatResponse processMessage(String message, String email) {
        if (message == null) return new ChatResponse("I didn't quite catch that.", null);
        
        String msg = message.toLowerCase().trim();

        // 1. Upcoming Events
        if (msg.contains("upcoming") || msg.contains("latest") || msg.contains("this week")) {
            List<Event> upcoming = eventService.getAllEvents().stream()
                    .filter(e -> e.getEventDate() != null && !e.getEventDate().isBefore(LocalDate.now()))
                    .limit(5)
                    .collect(Collectors.toList());
            return new ChatResponse("Here are some upcoming events you might be interested in:", upcoming);
        }

        // 2. Event Categories
        if (msg.contains("technical") || msg.contains("cultural") || msg.contains("workshop") || msg.contains("hackathon") || msg.contains("sports")) {
            String category = "Unknown";
            if (msg.contains("technical")) category = "TECHNICAL";
            else if (msg.contains("cultural")) category = "CULTURAL";
            else if (msg.contains("workshop")) category = "WORKSHOP";
            else if (msg.contains("hackathon")) category = "HACKATHON";
            else if (msg.contains("sports")) category = "SPORTS";
            
            final String filterCategory = category;
            List<Event> categoryEvents = eventService.getAllEvents().stream()
                    .filter(e -> filterCategory.equalsIgnoreCase(e.getCategory()) && !e.getEventDate().isBefore(LocalDate.now()))
                    .collect(Collectors.toList());
            
            if (categoryEvents.isEmpty()) {
                return new ChatResponse("I couldn't find any upcoming " + filterCategory + " events right now. Check back later!", null);
            }
            return new ChatResponse("Here are the upcoming " + filterCategory + " events:", categoryEvents);
        }

        // 3. My Events
        if (msg.contains("my events") || msg.contains("registered") || msg.contains("joined")) {
            if (email == null || email.equals("anonymousUser")) {
                return new ChatResponse("Please login to view your registered events.", null);
            }
            List<Event> myEvents = eventService.getAllEvents().stream()
                    .filter(e -> registrationRepository.existsByStudentEmailAndEventId(email, e.getId()))
                    .collect(Collectors.toList());
            
            if (myEvents.isEmpty()) {
                return new ChatResponse("You haven't registered for any events yet.", null);
            }
            return new ChatResponse("Here are the events you have registered for:", myEvents);
        }

        // 5. Registration Help
        if (msg.contains("how do i register") || msg.contains("register") || msg.contains("cancel") || msg.contains("registration failed")) {
            return new ChatResponse("To register for an event, go to the Events page, click 'View Details' on any event, and hit the 'Register Now' button. If you wish to cancel, you can contact the event organizer or support.", null);
        }

        // 6. FAQ Section
        if (msg.contains("what is unibuzz") || msg.contains("faq")) {
            return new ChatResponse("UniBuzz is a comprehensive campus event management platform. Students can browse, discover, and register for events, while faculty members can create and manage them easily.", null);
        }
        if (msg.contains("create an event") || msg.contains("faculty create events")) {
            return new ChatResponse("Only faculty members can create events. If you are a faculty member, go to your Dashboard and click 'Create Event'.", null);
        }
        if (msg.contains("edit my profile")) {
            return new ChatResponse("You can edit your profile by clicking your avatar in the top right corner and selecting 'Profile'.", null);
        }
        if (msg.contains("free") || msg.contains("cost")) {
            return new ChatResponse("Most events on UniBuzz are free to attend, but please check the specific event details for any registration fees.", null);
        }

        // 7. Contact Support
        if (msg.contains("contact") || msg.contains("support") || msg.contains("help")) {
            return new ChatResponse("If you need further assistance, please reach out to us at support@unibuzz.edu or visit the administrative office in Room 101.", null);
        }

        // Default Fallback
        return new ChatResponse("I'm not exactly sure how to help with that. Try asking about 'upcoming events', 'how to register', or 'my events'!", null);
    }
}
