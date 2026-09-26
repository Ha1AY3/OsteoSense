import streamlit as st
import requests
import pandas as pd

BASE_URL = "http://localhost:8080/api/assessments"

st.set_page_config(page_title="OsteoSense Pro", layout="wide", page_icon="🦴")

# Custom CSS for professional medical look
st.markdown("""
<style>
    .metric-card { background-color: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 5px solid #008080; }
    div[data-testid="stMetricValue"] { font-size: 2rem; }
</style>
""", unsafe_allow_html=True)

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    st.title("🦴 OsteoSense Pro")
    st.markdown("AI-Powered Osteoarthritis Screening")
    st.divider()
    
    page = st.radio(
        "Navigation", 
        ["📊 Analytics Dashboard", "🩺 New Screening", "📋 Patient Records"], 
        index=0
    )
    
    st.divider()
    st.caption("System Status:")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=2)
        st.success("✅ Backend Connected")
    except Exception:
        st.error("❌ Backend Offline")

# ==========================================
# PAGE 1: ANALYTICS DASHBOARD
# ==========================================
if page == "📊 Analytics Dashboard":
    st.title(" Regional Screening Analytics")
    st.markdown("Real-time overview of osteoarthritis risk distribution.")
    
    try:
        stats = requests.get(f"{BASE_URL}/stats").json()
        all_assessments = requests.get(BASE_URL).json()
        
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Screenings", stats.get('totalScreenings', 0))
        col2.metric("🔴 High Risk", stats.get('highRiskCases', 0))
        col3.metric("🟡 Moderate Risk", stats.get('moderateRisk', 0))
        col4.metric("🟢 Lower Risk", stats.get('lowerRisk', 0))
        
        st.divider()
        
        chart_col, alert_col = st.columns([2, 1])
        
        with chart_col:
            st.subheader("Risk Distribution Overview")
            chart_data = pd.DataFrame({
                'Risk Level': ['Lower Risk', 'Moderate Risk', 'High Risk'],
                'Count': [
                    stats.get('lowerRisk', 0), 
                    stats.get('moderateRisk', 0), 
                    stats.get('highRiskCases', 0)
                ]
            })
            st.bar_chart(chart_data.set_index('Risk Level'), color="#008080")
            
        with alert_col:
            st.subheader("🚨 High Risk Alerts")
            high_risk = [a for a in all_assessments 
                        if a.get('riskLevel') and 
                        ('High' in str(a['riskLevel']) or 'Red' in str(a['riskLevel']))]
            
            if high_risk:
                for p in high_risk[:5]:
                    st.markdown(f"**{p.get('patientName', 'Unknown')}**")
                    st.caption(f"Score: {p.get('riskScore')} | {str(p.get('assessmentDate', ''))[:10]}")
                    st.divider()
            else:
                st.info("No high risk patients found.")

        st.subheader("Recent Screening Activity")
        recent_df = pd.DataFrame(all_assessments[-10:][::-1])
        if not recent_df.empty:
            display_cols = ['patientId', 'patientName', 'age', 'riskScore', 'riskLevel']
            existing_cols = [c for c in display_cols if c in recent_df.columns]
            st.dataframe(recent_df[existing_cols], use_container_width=True, hide_index=True)
            
    except Exception as e:
        st.error(f"Could not load dashboard data. Is Java running? Error: {e}")

# ==========================================
# PAGE 2: NEW SCREENING
# ==========================================
elif page == "🩺 New Screening":
    st.title(" New Patient Assessment")
    st.markdown("Enter clinical observations below.")
    
    with st.form("screening_form", clear_on_submit=True):
        st.subheader("Patient Demographics")
        d_col1, d_col2, d_col3 = st.columns(3)
        with d_col1: patient_id = st.text_input("Patient ID *", "OA-NEW-01")
        with d_col2: patient_name = st.text_input("Full Name *", "Jane Doe")
        with d_col3: 
            col_a, col_g = st.columns(2)
            age = col_a.number_input("Age", 1, 120, 60)
            gender = col_g.selectbox("Gender", ["Male", "Female", "Other"])
        bmi = st.number_input("BMI", 10.0, 60.0, 25.0, 0.1)
        
        st.divider()
        st.subheader("Primary Symptoms")
        s_col1, s_col2, s_col3 = st.columns(3)
        with s_col1: pain = st.slider("Pain Level (0-10)", 0, 10, 5)
        with s_col2: stiffness = st.selectbox("Stiffness Severity", ["None", "Mild", "Moderate", "Severe"])
        with s_col3: stiffness_duration = st.selectbox("Morning Stiffness Duration", ["None", "<15min", "15-30min", ">=30min"])
        
        st.divider()
        st.subheader("Clinical Signs & Mobility")
        c_col1, c_col2, c_col3, c_col4 = st.columns(4)
        with c_col1: tenderness = st.checkbox("Joint Tenderness")
        with c_col2: reduced_flexibility = st.checkbox("Reduced Flexibility")
        with c_col3: crepitus = st.checkbox("Crepitus (Grinding)")
        with c_col4: swelling = st.checkbox("Joint Swelling")
        
        m_col1, m_col2, m_col3, m_col4 = st.columns(4)
        with m_col1: pain_after_activity = st.checkbox("Pain After Activity")
        with m_col2: pain_at_rest = st.checkbox("Pain At Rest")
        with m_col3: gives_way = st.checkbox("Joint Gives Way")
        with m_col4: sleep_disturbance = st.checkbox("Sleep Disturbance")

        submitted = st.form_submit_button("🚀 Run AI Risk Analysis", type="primary", use_container_width=True)

    if submitted:
        payload = {
            "patientId": patient_id, "patientName": patient_name, "age": age, 
            "gender": gender, "bmi": bmi, "pain": pain, "stiffness": stiffness, 
            "stiffnessDuration": stiffness_duration, "tenderness": tenderness, 
            "reducedFlexibility": reduced_flexibility, "crepitus": crepitus, 
            "swelling": swelling, "painAfterActivity": pain_after_activity, 
            "painAtRest": pain_at_rest, "walkingDifficulty": False, 
            "stairDifficulty": False, "mobilityLimitation": False, 
            "givesWay": gives_way, "sleepDisturbance": sleep_disturbance
        }

        try:
            response = requests.post(BASE_URL, json=payload)
            if response.status_code == 200:
                res = response.json()
                st.success(f"✅ Assessment Complete! Risk Score: {res.get('riskScore')}/100")
                
                r_col1, r_col2 = st.columns(2)
                with r_col1:
                    st.metric("AI Risk Level", res.get('riskLevel', 'Unknown'))
                    st.info("📋 Recommendation:\n" + res.get('recommendation', 'None'))
                with r_col2:
                    st.warning("🔍 AI Factors:\n" + str(res.get('factors', 'None')))
            else:
                st.error(f"Backend Error: {response.text}")
        except Exception:
            st.error("🚨 Cannot connect to Java Backend!")

# ==========================================
# PAGE 3: PATIENT RECORDS
# ==========================================
elif page == "📋 Patient Records":
    st.title("📋 Comprehensive Patient Records")
    st.markdown("Search for a patient to view their complete clinical history.")
    
    search_id = st.text_input("Enter Patient ID:", placeholder="e.g., OA-0001", value="OA-0001")
    
    if st.button("🔍 Retrieve Records", type="primary"):
        try:
            response = requests.get(f"{BASE_URL}/patient/{search_id}")
            if response.status_code == 200:
                data = response.json()
                if data:
                    latest = data[0]
                    
                    st.subheader(f"👤 Patient Profile: {latest.get('patientName', 'Unknown')}")
                    st.divider()
                    
                    p_col1, p_col2, p_col3, p_col4 = st.columns(4)
                    p_col1.metric("Age / Gender", f"{latest.get('age')} / {latest.get('gender')}")
                    p_col2.metric("BMI", latest.get('bmi'))
                    p_col3.metric("Latest Risk Score", f"{latest.get('riskScore')}/100")
                    p_col4.metric("Risk Level", latest.get('riskLevel'))
                    
                    st.divider()
                    st.subheader(" Latest Clinical Observations")
                    v_col1, v_col2, v_col3 = st.columns(3)
                    
                    with v_col1:
                        st.markdown("**Pain & Stiffness**")
                        st.write(f"• Pain Level: **{latest.get('pain')}/10**")
                        st.write(f"• Stiffness: **{latest.get('stiffness')}**")
                        st.write(f"• Duration: **{latest.get('stiffnessDuration')}**")
                        
                    with v_col2:
                        st.markdown("**Physical Signs**")
                        st.write(f"• Tenderness: {'✅' if latest.get('tenderness') else '❌'}")
                        st.write(f"• Reduced Flexibility: {'✅' if latest.get('reducedFlexibility') else '❌'}")
                        st.write(f"• Crepitus: {'✅' if latest.get('crepitus') else '❌'}")
                        st.write(f"• Swelling: {'✅' if latest.get('swelling') else '❌'}")
                        
                    with v_col3:
                        st.markdown("**Mobility & Sleep**")
                        st.write(f"• Pain After Activity: {'✅' if latest.get('painAfterActivity') else '❌'}")
                        st.write(f"• Pain At Rest: {'✅' if latest.get('painAtRest') else '❌'}")
                        st.write(f"• Joint Gives Way: {'✅' if latest.get('givesWay') else '❌'}")
                        st.write(f"• Sleep Disturbance: {'✅' if latest.get('sleepDisturbance') else '❌'}")
                    
                    st.divider()
                    st.subheader("🤖 AI Clinical Recommendation")
                    st.info(latest.get('recommendation', 'No recommendation provided.'))
                    st.warning("**Identified Risk Factors:** " + str(latest.get('factors', 'None')))

                    st.subheader(f"📅 Assessment History ({len(data)} records)")
                    df = pd.DataFrame(data)
                    display_cols = ['assessmentDate', 'pain', 'stiffness', 'riskScore', 'riskLevel']
                    existing_cols = [c for c in display_cols if c in df.columns]
                    st.dataframe(df[existing_cols], use_container_width=True, hide_index=True)
                    
                else:
                    st.warning(f"No records found for ID: {search_id}")
            else:
                st.error("Failed to fetch records.")
        except Exception:
            st.error("🚨 Cannot connect to Backend!")