package com.example.appledisease.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String imageName;
    private String disease;
    private double confidence;

    private LocalDateTime createdAt;

    // REQUIRED by JPA
    public Prediction() {}

    // Used when saving prediction
    public Prediction(Long userId, String imageName, String disease, double confidence) {
        this.userId = userId;
        this.imageName = imageName;
        this.disease = disease;
        this.confidence = confidence;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getImageName() { return imageName; }
    public String getDisease() { return disease; }
    public double getConfidence() { return confidence; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId) { this.userId = userId; }
}
