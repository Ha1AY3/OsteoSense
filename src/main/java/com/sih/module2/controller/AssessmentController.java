package com.sih.module2.controller;

import com.sih.module2.model.Assessment;
import com.sih.module2.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*")
public class AssessmentController {

    @Autowired
    private AssessmentService service;

    // CREATE: Health worker submits assessment form
    @PostMapping
    public ResponseEntity<?> createAssessment(@RequestBody Assessment assessment) {
        try {
            Assessment saved = service.createAssessment(assessment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // READ: Get all assessments
    @GetMapping
    public List<Assessment> getAllAssessments() {
        return service.getAllAssessments();
    }

    // READ: Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getById(@PathVariable Long id) {
        Assessment assessment = service.getById(id);
        return assessment != null ? ResponseEntity.ok(assessment) : ResponseEntity.notFound().build();
    }

    // READ: Get by Patient ID
    @GetMapping("/patient/{patientId}")
    public List<Assessment> getByPatientId(@PathVariable String patientId) {
        return service.getByPatientId(patientId);
    }

    // READ: Get high risk patients only
    @GetMapping("/high-risk")
    public List<Assessment> getHighRiskPatients() {
        return service.getHighRiskPatients();
    }

    // STATISTICS: For dashboard
    
@GetMapping("/stats")
public Map<String, Object> getStats() {
    List<Assessment> all = service.getAllAssessments();
    
    Map<String, Object> stats = new HashMap<>();
    stats.put("totalScreenings", all.size());
    
    // Case-insensitive matching that catches ANY variation
    stats.put("highRiskCases", all.stream()
            .filter(a -> a.getRiskLevel() != null && 
                   a.getRiskLevel().toLowerCase().matches(".*(high|red|severe).*"))
            .count());
            
    stats.put("moderateRisk", all.stream()
            .filter(a -> a.getRiskLevel() != null && 
                   a.getRiskLevel().toLowerCase().contains("moderate"))
            .count());
            
    stats.put("lowerRisk", all.stream()
            .filter(a -> a.getRiskLevel() != null && 
                   a.getRiskLevel().toLowerCase().matches(".*(low|mild).*"))
            .count());
    
    return stats;
}

    // HEALTH CHECK
    @GetMapping("/health")
    public String health() {
        return "Module 2 is running! ✅";
    }
}