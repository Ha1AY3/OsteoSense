package com.sih.module2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;
    private String patientName;
    private int age;
    private String gender;
    private double bmi;
    private int pain;
    private String stiffness;
    private String stiffnessDuration;
    private boolean tenderness;
    private boolean reducedFlexibility;
    private boolean crepitus;
    private boolean swelling;
    private boolean painAfterActivity;
    private boolean painAtRest;
    private boolean walkingDifficulty;
    private boolean stairDifficulty;
    private boolean mobilityLimitation;
    private boolean givesWay;
    private boolean sleepDisturbance;

    private Integer riskScore;
    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String factors;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    private String assessmentDate;

    // --- MANUAL GETTERS AND SETTERS (Fixes all errors) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public double getBmi() { return bmi; }
    public void setBmi(double bmi) { this.bmi = bmi; }
    public int getPain() { return pain; }
    public void setPain(int pain) { this.pain = pain; }
    public String getStiffness() { return stiffness; }
    public void setStiffness(String stiffness) { this.stiffness = stiffness; }
    public String getStiffnessDuration() { return stiffnessDuration; }
    public void setStiffnessDuration(String stiffnessDuration) { this.stiffnessDuration = stiffnessDuration; }
    public boolean isTenderness() { return tenderness; }
    public void setTenderness(boolean tenderness) { this.tenderness = tenderness; }
    public boolean isReducedFlexibility() { return reducedFlexibility; }
    public void setReducedFlexibility(boolean reducedFlexibility) { this.reducedFlexibility = reducedFlexibility; }
    public boolean isCrepitus() { return crepitus; }
    public void setCrepitus(boolean crepitus) { this.crepitus = crepitus; }
    public boolean isSwelling() { return swelling; }
    public void setSwelling(boolean swelling) { this.swelling = swelling; }
    public boolean isPainAfterActivity() { return painAfterActivity; }
    public void setPainAfterActivity(boolean painAfterActivity) { this.painAfterActivity = painAfterActivity; }
    public boolean isPainAtRest() { return painAtRest; }
    public void setPainAtRest(boolean painAtRest) { this.painAtRest = painAtRest; }
    public boolean isWalkingDifficulty() { return walkingDifficulty; }
    public void setWalkingDifficulty(boolean walkingDifficulty) { this.walkingDifficulty = walkingDifficulty; }
    public boolean isStairDifficulty() { return stairDifficulty; }
    public void setStairDifficulty(boolean stairDifficulty) { this.stairDifficulty = stairDifficulty; }
    public boolean isMobilityLimitation() { return mobilityLimitation; }
    public void setMobilityLimitation(boolean mobilityLimitation) { this.mobilityLimitation = mobilityLimitation; }
    public boolean isGivesWay() { return givesWay; }
    public void setGivesWay(boolean givesWay) { this.givesWay = givesWay; }
    public boolean isSleepDisturbance() { return sleepDisturbance; }
    public void setSleepDisturbance(boolean sleepDisturbance) { this.sleepDisturbance = sleepDisturbance; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public String getFactors() { return factors; }
    public void setFactors(String factors) { this.factors = factors; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(String assessmentDate) { this.assessmentDate = assessmentDate; }
}