package com.sih.module2.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AIRiskResponse {
    
    @JsonProperty("risk_score")
    private int riskScore;
    
    @JsonProperty("risk_level")
    private String riskLevel;
    
    @JsonProperty("factors")
    private List<String> factors;
    
    @JsonProperty("recommendation")
    private String recommendation;

    // Empty constructor (required by Spring)
    public AIRiskResponse() {}

    // Constructor with all arguments
    public AIRiskResponse(int riskScore, String riskLevel, List<String> factors, String recommendation) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.factors = factors;
        this.recommendation = recommendation;
    }

    // --- MANUAL GETTERS AND SETTERS ---
    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public List<String> getFactors() { return factors; }
    public void setFactors(List<String> factors) { this.factors = factors; }
    
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}