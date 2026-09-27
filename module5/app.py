import streamlit as st
import requests
import pandas as pd
import random
from fpdf import FPDF

BASE_URL = "http://localhost:8080/api/assessments"

st.set_page_config(page_title="OsteoSense Pro", layout="wide", page_icon="🦴")

st.markdown("""
<style>
    .metric-card { background-color: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 5px solid #008080; }
    div[data-testid="stMetricValue"] { font-size: 2rem; }
</style>
""", unsafe_allow_html=True)

# --- COMPLETE MULTILINGUAL DICTIONARY (Natural, Human Translations) ---
# --- COMPLETE MULTILINGUAL DICTIONARY (Exact Keys for Dropdown) ---
TEXT = {
    "English": {
        "nav_dashboard": "📊 Analytics Dashboard", "nav_screening": "🩺 New Screening",
        "nav_records": " Patient Records", "nav_admin": "🏥 Admin & Reporting",
        "dashboard_title": " Regional Screening Analytics", "real_time_text": "Real-time overview of osteoarthritis risk distribution.",
        "total_screenings": "Total Screenings", "high_risk": "🔴 High Risk", "moderate_risk": "🟡 Moderate Risk", "lower_risk": "🟢 Lower Risk",
        "risk_distribution": "Risk Distribution Overview", "high_risk_alerts": "🚨 High Risk Alerts", "no_high_risk": "No high risk patients found.",
        "recent_activity": "Recent Screening Activity", "screening_title": "🦴 OsteoSense Clinical Questionnaire",
        "form_instruction": "Please complete the following assessment. Fields marked with * are required.",
        "step_1": "Step 1 of 4: Demographics", "step_2": "Step 2 of 4: Pain & Stiffness", "step_3": "Step 3 of 4: Physical Symptoms", "step_4": "Step 4 of 4: Functional Limitations",
        "section_1": "👤 Section 1: Patient Demographics", "patient_id": "Patient ID *", "full_name": "Full Name *", "age": "Age *", "gender": "Gender *", "bmi": "Body Mass Index (BMI) *", "bmi_help": "Weight(kg) / Height(m)²",
        "section_2": "📉 Section 2: Pain & Stiffness Profile", "pain_level": "Current Pain Level (0-10) *", "stiffness_severity": "Stiffness Severity *", "stiffness_duration": "Morning Stiffness Duration *",
        "section_3": " Section 3: Physical & Joint Symptoms", "check_apply": "Check all that apply to the patient's current condition:", "tenderness": "Joint Tenderness", "reduced_flexibility": "Reduced Flexibility", "crepitus": "Crepitus (Grinding sound)", "swelling": "Joint Swelling",
        "section_4": "🚶 Section 4: Mobility & Lifestyle Impact", "pain_after_activity": "Pain After Activity", "pain_at_rest": "Pain At Rest", "gives_way": "Joint Gives Way / Buckling", "sleep_disturbance": "Sleep Disturbance", "walking_difficulty": "Walking Difficulty", "stair_difficulty": "Stair Difficulty", "mobility_limitation": "General Mobility Limitation",
        "submit_btn": "🚀 Submit Questionnaire & Analyze Risk", "hardware_title": "📡 Module 2: Hardware Sensor Integration", "hardware_desc": "Connect external sensors (IMU/Gait Camera) for automated screening.",
        "hardware_btn": "📡 Simulate Hardware Sensor Scan", "receiving_data": "🔄 Receiving data from IMU Sensor / Camera via Bluetooth...", "hardware_success": "✅ Hardware Data Received & Analyzed! Risk Score: {}/100", "hardware_failed": "Hardware connection failed.",
        "questionnaire_submitted": "✅ Questionnaire Submitted! AI Risk Score: {}/100", "ai_risk_level": "AI Risk Level", "clinical_recommendation": " Clinical Recommendation:", "key_risk_factors": "🔍 Key Risk Factors:",
        "records_title": "📋 Comprehensive Patient Records", "search_instruction": "Search for a patient to view their complete clinical history.", "search_id": "Enter Patient ID:", "search_placeholder": "e.g., OA-0001", "retrieve_btn": "🔍 Retrieve Records", "patient_profile": "👤 Patient Profile: {}", "age_gender": "Age / Gender", "latest_risk_score": "Latest Risk Score", "risk_level": "Risk Level",
        "clinical_observations": "🩺 Latest Clinical Observations", "pain_stiffness": "**Pain & Stiffness**", "physical_signs": "**Physical Signs**", "mobility_sleep": "**Mobility & Sleep**", "ai_recommendation": "🤖 AI Clinical Recommendation", "risk_factors": "**Identified Risk Factors:** {}",
        "pdf_title": "📄 Module 4: Official Clinical Report", "pdf_btn": " Generate & Download PDF Report", "pdf_success": "✅ PDF Report generated successfully!", "pdf_download": "Click here to save the PDF", "assessment_history": "📅 Assessment History ({} records)", "no_records": "No records found for ID: {}",
        "admin_title": "🏥 Administrative Reporting & Analytics", "admin_desc": "System-wide data aggregation, trend analysis, and bulk export tools.", "export_title": "📥 Data Export & Auditing", "export_btn": "📄 Download Full Audit Report (CSV)", "trend_title": "📈 Clinical Trend Analysis", "risk_vs_age": "**Risk Score vs. Age**", "pain_distribution": "**Pain Level Distribution**", "followup_title": "🚨 High Priority Follow-Up List", "sms_btn": "📨 Send Bulk SMS Reminder", "sms_success": "✅ Mockup: Reminders sent to {} patients!", "no_followup": "No high-risk patients require immediate follow-up.", "no_data": "No data available. Please run screenings first.",
        "backend_connected": "✅ Backend Connected", "backend_offline": "❌ Backend Offline"
    },
    "Hindi": {
        "nav_dashboard": "📊 स्क्रीनिंग रिपोर्ट", "nav_screening": " नई जांच", "nav_records": " मरीज़ का रिकॉर्ड", "nav_admin": "🏥 एडमिन रिपोर्ट",
        "dashboard_title": "📊 क्षेत्रीय स्क्रीनिंग रिपोर्ट", "real_time_text": "ऑस्टियोआर्थराइटिस जोखिम का तुरंत अवलोकन",
        "total_screenings": "कुल स्क्रीनिंग", "high_risk": "🔴 उच्च जोखिम", "moderate_risk": "🟡 मध्यम जोखिम", "lower_risk": "🟢 कम जोखिम",
        "risk_distribution": "जोखिम वितरण", "high_risk_alerts": "🚨 उच्च जोखिम वाले मरीज़", "no_high_risk": "कोई उच्च जोखिम मरीज़ नहीं मिला", "recent_activity": "हाल की स्क्रीनिंग",
        "screening_title": "🦴 OsteoSense स्वास्थ्य जांच फॉर्म", "form_instruction": "कृपया यह फॉर्म भरें। * वाले सभी खाने भरना जरूरी है।",
        "step_1": "चरण 1: मरीज़ की जानकारी", "step_2": "चरण 2: दर्द और अकड़न", "step_3": "चरण 3: शारीरिक लक्षण", "step_4": "चरण 4: चलने-फिरने में कठिनाई",
        "section_1": "👤 खंड 1: मरीज़ की बुनियादी जानकारी", "patient_id": "मरीज़ आईडी *", "full_name": "पूरा नाम *", "age": "उम्र *", "gender": "लिंग *", "bmi": "बॉडी मास इंडेक्स (BMI) *", "bmi_help": "वजन(kg) / कद(m)²",
        "section_2": "📉 खंड 2: दर्द और जोड़ों की अकड़न", "pain_level": "अभी दर्द कितना है? (0-10) *", "stiffness_severity": "अकड़न कितनी है? *", "stiffness_duration": "सुबह की अकड़न कितनी देर रहती है? *",
        "section_3": "🦴 खंड 3: शारीरिक और जोड़ों के लक्षण", "check_apply": "मरीज़ की स्थिति के हिसाब से जो भी सही हो चुनें:", "tenderness": "जोड़ों में छूने पर दर्द", "reduced_flexibility": "जोड़ों का अकड़ जाना", "crepitus": "जोड़ों में चरमराहट", "swelling": "जोड़ों में सूजन",
        "section_4": "🚶 खंड 4: चलने-फिरने पर असर", "pain_after_activity": "काम के बाद दर्द", "pain_at_rest": "आराम में भी दर्द", "gives_way": "जोड़ का अचानक झुक जाना", "sleep_disturbance": "नींद में खलल", "walking_difficulty": "चलने में कठिनाई", "stair_difficulty": "सीढ़ियां चढ़ने में कठिनाई", "mobility_limitation": "चलने-फिरने में कठिनाई",
        "submit_btn": "🚀 फॉर्म जमा करें और जोखिम जांचें", "hardware_title": "📡 Module 2: हार्डवेयर सेंसर", "hardware_desc": "ऑटोमैटिक स्क्रीनिंग के लिए सेंसर से जोड़ें",
        "hardware_btn": "📡 सेंसर से डेटा लें", "receiving_data": "🔄 सेंसर से डेटा आ रहा है...", "hardware_success": "✅ सेंसर डेटा मिला! जोखिम स्कोर: {}/100", "hardware_failed": "सेंसर से जुड़ नहीं पाया",
        "questionnaire_submitted": "✅ फॉर्म जमा हो गया! जोखिम स्कोर: {}/100", "ai_risk_level": "AI जोखिम स्तर", "clinical_recommendation": "📋 डॉक्टर की सलाह:", "key_risk_factors": "🔍 मुख्य जोखिम कारक:",
        "records_title": "📋 मरीज़ का पूरा रिकॉर्ड", "search_instruction": "मरीज़ का रिकॉर्ड देखने के लिए ID डालें", "search_id": "मरीज़ ID:", "search_placeholder": "जैसे OA-0001", "retrieve_btn": "🔍 रिकॉर्ड खोजें", "patient_profile": "👤 मरीज़: {}", "age_gender": "उम्र / लिंग", "latest_risk_score": "नवीनतम जोखिम स्कोर", "risk_level": "जोखिम स्तर",
        "clinical_observations": "🩺 नवीनतम अवलोकन", "pain_stiffness": "**दर्द और अकड़न**", "physical_signs": "**शारीरिक लक्षण**", "mobility_sleep": "**चलना-फिरना और नींद**", "ai_recommendation": " AI की सलाह", "risk_factors": "**पहचाने गए जोखिम कारक:** {}",
        "pdf_title": "📄 Module 4: आधिकारिक मेडिकल रिपोर्ट", "pdf_btn": "📄 PDF रिपोर्ट डाउनलोड करें", "pdf_success": "✅ PDF रिपोर्ट तैयार हो गई!", "pdf_download": "PDF सेव करने के लिए क्लिक करें", "assessment_history": "📅 पिछली जांच ({} रिकॉर्ड)", "no_records": "ID {} के लिए कोई रिकॉर्ड नहीं मिला",
        "admin_title": "🏥 एडमिन रिपोर्ट और विश्लेषण", "admin_desc": "सभी डेटा का विश्लेषण और एक्सपोर्ट टूल्स", "export_title": " डेटा एक्सपोर्ट", "export_btn": "📄 पूरी रिपोर्ट डाउनलोड करें (CSV)", "trend_title": "📈 क्लिनिकल ट्रेंड", "risk_vs_age": "**जोखिम स्कोर vs उम्र**", "pain_distribution": "**दर्द स्तर का वितरण**", "followup_title": "🚨 तुरंत फॉलो-अप वाले मरीज़", "sms_btn": "📨 सभी को SMS भेजें", "sms_success": "✅ {} मरीज़ों को SMS भेज दिया!", "no_followup": "कोई भी मरीज़ फॉलो-अप के लिए नहीं है", "no_data": "कोई डेटा नहीं है।",
        "backend_connected": "✅ सिस्टम चालू है", "backend_offline": "❌ सिस्टम बंद है"
    },
    "Assamese": {
        "nav_dashboard": "📊 স্ক্ৰীনিং ৰিপ'ৰ্ট", "nav_screening": "🩺 নতুন পৰীক্ষা", "nav_records": "📋 ৰোগীৰ তথ্য", "nav_admin": " এডমিন ৰিপ'ৰ্ট",
        "dashboard_title": "📊 আঞ্চলিক স্ক্ৰীনিং ৰিপ'ৰ্ট", "real_time_text": "অষ্টিঅ'আৰ্থ্ৰাইটিছৰ ঝুঁকিৰ তৎক্ষণাত দৃশ্য",
        "total_screenings": "মুঠ স্ক্ৰীনিং", "high_risk": " উচ্চ ঝুঁকি", "moderate_risk": "🟡 মধ্যমীয়া ঝুঁকি", "lower_risk": "🟢 কম ঝুঁকি",
        "risk_distribution": "ঝুঁকি বিতৰণ", "high_risk_alerts": "🚨 উচ্চ ঝুঁকি ৰোগী", "no_high_risk": "কোনো উচ্চ ঝুঁকি ৰোগী পোৱা নগ'ল", "recent_activity": "শেহতীয়া স্ক্ৰীনিং",
        "screening_title": "🦴 OsteoSense স্বাস্থ্য পৰীক্ষা ফৰ্ম", "form_instruction": "অনুগ্ৰহ কৰি এই ফৰ্ম পূৰণ কৰক। * থকা সকলো খালী ঠাই পূৰণ কৰাটো বাধ্যতামূলক।",
        "step_1": "পৰ্যায় ১: ৰোগীৰ তথ্য", "step_2": "পৰ্যায় ২: বিষ আৰু টান", "step_3": "পৰ্যায় ৩: শাৰীৰিক লক্ষণ", "step_4": "পৰ্যায় ৪: চলাফিৰা কৰাত অসুবিধা",
        "section_1": "👤 অংশ ১: ৰোগীৰ মৌলিক তথ্য", "patient_id": "ৰোগী আইডি *", "full_name": "সম্পূৰ্ণ নাম *", "age": "বয়স *", "gender": "লিংগ *", "bmi": "বডি মাছ ইণ্ডেক্স (BMI) *", "bmi_help": "ওজন(kg) / উচ্চতা(m)²",
        "section_2": "📉 অংশ ২: বিষ আৰু গাঁঠিৰ টান", "pain_level": "এতিয়া বিষ কিমান? (0-10) *", "stiffness_severity": "টান কিমান? *", "stiffness_duration": "পুৱা উঠি টান কিমান দেৰি থাকে? *",
        "section_3": " অংশ ৩: শাৰীৰিক লক্ষণ", "check_apply": "ৰোগীৰ অৱস্থা অনুসৰি যি শুদ্ধ সেয়া বাছনি কৰক:", "tenderness": "গাঁঠিত ছুঁলে বিষ", "reduced_flexibility": "গাঁঠিৰ টান", "crepitus": "গাঁঠিত শব্দ হোৱা", "swelling": "গাঁঠি ফুলা",
        "section_4": "🚶 অংশ ৪: চলাফিৰাত প্ৰভা", "pain_after_activity": "কামৰ পিছত বিষ", "pain_at_rest": "আৰামত থাকোঁতেও বিষ", "gives_way": "গাঁঠি হঠাৎ দুৰ্বল হোৱা", "sleep_disturbance": "টোপনিত ব্যাঘাত", "walking_difficulty": "খোজ কঢ়াত অসুবিধা", "stair_difficulty": "চিৰি চঢ়াত অসুবিধা", "mobility_limitation": "চলাফিৰাত অসুবিধা",
        "submit_btn": "🚀 ফৰ্ম জমা দিয়ক", "hardware_title": "📡 Module 2: হাৰ্ডেৰ ছেন্সৰ", "hardware_desc": "স্বয়ংক্ৰিয় পৰীক্ষাৰ বাবে ছেন্সৰ সংযোগ কৰক",
        "hardware_btn": "📡 ছেন্সৰৰ পৰা তথ্য লওক", "receiving_data": "🔄 ছেন্সৰৰ পৰা তথ্য আহি আছে...", "hardware_success": "✅ ছেন্সৰ তথ্য পালোঁ! ঝুঁকি স্ক'ৰ: {}/100", "hardware_failed": "ছেন্সৰ সংযোগ হ'ব নোৱাৰিলে",
        "questionnaire_submitted": "✅ ফৰ্ম জমা হ'ল! ঝুঁকি স্ক'ৰ: {}/100", "ai_risk_level": "AI ঝুঁকি স্তৰ", "clinical_recommendation": "📋 ডাক্তৰৰ পৰামৰ্শ:", "key_risk_factors": "🔍 মূল ঝুঁকি কাৰক:",
        "records_title": "📋 ৰোগীৰ সম্পূৰ্ণ তথ্য", "search_instruction": "ৰোগীৰ তথ্য চাবলৈ আইডি দিয়ক", "search_id": "ৰোগী আইডি:", "search_placeholder": "যেনে OA-0001", "retrieve_btn": "🔍 তথ্য বিচাৰক", "patient_profile": "👤 ৰোগী: {}", "age_gender": "বয়স / লিংগ", "latest_risk_score": "শেহতীয়া ঝুঁকি স্ক'ৰ", "risk_level": "ঝুঁকি স্তৰ",
        "clinical_observations": "🩺 শেহতীয়া পৰ্যবেক্ষণ", "pain_stiffness": "**বিষ আৰু টান**", "physical_signs": "**শাৰীৰিক লক্ষণ**", "mobility_sleep": "**চলাফিৰা আৰু টোপনি**", "ai_recommendation": "🤖 AI ৰ পৰামৰ্শ", "risk_factors": "**চিনাক্ত কৰা ঝুঁকি কাৰক:** {}",
        "pdf_title": "📄 Module 4: আনুষ্ঠানিক চিকিৎসা ৰিপ'ৰ্ট", "pdf_btn": "📄 PDF ৰিপ'ৰ্ট ডাউনলোড কৰক", "pdf_success": "✅ PDF ৰিপ'ৰ্ট সাজু হ'ল!", "pdf_download": "PDF ছেভ কৰিবলৈ ক্লিক কৰক", "assessment_history": "📅 পূৰ্বৰ পৰীক্ষা ({} ৰেকৰ্ড)", "no_records": "ID {} ৰ বাবে কোনো ৰেকৰ্ড পোৱা নগ'ল",
        "admin_title": "🏥 এডমিন ৰিপ'ৰ্ট", "admin_desc": "সকলো তথ্যৰ বিশ্লেষণ", "export_title": "📥 তথ্য এক্সপ'ৰ্ট", "export_btn": "📄 সম্পূৰ্ণ ৰিপ'ৰ্ট ডাউনলোড (CSV)", "trend_title": "📈 ক্লিনিকেল ট্ৰেণ্ড", "risk_vs_age": "**ঝুঁকি স্ক'ৰ vs বয়স**", "pain_distribution": "**বিষৰ স্তৰ**", "followup_title": "🚨 তৎকালীন ফলো-আপ ৰোগী", "sms_btn": "📨 সকলোকে SMS পঠাওক", "sms_success": "✅ {} ৰোগীলৈ SMS পঠিওৱা হ'ল!", "no_followup": "কোনো ৰোগী ফলো-আপৰ বাবে নাই", "no_data": "কোনো তথ্য নাই।",
        "backend_connected": "✅ চিষ্টেম চলি আছে", "backend_offline": "❌ চিষ্টেম বন্ধ আছে"
    },
    "Bengali": {
        "nav_dashboard": "📊 স্ক্রিনিং রিপোর্ট", "nav_screening": "🩺 নতুন পরীক্ষা", "nav_records": "📋 রোগীর রেকর্ড", "nav_admin": "🏥 অ্যাডমিন রিপোর্ট",
        "dashboard_title": "📊 আঞ্চলিক স্ক্রিনিং রিপোর্ট", "real_time_text": "অস্টিওআর্থ্রাইটিস ঝুঁকির তাৎক্ষণিক দৃশ্য",
        "total_screenings": "মোট স্ক্রিনিং", "high_risk": "🔴 উচ্চ ুঁকি", "moderate_risk": "🟡 মাঝারি ঝুঁকি", "lower_risk": " কম ঝুঁকি",
        "risk_distribution": "ঝুঁকি বিতরণ", "high_risk_alerts": " উচ্চ ঝুঁকি রোগী", "no_high_risk": "কোনো উচ্চ ঝুঁকি রোগী পাওয়া যায়নি", "recent_activity": "সাম্প্রতিক স্ক্রিনিং",
        "screening_title": " OsteoSense স্বাস্থ্য পরীক্ষা ফর্ম", "form_instruction": "অনুগ্রহ করে এই ফর্মটি পূরণ করুন। * চিহ্নিত সব ঘর পূরণ করা বাধ্যতামূলক।",
        "step_1": "ধাপ : রোগীর তথ্য", "step_2": "ধাপ ২: ব্যথা ও শক্ত হওয়া", "step_3": "ধাপ ৩: শারীরিক লক্ষণ", "step_4": "ধাপ ৪: চলাফেরায় অসুবিধা",
        "section_1": "👤 অংশ ১: রোগীর মৌলিক তথ্য", "patient_id": "রোগী আইডি *", "full_name": "পুরো নাম *", "age": "বয়স *", "gender": "লিঙ্গ *", "bmi": "বডি মাস ইনডেক্স (BMI) *", "bmi_help": "ওজন(kg) / উচ্চতা(m)²",
        "section_2": "📉 অংশ ২: ব্যথা ও জয়েন্ট শক্ত হওয়া", "pain_level": "এখন ব্যথা কত? (0-10) *", "stiffness_severity": "শক্ত হওয়া কতটা? *", "stiffness_duration": "সকালে উঠে কতক্ষণ শক্ত থাকে? *",
        "section_3": " অংশ ৩: শারীরিক লক্ষণ", "check_apply": "রোগীর অবস্থা অনুযায়ী যা সঠিক তা বেছে নিন:", "tenderness": "জয়েন্টে ছুঁলে ব্যথা", "reduced_flexibility": "জয়েন্ট শক্ত হয়ে যাওয়া", "crepitus": "জয়েন্টে শব্দ হওয়া", "swelling": "জয়েন্ট ফোলা",
        "section_4": "🚶 অংশ ৪: চলাফেরায় প্রভাব", "pain_after_activity": "কাজের পরে ব্যথা", "pain_at_rest": "বিশ্রামেও ব্যথা", "gives_way": "জয়েন্ট হঠাৎ দুর্বল হওয়া", "sleep_disturbance": "ঘুমে ব্যাঘাত", "walking_difficulty": "হাঁটতে কষ্ট", "stair_difficulty": "সিঁড়ি চড়তে কষ্ট", "mobility_limitation": "চলাফেরায় অসুবিধা",
        "submit_btn": "🚀 ফর্ম জমা দিন", "hardware_title": "📡 Module 2: হার্ডওয়্যার সেন্সর", "hardware_desc": "স্বয়ংক্রিয় পরীক্ষার জন্য সেন্সর যুক্ত করুন",
        "hardware_btn": "📡 সেন্সর থেকে ডেটা নিন", "receiving_data": "🔄 সেন্সর থেকে ডেটা আসছে...", "hardware_success": "✅ সেন্সর ডেটা পেয়েছি! ঝুঁকি স্কোর: {}/100", "hardware_failed": "সেন্সর যুক্ত হতে পারেনি",
        "questionnaire_submitted": "✅ ফর্ম জমা হয়েছে! ঝুঁকি স্কোর: {}/100", "ai_risk_level": "AI ঝুঁকি স্তর", "clinical_recommendation": "📋 ডাক্তারের পরামর্শ:", "key_risk_factors": "🔍 মূল ঝুঁকি কারণ:",
        "records_title": " রোগীর সম্পূর্ণ রেকর্ড", "search_instruction": "রোগীর রেকর্ড দেখতে আইডি দিন", "search_id": "রোগী আইডি:", "search_placeholder": "যেমন OA-0001", "retrieve_btn": "🔍 রেকর্ড খুঁজুন", "patient_profile": " রোগী: {}", "age_gender": "বয়স / লিঙ্গ", "latest_risk_score": "সাম্প্রতিক ুঁকি স্কোর", "risk_level": "ঝুঁকি স্তর",
        "clinical_observations": "🩺 সাম্প্রতিক পর্যবেক্ষণ", "pain_stiffness": "**ব্যথা ও শক্ত হওয়া**", "physical_signs": "**শারীরিক লক্ষণ**", "mobility_sleep": "**চলাফেরা ও ঘুম**", "ai_recommendation": "🤖 AI এর পরামর্শ", "risk_factors": "**শনাক্তকৃত ঝুঁকি কারণ:** {}",
        "pdf_title": "📄 Module 4: আনুষ্ঠানিক চিকিৎসা রিপোর্ট", "pdf_btn": "📄 PDF রিপোর্ট ডাউনলোড", "pdf_success": "✅ PDF রিপোর্ট তৈরি হয়েছে!", "pdf_download": "PDF সেভ করতে ক্লিক করুন", "assessment_history": "📅 পূর্ববর্তী পরীক্ষা ({} রেকর্ড)", "no_records": "ID {} এর জন্য কোনো রেকর্ড পাওয়া যায়নি",
        "admin_title": "🏥 অ্যাডমিন রিপোর্ট", "admin_desc": "সব ডেটার বিশ্লেষণ", "export_title": "📥 ডেটা এক্সপোর্ট", "export_btn": " সম্পূর্ণ রিপোর্ট ডাউনলোড (CSV)", "trend_title": "📈 ক্লিনিক্যাল ট্রেন্ড", "risk_vs_age": "**ঝুঁকি স্কোর vs বয়স**", "pain_distribution": "**ব্যথার মাত্রা**", "followup_title": "🚨 জরুরি ফলো-আপ রোগী", "sms_btn": "📨 সবাইকে SMS পাঠান", "sms_success": "✅ {} রোগীকে SMS পাঠানো হয়েছে!", "no_followup": "কোনো রোগী ফলো-আপের জন্য নেই", "no_data": "কোনো ডেটা নেই।",
        "backend_connected": "✅ সিস্টেম চালু আছে", "backend_offline": "❌ সিস্টেম বন্ধ আছে"
    },
    "Manipuri": {
        "nav_dashboard": "📊 স্ক্রীনিং রিপোর্ট", "nav_screening": "🩺 নৱ পরীক্ষা", "nav_records": "📋 পেশেন্টকী রেকোর্দ", "nav_admin": "🏥 এডমিন রিপোর্ট",
        "dashboard_title": " অঞ্চলগী স্ক্রীনিং রিপোর্ট", "real_time_text": "OA ঝুঁকীগী অৱলোকন",
        "total_screenings": "মপুং ফাবা স্ক্রীনিং", "high_risk": "🔴 য়াম্না ঝুঁকি", "moderate_risk": " মাঝারি ঝুঁকি", "lower_risk": "🟢 কম ঝুঁকি",
        "risk_distribution": "ঝুঁকি বিতরণ", "high_risk_alerts": "🚨 য়াম্না ঝুঁকি পেশেন্ট", "no_high_risk": "ঝুঁকি পেশেন্ট অমা য়াওদে", "recent_activity": "মথংগী স্ক্রীনিং",
        "screening_title": "🦴 OsteoSense হেলথ চেক ফর্ম", "form_instruction": "মসি ফিল্লবিয়ু। * লৈবা অয়াম্বা ফিল্লবা য়াগনি।",
        "step_1": "স্টেপ ১: পেশেন্টকী ইনফো", "step_2": "স্টেপ ২: নুংঙাইতবা", "step_3": "স্টেপ ৩: বডি লক্ষণ", "step_4": "স্টেপ ৪: চৎনবদা অসুবিধা",
        "section_1": "👤 সেক্সন ১: পেশেন্ট ইনফো", "patient_id": "পেশেন্ট আইডি *", "full_name": "মিং *", "age": "চহী *", "gender": "নাপা/নপী *", "bmi": "BMI *", "bmi_help": "ওজন/উচ্চতা",
        "section_2": "📉 সেক্সন ২: নুংঙাইতবা", "pain_level": "অদোমগী নুংঙাইতবা (0-10) *", "stiffness_severity": "হার্দোকপা কয়া? *", "stiffness_duration": "অয়ুক্না হার্দোকপা কয়া চৎলে? *",
        "section_3": "🦴 সেক্সন ৩: বডি লক্ষণ", "check_apply": "ফিতপা সিল্লবিয়ু:", "tenderness": "নুংঙাইতবা", "reduced_flexibility": "হার্দোকপা", "crepitus": "শক্তা", "swelling": "ফাথোকপা",
        "section_4": "🚶 সেক্সন ৪: চৎনবা", "pain_after_activity": "থৌরায় তৌরবা মতুংদা", "pain_at_rest": "লেপ্লিঙৈদসু", "gives_way": "হার্দোক-শক্লেন", "sleep_disturbance": "অৱা নুংঙাইতবা", "walking_difficulty": "চৎনবা", "stair_difficulty": "স্তেয়র চন্নবা", "mobility_limitation": "চৎনবদা অসুবিধা",
        "submit_btn": "🚀 ফর্ম সাবমিত তৌবীয়ু", "hardware_title": "📡 Module 2: হার্দৱেয়র", "hardware_desc": "সেন্সর কন্নেক্ট তৌবীয়ু",
        "hardware_btn": " সেন্সর ডেটা লৌবীয়ু", "receiving_data": "🔄 ডেটা লাক্লি...", "hardware_success": "✅ ডেটা ফংলে! স্কোর: {}/100", "hardware_failed": "কন্নেক্ট তৌবা ঙমদ্রে",
        "questionnaire_submitted": "✅ সাবমিত তৌরে! স্কোর: {}/100", "ai_risk_level": "AI ঝুঁকি", "clinical_recommendation": "📋 ডাক্তরগী অৱায়", "key_risk_factors": "🔍 ঝুঁকি ফেক্টর:",
        "records_title": "📋 পেশেন্ট রেকোর্দ", "search_instruction": "আইডি পীয়ু", "search_id": "আইডি:", "search_placeholder": "OA-0001", "retrieve_btn": "🔍 সার্চ তৌবীয়ু", "patient_profile": " পেশেন্ট: {}", "age_gender": "চহী / নাপা-নপী", "latest_risk_score": "মথংগী স্কোর", "risk_level": "ঝুঁকি",
        "clinical_observations": " লক্ষণ", "pain_stiffness": "**নুংঙাইতবা**", "physical_signs": "**বডি লক্ষণ**", "mobility_sleep": "**চৎনবা**", "ai_recommendation": "🤖 AI অৱায়", "risk_factors": "**ফেক্টর:** {}",
        "pdf_title": "📄 Module 4: PDF রিপোর্ট", "pdf_btn": " PDF ডাউনলোদ", "pdf_success": "✅ PDF ফংলে!", "pdf_download": "ক্লিক তৌবীয়ু", "assessment_history": "📅 হিস্টোরি ({})", "no_records": "ফংদ্রে {}",
        "admin_title": "🏥 এডমিন", "admin_desc": "ডেটা", "export_title": " এক্সপোর্ট", "export_btn": "📄 CSV ডাউনলোদ", "trend_title": " ট্রেন্ড", "risk_vs_age": "**স্কোর vs চহী**", "pain_distribution": "**নুংঙাইতবা**", "followup_title": "🚨 ফলো-আপ", "sms_btn": "📨 SMS থাবীয়ু", "sms_success": "✅ SMS থাদ্রে {}!", "no_followup": "ফংদ্রে", "no_data": "ডেটা ফংদ্রে।",
        "backend_connected": "✅ চল্লি", "backend_offline": "❌ বন্ধ"
    },
    "Mizo": {
        "nav_dashboard": "📊 Screening Report", "nav_screening": "🩺 Zawn Thar", "nav_records": "📋 Patient Record", "nav_admin": "🏥 Admin Report",
        "dashboard_title": " Regional Screening Report", "real_time_text": "OA Risk hmu dan",
        "total_screenings": "Zawn zawng zawng", "high_risk": "🔴 Risk Nasa", "moderate_risk": "🟡 Risk Laim", "lower_risk": "🟢 Risk Tlem",
        "risk_distribution": "Risk Dan", "high_risk_alerts": " Risk Nasa Patient", "no_high_risk": "Risk Nasa Patient a awm lo", "recent_activity": "Zawn Hma",
        "screening_title": "🦴 OsteoSense Health Check Form", "form_instruction": "Form hi fill rawh. * nei chu fill tur a ni.",
        "step_1": "Step 1: Patient Info", "step_2": "Step 2: Na & Hnathawh", "step_3": "Step 3: Body Sign", "step_4": "Step 4: Kal Dan",
        "section_1": " Section 1: Patient Info", "patient_id": "Patient ID *", "full_name": "Hming *", "age": "Kum *", "gender": "Pa/Mei *", "bmi": "BMI *", "bmi_help": "Weight/Height",
        "section_2": "📉 Section 2: Na & Hnathawh", "pain_level": "Na (0-10) *", "stiffness_severity": "Hnathawh kha? *", "stiffness_duration": "Sakar hnathawh kha? *",
        "section_3": "🦴 Section 3: Body Sign", "check_apply": "Dik chu thlang rawh:", "tenderness": "Na", "reduced_flexibility": "Hnathawh", "crepitus": "Hriat", "swelling": "Buk",
        "section_4": "🚶 Section 4: Kal Dan", "pain_after_activity": "Tih hnu na", "pain_at_rest": "Dah na", "gives_way": "Hnathawh", "sleep_disturbance": "I hreh", "walking_difficulty": "Kal harh", "stair_difficulty": "Stair harh", "mobility_limitation": "Kal harh",
        "submit_btn": "🚀 Submit rawh", "hardware_title": " Module 2: Hardware", "hardware_desc": "Sensor connect rawh",
        "hardware_btn": "📡 Sensor Data La", "receiving_data": "🔄 Data la mek...", "hardware_success": "✅ Data a va! Score: {}/100", "hardware_failed": "Connect thei lo",
        "questionnaire_submitted": "✅ Submit a ni! Score: {}/100", "ai_risk_level": "AI Risk", "clinical_recommendation": "📋 Doctor Aw", "key_risk_factors": "🔍 Risk Factor:",
        "records_title": " Patient Record", "search_instruction": "ID pe rawh", "search_id": "ID:", "search_placeholder": "OA-0001", "retrieve_btn": "🔍 Zawn rawh", "patient_profile": "👤 Patient: {}", "age_gender": "Kum / Pa-Mei", "latest_risk_score": "Score Hnu", "risk_level": "Risk",
        "clinical_observations": "🩺 Sign", "pain_stiffness": "**Na**", "physical_signs": "**Body Sign**", "mobility_sleep": "**Kal**", "ai_recommendation": "🤖 AI Aw", "risk_factors": "**Factor:** {}",
        "pdf_title": "📄 Module 4: PDF Report", "pdf_btn": "📄 PDF Download", "pdf_success": "✅ PDF va!", "pdf_download": "Click rawh", "assessment_history": "📅 History ({})", "no_records": "A awm lo {}",
        "admin_title": " Admin", "admin_desc": "Data", "export_title": "📥 Export", "export_btn": "📄 CSV Download", "trend_title": "📈 Trend", "risk_vs_age": "**Score vs Kum**", "pain_distribution": "**Na**", "followup_title": "🚨 Follow-up", "sms_btn": " SMS Thawn", "sms_success": "✅ SMS va {}!", "no_followup": "A awm lo", "no_data": "Data a awm lo.",
        "backend_connected": "✅ A tla", "backend_offline": "❌ A chham"
    },
    "Telugu": {
        "nav_dashboard": "📊 స్క్రీనింగ్ రిపోర్ట్", "nav_screening": "🩺 కొత్త పరీక్ష", "nav_records": "📋 రోగి రికార్డు", "nav_admin": "🏥 అడ్మిన్ రిపోర్ట్",
        "dashboard_title": "📊 ప్రాంతీయ స్క్రీనింగ్ రిపోర్ట్", "real_time_text": "OA ప్రమాద తక్షణ దృశ్యం",
        "total_screenings": "మొత్తం స్క్రీనింగ్", "high_risk": "🔴 అధిక ప్రమాదం", "moderate_risk": "🟡 మధ్యస్థ ప్రమాదం", "lower_risk": "🟢 తక్కువ ప్రమాదం",
        "risk_distribution": "ప్రమాద వితరణ", "high_risk_alerts": "🚨 అధిక ప్రమాద రోగి", "no_high_risk": "అధిక ప్రమాద రోగి కనుగొనబడలేదు", "recent_activity": "ఇటీవలి స్క్రీనింగ్",
        "screening_title": "🦴 OsteoSense ఆరోగ్య పరీక్ష ఫారమ్", "form_instruction": "దయచేసి ఈ ఫారమ్ నింపండి. * గుర్తు ఉన్నవి నింపడం తప్పనిసరి.",
        "step_1": "దశ 1: రోగి సమాచారం", "step_2": "దశ 2: నొప్పి & గట్టిపడటం", "step_3": "దశ 3: శారీరక లక్షణాలు", "step_4": "దశ 4: తిరగడంలో ఇబ్బంది",
        "section_1": "👤 విభాగం 1: రోగి సమాచారం", "patient_id": "రోగి ID *", "full_name": "పూర్తి పేరు *", "age": "వయస్సు *", "gender": "లింగం *", "bmi": "BMI *", "bmi_help": "బరువు/ఎత్తు",
        "section_2": "📉 విభాగం 2: నొప్పి & గట్టిపడటం", "pain_level": "ఇప్పుడు నొప్పి ఎంత? (0-10) *", "stiffness_severity": "గట్టిపడటం ఎంత? *", "stiffness_duration": "ఉదయం గట్టిపడటం ఎంతసేపు? *",
        "section_3": "🦴 విభాగం 3: శారీరక లక్షణాలు", "check_apply": "సరైనది ఎంచుకోండి:", "tenderness": "కీళ్లలో నొప్పి", "reduced_flexibility": "గట్టిపడటం", "crepitus": "శబ్దం", "swelling": "వాపు",
        "section_4": " విభాగం 4: తిరగడం", "pain_after_activity": "పని తర్వాత నొప్పి", "pain_at_rest": "విశ్రాంతిలో నొప్పి", "gives_way": "కీలు బలహీనం", "sleep_disturbance": "నిద్రలో ఇబ్బంది", "walking_difficulty": "నడక ఇబ్బంది", "stair_difficulty": "మెట్లు ఎక్కడం", "mobility_limitation": "తిరగడం ఇబ్బంది",
        "submit_btn": "🚀 ఫారమ్ సమర్పించండి", "hardware_title": "📡 Module 2: హార్డ్‌వేర్", "hardware_desc": "సెన్సార్ కనెక్ట్ చేయండి",
        "hardware_btn": "📡 సెన్సార్ డేటా తీసుకోండి", "receiving_data": "🔄 డేటా వస్తోంది...", "hardware_success": "✅ డేటా వచ్చింది! స్కోరు: {}/100", "hardware_failed": "కనెక్ట్ కాలేదు",
        "questionnaire_submitted": "✅ సమర్పించబడింది! స్కోరు: {}/100", "ai_risk_level": "AI ప్రమాదం", "clinical_recommendation": "📋 డాక్టర్ సలహా:", "key_risk_factors": "🔍 ప్రమాద కారకాలు:",
        "records_title": "📋 రోగి రికార్డు", "search_instruction": "ID ఇవ్వండి", "search_id": "ID:", "search_placeholder": "OA-0001", "retrieve_btn": "🔍 వెతకండి", "patient_profile": "👤 రోగి: {}", "age_gender": "వయస్సు / లింగం", "latest_risk_score": "స్కోరు", "risk_level": "ప్రమాదం",
        "clinical_observations": "🩺 లక్షణాలు", "pain_stiffness": "**నొప్పి**", "physical_signs": "**శారీరక లక్షణాలు**", "mobility_sleep": "**తిరగడం**", "ai_recommendation": "🤖 AI సలహా", "risk_factors": "**కారకాలు:** {}",
        "pdf_title": "📄 Module 4: PDF రిపోర్ట్", "pdf_btn": "📄 PDF డౌన్‌లోడ్", "pdf_success": "✅ PDF తయారైంది!", "pdf_download": "క్లిక్ చేయండి", "assessment_history": " చరిత్ర ({})", "no_records": "కనుగొనబడలేదు {}",
        "admin_title": "🏥 అడ్మిన్", "admin_desc": "డేటా", "export_title": "📥 ఎగుమతి", "export_btn": " CSV డౌన్‌లోడ్", "trend_title": "📈 ట్రెండ్", "risk_vs_age": "**స్కోరు vs వయస్సు**", "pain_distribution": "**నొప్పి**", "followup_title": "🚨 ఫాలో-అప్", "sms_btn": "📨 SMS పంపండి", "sms_success": "✅ SMS పంపబడింది {}!", "no_followup": "లేదు", "no_data": "డేటా లేదు.",
        "backend_connected": "✅ సిస్టమ్ ఆన్", "backend_offline": "❌ సిస్టమ్ ఆఫ్"
    }
}

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    st.title("🦴 OsteoSense Pro")
    
    # EXACT MATCH: Dropdown options must match TEXT keys exactly
    lang_options = ["English", "Hindi", "Assamese", "Bengali", "Manipuri", "Mizo", "Telugu"]
    lang_labels = ["English", "हिन्दी (Hindi)", "অসমীয়া (Assamese)", "বাংলা (Bengali)", "মৈতৈলোন্ (Manipuri)", "Mizo", "తెలుగు (Telugu)"]
    
    selected_label = st.selectbox("Language / भाषा", lang_labels, index=0)
    # Map display label back to exact dictionary key
    lang = lang_options[lang_labels.index(selected_label)]
    t = TEXT[lang]
    
    st.markdown("AI-Powered Osteoarthritis Screening")
    st.divider()
    
    nav_options = {
        t["nav_dashboard"]: "dashboard",
        t["nav_screening"]: "screening",
        t["nav_records"]: "records",
        t["nav_admin"]: "admin"
    }
    selected_nav = st.radio("Navigation", list(nav_options.keys()), index=0)
    page_key = nav_options[selected_nav]
    
    st.divider()
    st.caption("System Status:")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=2)
        st.success(t["backend_connected"])
    except Exception:
        st.error(t["backend_offline"])

# ==========================================
# PAGE 1: ANALYTICS DASHBOARD
# ==========================================
if page_key == "dashboard":
    st.title(t["dashboard_title"])
    st.markdown(t["real_time_text"])
    
    try:
        stats = requests.get(f"{BASE_URL}/stats").json()
        all_assessments = requests.get(BASE_URL).json()
        
        col1, col2, col3, col4 = st.columns(4)
        col1.metric(t["total_screenings"], stats.get('totalScreenings', 0))
        col2.metric(t["high_risk"], stats.get('highRiskCases', 0))
        col3.metric(t["moderate_risk"], stats.get('moderateRisk', 0))
        col4.metric(t["lower_risk"], stats.get('lowerRisk', 0))
        
        st.divider()
        chart_col, alert_col = st.columns([2, 1])
        
        with chart_col:
            st.subheader(t["risk_distribution"])
            chart_data = pd.DataFrame({
                'Risk Level': ['Lower Risk', 'Moderate Risk', 'High Risk'],
                'Count': [stats.get('lowerRisk', 0), stats.get('moderateRisk', 0), stats.get('highRiskCases', 0)]
            })
            st.bar_chart(chart_data.set_index('Risk Level'), color="#008080")
            
        with alert_col:
            st.subheader(t["high_risk_alerts"])
            high_risk = [a for a in all_assessments if a.get('riskLevel') and ('High' in str(a['riskLevel']) or 'Red' in str(a['riskLevel']))]
            if high_risk:
                for p in high_risk[:5]:
                    st.markdown(f"**{p.get('patientName', 'Unknown')}**")
                    st.caption(f"Score: {p.get('riskScore')} | {str(p.get('assessmentDate', ''))[:10]}")
                    st.divider()
            else:
                st.info(t["no_high_risk"])

        st.subheader(t["recent_activity"])
        recent_df = pd.DataFrame(all_assessments[-10:][::-1])
        if not recent_df.empty:
            display_cols = ['patientId', 'patientName', 'age', 'riskScore', 'riskLevel']
            existing_cols = [c for c in display_cols if c in recent_df.columns]
            st.dataframe(recent_df[existing_cols], width="stretch", hide_index=True)
    except Exception as e:
        st.error(f"Could not load dashboard data. Is Java running? Error: {e}")

# ==========================================
# PAGE 2: CLINICAL QUESTIONNAIRE
# ==========================================
elif page_key == "screening":
    st.title(t["screening_title"])
    st.markdown(t["form_instruction"])
    
    st.progress(0.25, text=t["step_1"])
    
    with st.form("questionnaire_form", clear_on_submit=True):
        st.subheader(t["section_1"])
        d_col1, d_col2 = st.columns(2)
        with d_col1: 
            patient_id = st.text_input(t["patient_id"], "OA-NEW-01")
            patient_name = st.text_input(t["full_name"], "Jane Doe")
        with d_col2: 
            col_a, col_g = st.columns(2)
            age = col_a.number_input(t["age"], 1, 120, 60)
            gender = col_g.selectbox(t["gender"], ["Male", "Female", "Other"])
        bmi = st.number_input(t["bmi"], 10.0, 60.0, 25.0, 0.1, help=t["bmi_help"])
        
        st.divider()
        st.progress(0.50, text=t["step_2"])
        st.subheader(t["section_2"])
        s_col1, s_col2, s_col3 = st.columns(3)
        with s_col1: pain = st.slider(t["pain_level"], 0, 10, 5)
        with s_col2: stiffness = st.selectbox(t["stiffness_severity"], ["None", "Mild", "Moderate", "Severe"])
        with s_col3: stiffness_duration = st.selectbox(t["stiffness_duration"], ["None", "<15min", "15-30min", ">=30min"])
        
        st.divider()
        st.progress(0.75, text=t["step_3"])
        st.subheader(t["section_3"])
        st.markdown(t["check_apply"])
        c_col1, c_col2, c_col3, c_col4 = st.columns(4)
        with c_col1: tenderness = st.checkbox(t["tenderness"])
        with c_col2: reduced_flexibility = st.checkbox(t["reduced_flexibility"])
        with c_col3: crepitus = st.checkbox(t["crepitus"])
        with c_col4: swelling = st.checkbox(t["swelling"])
        
        st.divider()
        st.progress(1.00, text=t["step_4"])
        st.subheader(t["section_4"])
        m_col1, m_col2, m_col3, m_col4 = st.columns(4)
        with m_col1: pain_after_activity = st.checkbox(t["pain_after_activity"])
        with m_col2: pain_at_rest = st.checkbox(t["pain_at_rest"])
        with m_col3: gives_way = st.checkbox(t["gives_way"])
        with m_col4: sleep_disturbance = st.checkbox(t["sleep_disturbance"])

        walking_difficulty = st.checkbox(t["walking_difficulty"], value=False)
        stair_difficulty = st.checkbox(t["stair_difficulty"], value=False)
        mobility_limitation = st.checkbox(t["mobility_limitation"], value=False)

        st.divider()
        submitted = st.form_submit_button(t["submit_btn"], type="primary")

    st.divider()
    st.subheader(t["hardware_title"])
    st.markdown(t["hardware_desc"])
    
    if st.button(t["hardware_btn"], type="secondary"):
        st.info(t["receiving_data"])
        hardware_payload = {
            "patientId": f"HW-{random.randint(1000, 9999)}", "patientName": "Hardware Sensor Patient",
            "age": random.randint(50, 80), "gender": random.choice(["Male", "Female"]),
            "bmi": round(random.uniform(22.0, 32.0), 1), "pain": random.randint(4, 9),
            "stiffness": random.choice(["Moderate", "Severe"]), "stiffnessDuration": ">=30min",
            "tenderness": True, "reducedFlexibility": True, "crepitus": random.choice([True, False]),
            "swelling": random.choice([True, False]), "painAfterActivity": True,
            "painAtRest": random.choice([True, False]), "walkingDifficulty": True,
            "stairDifficulty": True, "mobilityLimitation": True, "givesWay": random.choice([True, False]),
            "sleepDisturbance": random.choice([True, False])
        }
        try:
            response = requests.post(BASE_URL, json=hardware_payload)
            if response.status_code == 200:
                res = response.json()
                st.success(t["hardware_success"].format(res.get('riskScore')))
                st.balloons()
            else:
                st.error(t["hardware_failed"])
        except Exception:
            st.error("🚨 Cannot connect to Java Backend!")

    if submitted:
        payload = {
            "patientId": patient_id, "patientName": patient_name, "age": age, "gender": gender, "bmi": bmi,
            "pain": pain, "stiffness": stiffness, "stiffnessDuration": stiffness_duration, "tenderness": tenderness,
            "reducedFlexibility": reduced_flexibility, "crepitus": crepitus, "swelling": swelling,
            "painAfterActivity": pain_after_activity, "painAtRest": pain_at_rest, "walkingDifficulty": walking_difficulty,
            "stairDifficulty": stair_difficulty, "mobilityLimitation": mobility_limitation,
            "givesWay": gives_way, "sleepDisturbance": sleep_disturbance
        }
        try:
            response = requests.post(BASE_URL, json=payload)
            if response.status_code == 200:
                res = response.json()
                st.success(t["questionnaire_submitted"].format(res.get('riskScore')))
                r_col1, r_col2 = st.columns(2)
                with r_col1:
                    st.metric(t["ai_risk_level"], res.get('riskLevel', 'Unknown'))
                    st.info(t["clinical_recommendation"] + "\n" + res.get('recommendation', 'None'))
                with r_col2:
                    st.warning(t["key_risk_factors"] + "\n" + str(res.get('factors', 'None')))
            else:
                st.error(f"Backend Error: {response.text}")
        except Exception:
            st.error("🚨 Cannot connect to Java Backend!")

# ==========================================
# PAGE 3: PATIENT RECORDS
# ==========================================
elif page_key == "records":
    st.title(t["records_title"])
    st.markdown(t["search_instruction"])
    
    search_id = st.text_input(t["search_id"], placeholder=t["search_placeholder"], value="OA-0001")
    
    if st.button(t["retrieve_btn"], type="primary"):
        try:
            response = requests.get(f"{BASE_URL}/patient/{search_id}")
            if response.status_code == 200:
                data = response.json()
                if data:
                    latest = data[0]
                    st.subheader(t["patient_profile"].format(latest.get('patientName', 'Unknown')))
                    st.divider()
                    
                    p_col1, p_col2, p_col3, p_col4 = st.columns(4)
                    p_col1.metric(t["age_gender"], f"{latest.get('age')} / {latest.get('gender')}")
                    p_col2.metric("BMI", latest.get('bmi'))
                    p_col3.metric(t["latest_risk_score"], f"{latest.get('riskScore')}/100")
                    p_col4.metric(t["risk_level"], latest.get('riskLevel'))
                    
                    st.divider()
                    st.subheader(t["clinical_observations"])
                    v_col1, v_col2, v_col3 = st.columns(3)
                    with v_col1:
                        st.markdown(t["pain_stiffness"])
                        st.write(f"• Pain Level: **{latest.get('pain')}/10**")
                        st.write(f"• Stiffness: **{latest.get('stiffness')}**")
                        st.write(f"• Duration: **{latest.get('stiffnessDuration')}**")
                    with v_col2:
                        st.markdown(t["physical_signs"])
                        st.write(f"• Tenderness: {'✅' if latest.get('tenderness') else '❌'}")
                        st.write(f"• Reduced Flexibility: {'✅' if latest.get('reducedFlexibility') else '❌'}")
                        st.write(f"• Crepitus: {'✅' if latest.get('crepitus') else '❌'}")
                        st.write(f"• Swelling: {'✅' if latest.get('swelling') else '❌'}")
                    with v_col3:
                        st.markdown(t["mobility_sleep"])
                        st.write(f"• Pain After Activity: {'✅' if latest.get('painAfterActivity') else '❌'}")
                        st.write(f"• Pain At Rest: {'✅' if latest.get('painAtRest') else '❌'}")
                        st.write(f"• Joint Gives Way: {'✅' if latest.get('givesWay') else '❌'}")
                        st.write(f"• Sleep Disturbance: {'✅' if latest.get('sleepDisturbance') else '❌'}")
                    
                    st.divider()
                    st.subheader(t["ai_recommendation"])
                    st.info(latest.get('recommendation', 'No recommendation provided.'))
                    st.warning(t["risk_factors"].format(str(latest.get('factors', 'None'))))

                    st.divider()
                    st.subheader(t["pdf_title"])
                    if st.button(t["pdf_btn"], type="primary"):
                        pdf = FPDF()
                        pdf.add_page()
                        pdf.set_font("Arial", 'B', 20)
                        pdf.cell(0, 10, "OsteoSense Clinical Report", ln=True, align='C')
                        pdf.set_font("Arial", '', 10)
                        pdf.cell(0, 5, "AI-Assisted Osteoarthritis Screening System", ln=True, align='C')
                        pdf.ln(10)
                        
                        pdf.set_font("Arial", 'B', 14)
                        pdf.cell(0, 8, "Patient Information", ln=True)
                        pdf.set_font("Arial", '', 11)
                        pdf.cell(90, 6, f"Patient ID: {latest.get('patientId', 'N/A')}", ln=False)
                        pdf.cell(0, 6, f"Date: {str(latest.get('assessmentDate', ''))[:10]}", ln=True)
                        pdf.cell(90, 6, f"Name: {latest.get('patientName', 'N/A')}", ln=False)
                        pdf.cell(0, 6, f"Age/Gender: {latest.get('age')}/{latest.get('gender')}", ln=True)
                        pdf.cell(0, 6, f"BMI: {latest.get('bmi')}", ln=True)
                        pdf.ln(5)
                        
                        pdf.set_font("Arial", 'B', 14)
                        pdf.cell(0, 8, "AI Risk Assessment Results", ln=True)
                        pdf.set_font("Arial", '', 11)
                        pdf.cell(90, 6, f"Risk Score: {latest.get('riskScore', 0)}/100", ln=False)
                        pdf.cell(0, 6, f"Risk Level: {latest.get('riskLevel', 'N/A')}", ln=True)
                        pdf.ln(5)
                        
                        pdf.set_font("Arial", 'B', 14)
                        pdf.cell(0, 8, "Clinical Observations", ln=True)
                        pdf.set_font("Arial", '', 11)
                        pdf.cell(90, 6, f"Pain Level: {latest.get('pain', 0)}/10", ln=False)
                        pdf.cell(0, 6, f"Stiffness: {latest.get('stiffness', 'N/A')} ({latest.get('stiffnessDuration', 'N/A')})", ln=True)
                        
                        symptoms = []
                        if latest.get('tenderness'): symptoms.append("Tenderness")
                        if latest.get('crepitus'): symptoms.append("Crepitus")
                        if latest.get('swelling'): symptoms.append("Swelling")
                        if latest.get('reducedFlexibility'): symptoms.append("Reduced Flexibility")
                        pdf.cell(0, 6, f"Physical Signs: {', '.join(symptoms) if symptoms else 'None observed'}", ln=True)
                        pdf.ln(5)
                        
                        pdf.set_font("Arial", 'B', 14)
                        pdf.cell(0, 8, "AI Recommendation", ln=True)
                        pdf.set_font("Arial", '', 10)
                        pdf.multi_cell(0, 5, latest.get('recommendation', 'No specific recommendation provided.'))
                        pdf.ln(5)
                        
                        pdf.set_font("Arial", 'I', 8)
                        pdf.cell(0, 5, "Disclaimer: This is an AI-assisted screening prototype. Not a clinical diagnosis.", ln=True, align='C')
                        
                        filename = f"Report_{latest.get('patientId')}.pdf"
                        pdf.output(filename)
                        
                        with open(filename, "rb") as f:
                            st.download_button(label=t["pdf_download"], data=f, file_name=filename, mime="application/pdf")
                        st.success(t["pdf_success"])

                    st.subheader(t["assessment_history"].format(len(data)))
                    df = pd.DataFrame(data)
                    display_cols = ['assessmentDate', 'pain', 'stiffness', 'riskScore', 'riskLevel']
                    existing_cols = [c for c in display_cols if c in df.columns]
                    st.dataframe(df[existing_cols], width="stretch", hide_index=True)
                else:
                    st.warning(t["no_records"].format(search_id))
            else:
                st.error("Failed to fetch records.")
        except Exception:
            st.error("🚨 Cannot connect to Backend!")

# ==========================================
# PAGE 4: ADMIN & REPORTING
# ==========================================
elif page_key == "admin":
    st.title(t["admin_title"])
    st.markdown(t["admin_desc"])
    
    try:
        all_assessments = requests.get(BASE_URL).json()
        df = pd.DataFrame(all_assessments)
        
        if not df.empty:
            st.subheader(t["export_title"])
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button(label=t["export_btn"], data=csv, file_name='osteosense_audit_report.csv', mime='text/csv', width="stretch")
            st.divider()

            st.subheader(t["trend_title"])
            chart_col1, chart_col2 = st.columns(2)
            with chart_col1:
                st.markdown(t["risk_vs_age"])
                if 'age' in df.columns and 'riskScore' in df.columns:
                    df['age'] = pd.to_numeric(df['age'], errors='coerce')
                    df['riskScore'] = pd.to_numeric(df['riskScore'], errors='coerce')
                    st.scatter_chart(df[['age', 'riskScore']], x='age', y='riskScore', color="#d9534f")
            with chart_col2:
                st.markdown(t["pain_distribution"])
                if 'pain' in df.columns:
                    pain_counts = pd.to_numeric(df['pain'], errors='coerce').value_counts().sort_index()
                    st.bar_chart(pain_counts, color="#f0ad4e")
            st.divider()

            st.subheader(t["followup_title"])
            high_risk_df = df[df['riskLevel'].astype(str).str.contains('High|Red|Severe', case=False, na=False)]
            if not high_risk_df.empty:
                display_cols = ['patientId', 'patientName', 'age', 'riskScore', 'riskLevel']
                existing_cols = [c for c in display_cols if c in high_risk_df.columns]
                st.dataframe(high_risk_df[existing_cols], width="stretch", hide_index=True)
                if st.button(t["sms_btn"], type="primary"):
                    st.success(t["sms_success"].format(len(high_risk_df)))
            else:
                st.success(t["no_followup"])
        else:
            st.warning(t["no_data"])
    except Exception as e:
        st.error(f"Could not load admin data. Error: {e}")