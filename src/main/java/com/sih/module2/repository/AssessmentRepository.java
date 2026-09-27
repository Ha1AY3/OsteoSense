package com.sih.module2.repository;

import com.sih.module2.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByPatientId(String patientId);
    List<Assessment> findByRiskLevel(String riskLevel);
}

