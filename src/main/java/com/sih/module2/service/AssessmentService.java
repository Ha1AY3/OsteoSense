package com.sih.module2.service;

import com.sih.module2.model.Assessment;
import com.sih.module2.model.AIRiskResponse;
import com.sih.module2.repository.AssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository repository;

    @Autowired
    private Module1Client module1Client;

    public Assessment createAssessment(Assessment assessment) {
        // Step 1: Prepare data for Module 1 (Python API)
        Map<String, Object> patientData = new HashMap<>();
        patientData.put("age", assessment.getAge());
        patientData.put("pain", assessment.getPain());
        patientData.put("stiffness", assessment.getStiffness());
        patientData.put("stiffness_duration", assessment.getStiffnessDuration());
        patientData.put("tenderness", assessment.isTenderness());
        patientData.put("reduced_flexibility", assessment.isReducedFlexibility());
        patientData.put("crepitus", assessment.isCrepitus());
        patientData.put("swelling", assessment.isSwelling());
        patientData.put("pain_after_activity", assessment.isPainAfterActivity());
        patientData.put("pain_at_rest", assessment.isPainAtRest());
        patientData.put("gives_way", assessment.isGivesWay());
        patientData.put("sleep_disturbance", assessment.isSleepDisturbance());
        patientData.put("bmi", assessment.getBmi());

        // Step 2: Call Module 1 for AI risk calculation
        AIRiskResponse aiResponse = module1Client.getRiskAssessment(patientData);

        // Step 3: Save assessment with AI results
        assessment.setRiskScore(aiResponse.getRiskScore());
        assessment.setRiskLevel(aiResponse.getRiskLevel());
        assessment.setFactors(String.join(", ", aiResponse.getFactors()));
        assessment.setRecommendation(aiResponse.getRecommendation());
        assessment.setAssessmentDate(LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return repository.save(assessment);
    }

    public List<Assessment> getAllAssessments() {
        return repository.findAll();
    }

    public Assessment getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Assessment> getByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Assessment> getHighRiskPatients() {
        return repository.findByRiskLevel("Higher Risk");
    }
}