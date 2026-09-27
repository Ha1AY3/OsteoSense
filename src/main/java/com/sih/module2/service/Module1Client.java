 
package com.sih.module2.service;

import com.sih.module2.model.AIRiskResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class Module1Client {

    private final WebClient webClient;

    public Module1Client(@Value("${module1.base-url:http://localhost:8001}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public AIRiskResponse getRiskAssessment(Map<String, Object> patientData) {
        try {
            return webClient.post()
                    .uri("/calculate_risk")
                    .bodyValue(patientData)
                    .retrieve()
                    .bodyToMono(AIRiskResponse.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Module 1 call failed: " + e.getMessage());
            // Return default values if AI service is down
            return new AIRiskResponse(
                50,
                "Moderate Risk",
                java.util.List.of("AI service unavailable - using default assessment"),
                "Please consult a doctor for proper evaluation"
            );
        }
    }
}
