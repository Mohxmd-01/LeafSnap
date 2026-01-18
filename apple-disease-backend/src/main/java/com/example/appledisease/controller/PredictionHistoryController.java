package com.example.appledisease.controller;

import com.example.appledisease.entity.Prediction;
import com.example.appledisease.repository.PredictionRepository;
import com.example.appledisease.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin
public class PredictionHistoryController {

    private final PredictionRepository repository;
    private final JwtUtil jwtUtil;

    public PredictionHistoryController(PredictionRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Prediction> getHistory(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
