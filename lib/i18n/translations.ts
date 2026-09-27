export interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  flagCode?: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'en', name: 'English', nativeName: 'English', region: 'Global / Standard' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Frontline ASHA Worker Kit' },
  { id: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'North-East Health Centers' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Eastern District Clinics' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Southern PHC Network' },
  { id: 'mn', name: 'Manipuri', nativeName: 'মৈতৈলোন্', region: 'Imphal & Hill Districts' },
  { id: 'mz', name: 'Mizo', nativeName: 'Mizo', region: 'Mizoram Rural Outreach' },
];

export interface LandingTranslations {
  nav: {
    trajectory: string;
    biomechanics: string;
    cineloops: string;
    simulator: string;
    sensors: string;
    fieldVoices: string;
    signIn: string;
    launchPortal: string;
  };
  hero: {
    badge: string;
    headlineStart: string;
    headlineHighlight: string;
    headlineEnd: string;
    subtitle: string;
    btnPortal: string;
    btnTrajectory: string;
    statOfflineVal: string;
    statOfflineLabel: string;
    statSpeedVal: string;
    statSpeedLabel: string;
    statIndexVal: string;
    statIndexLabel: string;
    statFpsVal: string;
    statFpsLabel: string;
  };
  simulator: {
    badge: string;
    title: string;
    subtitle: string;
    painLevel: string;
    ageLabel: string;
    bmiLabel: string;
    morningStiffness: string;
    morningStiffnessDesc: string;
    jointCrepitus: string;
    jointCrepitusDesc: string;
    swelling: string;
    swellingDesc: string;
    triageScore: string;
    calculatedLevel: string;
    btnTransfer: string;
  };
  footerBanner: {
    badge: string;
    title: string;
    subtitle: string;
    btnOpen: string;
    btnScreen: string;
  };
}

export const TRANSLATIONS: Record<string, LandingTranslations> = {
  en: {
    nav: {
      trajectory: 'Trajectory',
      biomechanics: 'Biomechanics',
      cineloops: 'Cine-Loops',
      simulator: 'Triage Sim',
      sensors: 'Sensors',
      fieldVoices: 'Field Voices',
      signIn: 'Worker Sign In',
      launchPortal: 'Launch Portal',
    },
    hero: {
      badge: 'Frontline Healthcare Protocol • 100% Offline Screening',
      headlineStart: 'Spotting Joint Wear',
      headlineHighlight: 'Years Before',
      headlineEnd: 'Irreversible Loss.',
      subtitle: 'In rural communities where specialized MRI and digital radiography require arduous travel, OsteoSense equips frontline health workers with clinical symptom profiling, acoustic crepitus sensing, and wearable flexion telemetry — triaging patients in under 3 minutes.',
      btnPortal: 'Open Healthcare Portal →',
      btnTrajectory: 'Explore Clinical Trajectory ↓',
      statOfflineVal: '100%',
      statOfflineLabel: 'Offline Operation',
      statSpeedVal: '< 3 Min',
      statSpeedLabel: 'Frontline Protocol',
      statIndexVal: '0–100',
      statIndexLabel: 'Validated Risk Index',
      statFpsVal: '60 FPS',
      statFpsLabel: 'Biomechanical AI',
    },
    simulator: {
      badge: 'Interactive Clinical Stratification',
      title: 'Real-Time Point-of-Care Risk Engine',
      subtitle: 'Adjust frontline symptoms, physiological markers, and patient age to simulate instant triage calculations generated in the field.',
      painLevel: 'Current Knee Pain',
      ageLabel: 'Patient Age',
      bmiLabel: 'Body Mass Index (BMI)',
      morningStiffness: 'Morning Stiffness ≥ 30 Minutes',
      morningStiffnessDesc: 'Prolonged early morning immobility indicating articular deterioration',
      jointCrepitus: 'Acoustic Joint Crepitus',
      jointCrepitusDesc: 'Audible or palpable grating sensation during flexion-extension glide',
      swelling: 'Visible Joint Effusion / Swelling',
      swellingDesc: 'Fluid accumulation in the suprapatellar bursa or capsule',
      triageScore: 'Composite Triage Score',
      calculatedLevel: 'Stratified Risk Tier',
      btnTransfer: 'Transfer to Active Patient Intake →',
    },
    footerBanner: {
      badge: 'Community Health Outreach Platform',
      title: 'Bringing Diagnostic Confidence to the Primary Health Center',
      subtitle: 'Screen patients in 3 minutes, calculate calibrated risk indices, and generate encrypted district referral documentation on any standard laptop or tablet.',
      btnOpen: 'Open Healthcare Portal →',
      btnScreen: '+ Start Patient Screening',
    },
  },

  hi: {
    nav: {
      trajectory: 'प्रक्षेपवक्र',
      biomechanics: 'बायोमैकेनिक्स',
      cineloops: 'सिने-लूप्स',
      simulator: 'जांच सिम',
      sensors: 'सेंसर',
      fieldVoices: 'स्वास्थ्य रिपोर्ट',
      signIn: 'कार्यकर्ता लॉगिन',
      launchPortal: 'पोर्टल खोलें',
    },
    hero: {
      badge: 'अग्रिम स्वास्थ्य प्रोटोकॉल • 100% ऑफ़लाइन स्क्रीनिंग',
      headlineStart: 'जोड़ों की घिसावट की पहचान',
      headlineHighlight: 'वर्षों पहले',
      headlineEnd: 'अपरिवर्तनीय नुकसान से।',
      subtitle: 'ग्रामीण क्षेत्रों में जहां एमआरआई और डिजिटल एक्स-रे के लिए दूर जाना पड़ता है, OsteoSense अग्रिम स्वास्थ्य कर्मियों को लक्षण प्रोफाइलिंग और सेंसर टेलीमेट्री से लैस करता है — 3 मिनट से भी कम समय में जांच।',
      btnPortal: 'स्वास्थ्य पोर्टल खोलें →',
      btnTrajectory: 'क्लिनिकल प्रक्षेपवक्र देखें ↓',
      statOfflineVal: '100%',
      statOfflineLabel: 'ऑफ़लाइन कार्यप्रणाली',
      statSpeedVal: '< 3 मिनट',
      statSpeedLabel: 'त्वरित स्क्रीनिंग',
      statIndexVal: '0–100',
      statIndexLabel: 'प्रमाणित जोखिम स्कोर',
      statFpsVal: '60 FPS',
      statFpsLabel: 'बायोमैकेनिकल एआई',
    },
    simulator: {
      badge: 'इंटरएक्टिव क्लिनिकल कैलकुलेटर',
      title: 'रीयल-टाइम फ्रंटलाइन जोखिम इंजन',
      subtitle: 'मरीज़ के लक्षण, उम्र और बीएमआई समायोजित करके तुरंत जोखिम गणना और डॉक्टर की सिफारिश देखें।',
      painLevel: 'जोड़ों का दर्द (0-10)',
      ageLabel: 'मरीज़ की उम्र',
      bmiLabel: 'बॉडी मास इंडेक्स (BMI)',
      morningStiffness: 'सुबह जोड़ों में अकड़न ≥ 30 मिनट',
      morningStiffnessDesc: 'सुबह उठने पर जोड़ों में लंबे समय तक अकड़न रहना',
      jointCrepitus: 'जोड़ों में चरमराहट / कट-कट की आवाज़',
      jointCrepitusDesc: 'घुटना मोड़ने या चलने पर महसूस होने वाली चरमराहट',
      swelling: 'जोड़ों में सूजन या पानी भरना',
      swellingDesc: 'घुटने के चारों तरफ दिखाई देने वाली सूजन',
      triageScore: 'कुल क्लिनिकल स्कोर',
      calculatedLevel: 'जोखिम श्रेणी',
      btnTransfer: 'मरीज़ फॉर्म में डेटा भेजें →',
    },
    footerBanner: {
      badge: 'प्राथमिक स्वास्थ्य सेवा मंच',
      title: 'प्राथमिक स्वास्थ्य केंद्र में सटीक नैदानिक आत्मविश्वास',
      subtitle: '3 मिनट में मरीज़ों की जांच करें, प्रमाणित जोखिम स्कोर पाएं और जिले के विशेषज्ञ के लिए डिजिटल रेफरल बनाएं।',
      btnOpen: 'स्वास्थ्य पोर्टल खोलें →',
      btnScreen: '+ नई जांच शुरू करें',
    },
  },

  as: {
    nav: {
      trajectory: "যাত্ৰা",
      biomechanics: "বায়'মেকানিক্স",
      cineloops: "চিনে-লুপ",
      simulator: "ট্ৰায়াজ চিম",
      sensors: "ছেন্সৰ",
      fieldVoices: "পৰ্যবেক্ষণ",
      signIn: "কৰ্মী লগইন",
      launchPortal: "প'ৰ্টেল খোলক",
    },
    hero: {
      badge: "অগ্ৰিম স্বাস্থ্য প্ৰট'কল • 100% অফলাইন স্ক্ৰীনিং",
      headlineStart: "গাঁঠিৰ ক্ষয় চিনাক্তকৰণ",
      headlineHighlight: "বহু বছৰ আগতেই",
      headlineEnd: "স্থায়ী ক্ষতি হোৱাৰ।",
      subtitle: "গ্ৰাম্যাঞ্চলত য'ত এমআৰআই আৰু এক্স-ৰেৰ বাবে বহু দূৰলৈ যাব লাগে, OsteoSense স্বাস্থ্যকৰ্মীসকলক লক্ষণ বিশ্লেষণ আৰু ছেন্সৰেৰে সমৃদ্ধ কৰে — ৩ মিনিটতে ৰোগীৰ পৰীক্ষা।",
      btnPortal: "স্বাস্থ্য প'ৰ্টেল খোলক →",
      btnTrajectory: "ক্লিনিকেল যাত্ৰা চাওক ↓",
      statOfflineVal: "১০০%",
      statOfflineLabel: "অফলাইন অপাৰেচন",
      statSpeedVal: "< ৩ মিনিট",
      statSpeedLabel: "দ্ৰুত স্ক্ৰীনিং",
      statIndexVal: "০–১০০",
      statIndexLabel: "প্ৰমাণিত ঝুঁকি স্ক'ৰ",
      statFpsVal: "৬০ FPS",
      statFpsLabel: "এআই বায়'মেকানিক্স",
    },
    simulator: {
      badge: "ইণ্টাৰেক্টিভ ক্লিনিকেল কেলকুলেটৰ",
      title: "তৎক্ষণাত ৰোগ নিৰ্ণয় ইঞ্জিন",
      subtitle: "লক্ষণ আৰু বয়স নিৰ্ধাৰণ কৰি মুহূৰ্ততে অষ্টিঅ'আৰ্থ্ৰাইটিছৰ ঝুঁকি আৰু পৰামৰ্শ চাওক।",
      painLevel: "গাঁঠিৰ বিষৰ মাত্ৰা (0-10)",
      ageLabel: "ৰোগীৰ বয়স",
      bmiLabel: "বডি মাছ ইণ্ডেক্স (BMI)",
      morningStiffness: "ৰাতিপুৱা গাঁঠিৰ টান ≥ ৩০ মিনিট",
      morningStiffnessDesc: "টোপনিৰ পৰা উঠাৰ পিছত গাঁঠি লৰচৰ কৰাত কষ্ট",
      jointCrepitus: "গাঁথিত শব্দ হোৱা",
      jointCrepitusDesc: "ভৰি ভাঁজ কৰোঁতে গাঁথিত শব্দ হোৱা বা ঘঁহনি খোৱা",
      swelling: "গাঁঠি ফুলা",
      swellingDesc: "গাঁঠিৰ চাৰিওফালে দেখা পোৱা ফুলা বা পানী জমা হোৱা",
      triageScore: "সামগ্ৰিক ঝুঁকি স্ক'ৰ",
      calculatedLevel: "ঝুঁকিৰ স্তৰ",
      btnTransfer: "ৰোগীৰ ফৰ্মলৈ প্ৰেৰণ কৰক →",
    },
    footerBanner: {
      badge: "প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ প্লেটফৰ্ম",
      title: "প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰলৈ উন্নত ৰোগ নিৰ্ণয়ৰ আত্মবিশ্বাস",
      subtitle: "৩ মিনিটত ৰোগীৰ স্ক্ৰীনিং কৰক আৰু জিলা হাস্পতাললৈ প্ৰেৰণৰ বাবে তথ্য প্ৰস্তুত কৰক।",
      btnOpen: "স্বাস্থ্য প'ৰ্টেল খোলক →",
      btnScreen: "+ নতুন স্ক্ৰীনিং আৰম্ভ কৰক",
    },
  },

  bn: {
    nav: {
      trajectory: 'যাত্রা',
      biomechanics: 'বায়োমেকানিক্স',
      cineloops: 'সিনে-লুপ',
      simulator: 'ট্রায়াজ সিম',
      sensors: 'সেন্সর',
      fieldVoices: 'পর্যবেক্ষণ',
      signIn: 'কর্মী লগইন',
      launchPortal: 'পোর্টাল খুলুন',
    },
    hero: {
      badge: 'অগ্রবর্তী স্বাস্থ্য প্রটোকল • ১০০% অফলাইন স্ক্রিনিং',
      headlineStart: 'জয়েন্টের ক্ষয় সনাক্তকরণ',
      headlineHighlight: 'বহু বছর আগে',
      headlineEnd: 'স্থায়ী ক্ষতির পূর্বে।',
      subtitle: 'গ্রামাঞ্চলে যেখানে এমআরআই ও এক্স-রে করার জন্য দূর ভ্রমণ করতে হয়, সেখানে OsteoSense স্বাস্থ্যকর্মীদের লক্ষণ পর্যবেক্ষণ ও সেন্সর দিয়ে সজ্জিত করে — ৩ মিনিটেই সঠিক স্ক্রিনিং।',
      btnPortal: 'স্বাস্থ্য পোর্টাল খুলুন →',
      btnTrajectory: 'ক্লিনিক্যাল ট্র্যাজেক্টরি দেখুন ↓',
      statOfflineVal: '১০০%',
      statOfflineLabel: 'অফলাইন অপারেশন',
      statSpeedVal: '< ৩ মিনিট',
      statSpeedLabel: 'দ্রুত প্রটোকল',
      statIndexVal: '০–১০০',
      statIndexLabel: 'যাচাইকৃত ঝুঁকি স্কোর',
      statFpsVal: '৬০ FPS',
      statFpsLabel: 'বায়োমেকানিক্যাল এআই',
    },
    simulator: {
      badge: 'ইন্টারেক্টিভ ঝুঁকি ক্যালকুলেটর',
      title: 'রিয়েল-টাইম পয়েন্ট-অব-কেয়ার ইঞ্জিন',
      subtitle: 'রোগীর লক্ষণ এবং শারীরিক পরামিতি নির্বাচন করে তাৎক্ষণিক ঝুঁকি বিশ্লেষণ ও রেফারেল পরামর্শ পান।',
      painLevel: 'জয়েন্টে ব্যথার মাত্রা (0-10)',
      ageLabel: 'রোগীর বয়স',
      bmiLabel: 'বডি মাস ইনডেক্স (BMI)',
      morningStiffness: 'সকালে জয়েন্ট শক্ত হওয়া ≥ ৩০ মিনিট',
      morningStiffnessDesc: 'ঘুম থেকে ওঠার পর দীর্ঘক্ষণ জয়েন্ট শক্ত থাকা',
      jointCrepitus: 'জয়েন্টে ঘর্ষণ বা কড়কড় শব্দ',
      jointCrepitusDesc: 'হাঁটু বাঁকানোর সময় স্পষ্ট শব্দ বা অনুভূতি',
      swelling: 'জয়েন্ট ফোলা বা তরল জমা',
      swellingDesc: 'হাঁটুর চারপাশে অতিরিক্ত ফোলা ভাব',
      triageScore: 'সামগ্রিক ঝুঁকি স্কোর',
      calculatedLevel: 'নির্ধারিত ঝুঁকি স্তর',
      btnTransfer: 'রোগীর ফর্মে স্থানান্তর করুন →',
    },
    footerBanner: {
      badge: 'কমিউনিটি স্বাস্থ্য সহায়তা প্ল্যাটফর্ম',
      title: 'প্রাথমিক স্বাস্থ্যকেন্দ্রে আধুনিক রোগ নির্ণয় আত্মবিশ্বাস',
      subtitle: '৩ মিনিটে রোগীদের স্ক্রিনিং করুন, ঝুঁকি স্কোর গণনা করুন এবং জেলা হাসপাতালের জন্য রেফারেল তৈরি করুন।',
      btnOpen: 'স্বাস্থ্য পোর্টাল খুলুন →',
      btnScreen: '+ নতুন স্ক্রিনিং শুরু করুন',
    },
  },

  te: {
    nav: {
      trajectory: 'ప్రయాణం',
      biomechanics: 'బయోమెకానిక్స్',
      cineloops: 'సినీ-లూప్స్',
      simulator: 'ట్రయాజ్ సిమ్',
      sensors: 'సెన్సార్లు',
      fieldVoices: 'అనుభవాలు',
      signIn: 'వర్కర్ సైన్ ఇన్',
      launchPortal: 'పోర్టల్ తెరవండి',
    },
    hero: {
      badge: 'ఫ్రంట్‌లైన్ ఆరోగ్య ప్రోటోకాల్ • 100% ఆఫ్‌లైన్ స్క్రీనింగ్',
      headlineStart: 'కీళ్ల అరుగుదలను గుర్తించండి',
      headlineHighlight: 'సంవత్సరాల ముందే',
      headlineEnd: 'కోలుకోలేని నష్టం జరగకముందే.',
      subtitle: 'గ్రామీణ ప్రాంతాలలో MRI మరియు ఎక్స్-రే కోసం దూర ప్రయాణం చేయాల్సి వచ్చినప్పుడు, OsteoSense ఆరోగ్య కార్యకర్తలకు లక్షణాల ప్రొఫైలింగ్ మరియు సెన్సార్లతో 3 నిమిషాల్లోనే ట్రయాజ్ చేయడానికి సహాయపడుతుంది.',
      btnPortal: 'ఆరోగ్య పోర్టల్ తెరవండి →',
      btnTrajectory: 'క్లినికల్ మార్గాన్ని అన్వేషించండి ↓',
      statOfflineVal: '100%',
      statOfflineLabel: 'ఆఫ్‌లైన్ ఆపరేషన్',
      statSpeedVal: '< 3 నిమి',
      statSpeedLabel: 'వేగవంతమైన ప్రోటోకాల్',
      statIndexVal: '0–100',
      statIndexLabel: 'ధృవీకరించిన రిస్క్ ఇండెక్స్',
      statFpsVal: '60 FPS',
      statFpsLabel: 'బయోమెకానికల్ AI',
    },
    simulator: {
      badge: 'ఇంటరాక్టివ్ క్లినికల్ కాలిక్యులేటర్',
      title: 'రియల్-టైమ్ పాయింట్-ఆఫ్-కేర్ రిస్క్ ఇంజిన్',
      subtitle: 'లక్షణాలు, రోగి వయస్సు మరియు BMI సరిచూసి ఫీల్డ్‌లో తక్షణ రిస్క్ గణనలను పొందండి.',
      painLevel: 'ప్రస్తుత కీళ్ల నొప్పి (0-10)',
      ageLabel: 'రోగి వయస్సు',
      bmiLabel: 'బాడీ మాస్ ఇండెక్స్ (BMI)',
      morningStiffness: 'ఉదయం కీళ్ల బిగువు ≥ 30 నిమిషాలు',
      morningStiffnessDesc: 'ఉదయం లేవగానే కీలు కదల్చడంలో ఎక్కువసేపు ఇబ్బంది ఉండటం',
      jointCrepitus: 'కీళ్లలో శబ్దం / రాపిడి',
      jointCrepitusDesc: 'కీలును వంచినప్పుడు లేదా నడిచినప్పుడు శబ్దం రావడం',
      swelling: 'కీళ్ల వాపు / నీరు చేరడం',
      swellingDesc: 'మోకాలి చుట్టూ వాపు కనిపించడం',
      triageScore: 'మొత్తం ట్రయాజ్ స్కోరు',
      calculatedLevel: 'రిస్క్ స్థాయి',
      btnTransfer: 'రోగి ఫారమ్‌కి తరలించండి →',
    },
    footerBanner: {
      badge: 'కమ్యూనిటీ హెల్త్ ఔట్రీచ్ ప్లాట్‌ఫామ్',
      title: 'ప్రాథమిక ఆరోగ్య కేంద్రంలో ఖచ్చితమైన నిర్ధారణ',
      subtitle: '3 నిమిషాల్లో రోగులను పరీక్షించండి, రిస్క్ స్కోర్‌ను లెక్కించండి మరియు ఆసుపత్రి రెఫరల్ డాక్యుమెంట్‌ను రూపొందించండి.',
      btnOpen: 'ఆరోగ్య పోర్టల్ తెరవండి →',
      btnScreen: '+ కొత్త స్క్రీనింగ్ ప్రారంభించండి',
    },
  },

  mn: {
    nav: {
      trajectory: 'হকশেল লম্বী',
      biomechanics: 'বায়োমেকানিক্স',
      cineloops: 'সিনে-লুপ',
      simulator: 'স্ক্রীনিং সিম',
      sensors: 'সেন্সর',
      fieldVoices: 'পেশেন্ট ৱাফম',
      signIn: 'লগইন তৌবীয়ু',
      launchPortal: 'পোর্তেল হাংদোকউ',
    },
    hero: {
      badge: 'অহানবা হকশেল প্রটোকোল • 100% অফলাইন স্ক্রীনিং',
      headlineStart: 'হকচাংগী ক্ষয় খঙদোকপা',
      headlineHighlight: 'চহী কয়াগী মাংঙৈদা',
      headlineEnd: 'মাং-তাকপা থোকত্র্রিঙৈদা।',
      subtitle: 'এমআরআই অমসুং এক্স-রেগীদমক লাপ্না চৎপগী মহুৎ, OsteoSense না হকশেল কর্মীশিংদা মিনিট ৩ গী মনুংদা স্ক্রীনিং তৌবগী খুদোংচাবা পীরি।',
      btnPortal: 'পোর্তেল হাংদোকউ →',
      btnTrajectory: 'হকশেল লম্বী য়েংবীয়ু ↓',
      statOfflineVal: '100%',
      statOfflineLabel: 'অফলাইন ওপরেসন',
      statSpeedVal: '< ৩ মিনিট',
      statSpeedLabel: 'য়াংনা স্ক্রীনিং',
      statIndexVal: '০–১০০',
      statIndexLabel: 'রিস্ক স্কোর',
      statFpsVal: '৬০ FPS',
      statFpsLabel: 'এআই বায়োমেকানিক্স',
    },
    simulator: {
      badge: 'ইন্তরেক্তিব স্ক্রীনিং কেলকুলেতর',
      title: 'অকুপ্পা রিস্ক ইঞ্জীন',
      subtitle: 'লক্ষণশিং অমসুং চহী তাক্লগা মুহুত্তদা রিস্ক স্কোর অমসুং দোক্তরগী পাউতাক লৌবীয়ু।',
      painLevel: 'নুংঙাইতবা (0-10)',
      ageLabel: 'পেশেন্টকী চহী',
      bmiLabel: 'BMI',
      morningStiffness: 'অয়ুক্না হার্দোকপা ≥ ৩০ মিনিট',
      morningStiffnessDesc: 'অয়ুক নুমিৎথোকপদা খুউ হার্দোকপা',
      jointCrepitus: 'খুউদা শক্তা থোকপা',
      jointCrepitusDesc: 'খোং কুপ্পদা শক্তা তারকপা',
      swelling: 'খুউ ফাথোকপা',
      swellingDesc: 'খুউদা ঈশিং চিল্লকপা',
      triageScore: 'রিস্ক স্কোর',
      calculatedLevel: 'রিস্ক লেভেল',
      btnTransfer: 'পেশেন্ট ফোর্মদা থাবীয়ু →',
    },
    footerBanner: {
      badge: 'হকশেল কেন্দ্র প্লেতফোর্ম',
      title: 'প্রাইমারি হেল্থ সেন্টরদা অফবা চেক-অপ',
      subtitle: 'মিনিট ৩ দা স্ক্রীনিং তৌবীয়ু অমসুং রিফরেল রিপোর্ত শেম্মীয়ু।',
      btnOpen: 'পোর্তেল হাংদোকউ →',
      btnScreen: '+ অনৌবা স্ক্রীনিং',
    },
  },

  mz: {
    nav: {
      trajectory: 'Hriselna Kawng',
      biomechanics: 'Biomechanics',
      cineloops: 'Cine-Loops',
      simulator: 'Triage Sim',
      sensors: 'Sensor-te',
      fieldVoices: 'Rawntute',
      signIn: 'Worker Login',
      launchPortal: 'Portal Hawng Rawh',
    },
    hero: {
      badge: 'Hriselna Protocol • 100% Offline Screening',
      headlineStart: 'Ruhseh Na Hma Hmuh Chhuah',
      headlineHighlight: 'Kum Kua Hma In',
      headlineEnd: 'Siamthat Theih Loh Hma In.',
      subtitle: 'Khawte ah MRI leh digital X-ray hmuh harsa tak anih laiin, OsteoSense hian frontline health worker-te chu minute 3 chhungin patient endik theihna a pe a ni.',
      btnPortal: 'Portal Hawng Rawh →',
      btnTrajectory: 'Hriselna Kawng En Rawh ↓',
      statOfflineVal: '100%',
      statOfflineLabel: 'Offline-a Hnathawh',
      statSpeedVal: '< 3 Min',
      statSpeedLabel: 'Hmanrang Protocol',
      statIndexVal: '0–100',
      statIndexLabel: 'Risk Tehna',
      statFpsVal: '60 FPS',
      statFpsLabel: 'AI Biomechanics',
    },
    simulator: {
      badge: 'Interactive Clinical Calculator',
      title: 'Real-Time Point-of-Care Risk Engine',
      subtitle: 'Taksa na leh kumte thlang la, hmunah la la in risk score leh doctor thurawn hmu rawh.',
      painLevel: 'Khur Na (0-10)',
      ageLabel: 'Kum',
      bmiLabel: 'Body Mass Index (BMI)',
      morningStiffness: 'Zing Khur Sak ≥ 30 Mins',
      morningStiffnessDesc: 'Zing thawh ruala khur chet harsa tak awm reng',
      jointCrepitus: 'Khur Ri (Crepitus)',
      jointCrepitusDesc: 'Khur thleh kual laia ri emaw nghing hriat theih',
      swelling: 'Khur Vung / Tui Tling',
      swellingDesc: 'Khup chhehvela vung langsar tak awm',
      triageScore: 'Triage Score Pumpui',
      calculatedLevel: 'Risk Dinhmun',
      btnTransfer: 'Patient Form-ah Thawn Rawh →',
    },
    footerBanner: {
      badge: 'Community Health Outreach Platform',
      title: 'Primary Health Center-a Rinngamna Thlen',
      subtitle: 'Minute 3 chhungin damlo endik la, risk score chhut chhuak la, district doctor tan referral report siam rawh.',
      btnOpen: 'Portal Hawng Rawh →',
      btnScreen: '+ Endikna Thar Tan Rawh',
    },
  },
};
