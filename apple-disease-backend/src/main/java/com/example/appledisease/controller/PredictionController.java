package com.example.appledisease.controller;

import com.example.appledisease.entity.Prediction;
import com.example.appledisease.service.MlPredictionService;
import com.example.appledisease.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost",
    "http://127.0.0.1:5173",
    "http://apple-frontend",
    "https://leaf-snap-kohl.vercel.app",
    "https://leafsnap-backend.onrender.com",
    "https://leafsnap-ml.onrender.com"
},
allowCredentials = "true",
allowedHeaders = "*",
methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class PredictionController {

    private final MlPredictionService service;
    private final JwtUtil jwtUtil;

    public PredictionController(MlPredictionService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<Prediction> predict(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(service.predictAndSave(file, userId));
    }
}
