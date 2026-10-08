package com.unibuzz.crm.controller;

import com.unibuzz.crm.dto.ChatRequest;
import com.unibuzz.crm.dto.ChatResponse;
import com.unibuzz.crm.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> processChat(@RequestBody ChatRequest request) {
        String email = null;
        try {
            email = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            // Ignored, anonymous user
        }
        
        ChatResponse response = chatService.processMessage(request.getMessage(), email);
        return ResponseEntity.ok(response);
    }
}
