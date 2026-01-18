package com.example.appledisease.repository;

import com.example.appledisease.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
