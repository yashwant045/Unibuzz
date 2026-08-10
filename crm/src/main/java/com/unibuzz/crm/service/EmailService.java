package com.unibuzz.crm.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:crackthecode46@gmail.com}")
    private String fromEmail;

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            if (fromEmail != null && !fromEmail.isBlank()) {
                helper.setFrom(fromEmail, "Unibuzz Notifications");
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            // Commenting out the actual send call during development if credentials aren't set
            // to avoid errors in logs. But we'll leave it in for the real implementation.
            javaMailSender.send(message);
            log.info("Email sent to: " + to + " with subject: " + subject);
        } catch (Exception e) {
            log.error("Failed to send email to " + to, e);
        }
    }

    public void sendNewEventNotification(String to, String eventTitle, String eventDate, String location) {
        String subject = "New Event: " + eventTitle;
        String body = "<h3>A new event has been scheduled!</h3>"
                + "<p><strong>Title:</strong> " + eventTitle + "</p>"
                + "<p><strong>Date:</strong> " + eventDate + "</p>"
                + "<p><strong>Location:</strong> " + location + "</p>"
                + "<p>Don't miss out, register now!</p>";
        sendHtmlEmail(to, subject, body);
    }

    public void sendEventUpdateNotification(String to, String eventTitle, String eventDate, String location) {
        String subject = "Event Update: " + eventTitle;
        String body = "<h3>An event you registered for has been updated.</h3>"
                + "<p><strong>Title:</strong> " + eventTitle + "</p>"
                + "<p><strong>Date:</strong> " + eventDate + "</p>"
                + "<p><strong>Location:</strong> " + location + "</p>"
                + "<p>Please check the portal for more details.</p>";
        sendHtmlEmail(to, subject, body);
    }

    public void sendUpcomingEventReminder(String to, String eventTitle, String eventDate, String location) {
        String subject = "Reminder: Upcoming Event Tomorrow - " + eventTitle;
        String body = "<h3>Friendly Reminder!</h3>"
                + "<p>The event <strong>" + eventTitle + "</strong> is happening tomorrow.</p>"
                + "<p><strong>Date:</strong> " + eventDate + "</p>"
                + "<p><strong>Location:</strong> " + location + "</p>"
                + "<p>We look forward to seeing you there!</p>";
        sendHtmlEmail(to, subject, body);
    }
}
