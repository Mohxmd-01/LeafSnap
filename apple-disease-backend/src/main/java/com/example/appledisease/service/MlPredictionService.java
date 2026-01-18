package com.example.appledisease.service;

import com.example.appledisease.entity.Prediction;
import com.example.appledisease.repository.PredictionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class MlPredictionService {

    private final PredictionRepository repository;
    private final RestTemplate restTemplate;

    // ML confidence is returned as percentage (0–100)
    private static final double CONFIDENCE_THRESHOLD = 70.0;

    @Value("${ml.api.url}")
    private String mlApiUrl;

    public MlPredictionService(PredictionRepository repository,
                               RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public Prediction predictAndSave(MultipartFile file, Long userId) throws IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<MlResponse> response;

        try {
            response = restTemplate.postForEntity(
                    mlApiUrl,
                    request,
                    MlResponse.class
            );
        } catch (RestClientException e) {
            throw new RuntimeException("ML service is unavailable", e);
        }

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Invalid response from ML service");
        }

        MlResponse ml = response.getBody();

        String finalDisease =
                ml.getConfidence() >= CONFIDENCE_THRESHOLD
                        ? ml.getDisease()
                        : "Uncertain";

        Prediction prediction = new Prediction(
                userId,
                file.getOriginalFilename(),
                finalDisease,
                ml.getConfidence()
        );

        return repository.save(prediction);
    }

    // DTO for ML API response
    public static class MlResponse {
        private String disease;
        private double confidence;

        public String getDisease() {
            return disease;
        }

        public void setDisease(String disease) {
            this.disease = disease;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }
    }
}
