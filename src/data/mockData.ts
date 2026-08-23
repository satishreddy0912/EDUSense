// ─── Core Lesson Data ──────────────────────────────────────────────

export interface Concept {
  id: string;
  name: { en: string; te: string; hi: string; ta: string; kn: string };
  mastery: number;
  description: { en: string; te: string; hi: string; ta: string; kn: string };
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'short' | 'oral' | 'activity';
  typeLabel: string;
  question: { en: string; te: string; hi: string; ta: string; kn: string };
  conceptId: string;
  options?: string[];
  answer?: string;
}

export interface UploadedLesson {
  id: string;
  title: { en: string; te: string; hi: string; ta: string; kn: string };
  subject: { en: string; te: string; hi: string; ta: string; kn: string };
  category: string;
  fileType: 'pdf' | 'ppt' | 'doc' | 'image' | 'audio' | 'video';
  uploadDate: string;
  size: string;
  source: string;
  summary: { en: string; te: string; hi: string; ta: string; kn: string };
  keyPoints: { en: string[]; te: string[]; hi: string[]; ta: string[]; kn: string[] };
  importantQuestions: { en: string[]; te: string[]; hi: string[]; ta: string[]; kn: string[] };
  objectives: { en: string[]; te: string[]; hi: string[]; ta: string[]; kn: string[] };
  concepts: Concept[];
}

const M = (en: string, te: string, hi: string, ta: string, kn: string) => ({ en, te, hi, ta, kn });

export const lessonData: UploadedLesson = {
  id: 'lesson-fractions',
  title: M('Understanding Fractions', 'భిన్నాలను అర్థం చేసుకోవడం', 'भिन्न को समझना', 'பின்னங்களைப் புரிந்துகொள்ளுதல்', 'ಭಿನ್ನಾಂಶಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು'),
  subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'),
  category: 'Mathematics',
  fileType: 'pdf',
  uploadDate: '2026-08-22',
  size: '2.4 MB',
  source: 'Laptop',
  summary: M(
    'This lesson introduces the concept of fractions, covering numerators, denominators, equivalent fractions, comparing fractions, and adding fractions with like and unlike denominators.',
    'ఈ పాఠం భిన్నాల భావనను పరిచయం చేస్తుంది.',
    'यह पाठ भिन्न की अवधारणा प्रस्तुत करता है।',
    'இந்தப் பாடம் பின்னங்களின் கருத்தை அறிமுகப்படுத்துகிறது.',
    'ಈ ಪಾಠವು ಭಿನ್ನಾಂಶಗಳ ಪರಿಕಲ್ಪನೆಯನ್ನು ಪರಿಚಯಿಸುತ್ತದೆ.'
  ),
  keyPoints: {
    en: ['A fraction represents a part of a whole', 'Numerator is the top number', 'Denominator is the bottom number', 'Equivalent fractions have the same value'],
    te: ['భిన్నం ఒక మొత్తంలో భాగాన్ని సూచిస్తుంది', 'లవము పై సంఖ్య', 'హారము కింది సంఖ్య', 'సమాన భిన్నాలు ఒకే విలువను కలిగి ఉంటాయి'],
    hi: ['भिन्न एक पूर्ण का हिस्सा दर्शाता है', 'अंश ऊपर की संख्या है', 'हर नीचे की संख्या है', 'समान भिन्नों का मान समान होता है'],
    ta: ['பின்னம் ஒரு முழுமையின் பகுதியைக் குறிக்கிறது', 'தொகுதி மேல் எண்', 'பகுதி கீழ் எண்', 'சமமான பின்னங்கள் ஒரே மதிப்பைக் கொண்டுள்ளன'],
    kn: ['ಭಿನ್ನಾಂಶವು ಒಂದು ಸಂಪೂರ್ಣದ ಭಾಗವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ', 'ಅಂಶ ಮೇಲಿನ ಸಂಖ್ಯೆ', 'ಛೇದ ಕೆಳಗಿನ ಸಂಖ್ಯೆ', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು ಒಂದೇ ಮೌಲ್ಯವನ್ನು ಹೊಂದಿವೆ'],
  },
  importantQuestions: {
    en: ['What does the denominator represent?', 'How do you find equivalent fractions?', 'Explain adding fractions with unlike denominators.'],
    te: ['హారము ఏమి సూచిస్తుంది?', 'సమాన భిన్నాలను ఎలా కనుగొనాలి?', 'విభిన్న హారాలతో భిన్నాల సంకలనం వివరించండి.'],
    hi: ['हर क्या दर्शाता है?', 'समान भिन्न कैसे खोजें?', 'भिन्न हरों के साथ भिन्न जोड़ना समझाइए।'],
    ta: ['பகுதி என்ன குறிக்கிறது?', 'சமான பின்னங்களை எப்படிக் கண்டுபிடிப்பது?', 'வெவ்வேறு பகுதிகளுடன் பின்னங்களைச் சேர்ப்பதை விளக்குங்கள்.'],
    kn: ['ಛೇದವು ಏನನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ?', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳನ್ನು ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?', 'ವಿಭಿನ್ನ ಛೇದಗಳೊಂದಿಗೆ ಭಿನ್ನಾಂಶಗಳನ್ನು ಸೇರಿಸುವುದನ್ನು ವಿವರಿಸಿ.'],
  },
  objectives: {
    en: ['Identify parts of a fraction', 'Generate equivalent fractions', 'Compare fractions', 'Add fractions with unlike denominators'],
    te: ['భిన్నం భాగాలను గుర్తించడం', 'సమాన భిన్నాలను ఉత్పత్తి చేయడం', 'భిన్నాలను సరాసరి చేయడం', 'విభిన్న హారాలతో భిన్నాలను కూడడం'],
    hi: ['भिन्न के हिस्सों की पहचान करना', 'समान भिन्न उत्पन्न करना', 'भिन्न तुलना करना', 'भिन्न हरों के साथ भिन्न जोड़ना'],
    ta: ['பின்னத்தின் பாகங்களை அடையாளம் காண்பது', 'சமான பின்னங்களை உருவாக்குவது', 'பின்னங்களை ஒப்பிடுவது', 'வெவ்வேறு பகுதிகளுடன் பின்னங்களைச் சேர்ப்பது'],
    kn: ['ಭಿನ್ನಾಂಶದ ಭಾಗಗಳನ್ನು ಗುರುತಿಸುವುದು', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳನ್ನು ರಚಿಸುವುದು', 'ಭಿನ್ನಾಂಶಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡುವುದು', 'ವಿಭಿನ್ನ ಛೇದಗಳೊಂದಿಗೆ ಭಿನ್ನಾಂಶಗಳನ್ನು ಸೇರಿಸುವುದು'],
  },
  concepts: [
    { id: 'c1', name: M('Numerator & Denominator', 'లవము & హారము', 'अंश और हर', 'தொகுதி & பகுதி', 'ಅಂಶ & ಛೇದ'), mastery: 88, description: M('Identify parts of a fraction.', 'భిన్నం భాగాలను గుర్తించడం.', 'भिन्न के हिस्सों की पहचान।', 'பின்னத்தின் பாகங்களை அடையாளம் காண்பது.', 'ಭಿನ್ನಾಂಶದ ಭಾಗಗಳನ್ನು ಗುರುತಿಸುವುದು.') },
    { id: 'c2', name: M('Equivalent Fractions', 'సమాన భిన్నాలు', 'समान भिन्न', 'சமான பின்னங்கள்', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು'), mastery: 74, description: M('Recognize equivalent fractions.', 'సమాన భిన్నాలను గుర్తించడం.', 'समान भिन्न पहचानना।', 'சமான பின்னங்களை அடையாளம் காண்பது.', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳನ್ನು ಗುರುತಿಸುವುದು.') },
    { id: 'c3', name: M('Comparing Fractions', 'భిన్నాల సరామర్మీ', 'भिन्न तुलना', 'பின்னங்களை ஒப்பிடுதல்', 'ಭಿನ್ನಾಂಶಗಳ ಹೋಲಿಕೆ'), mastery: 68, description: M('Compare fractions.', 'భిన్నాలను సరాసరి చేయడం.', 'भिन्न तुलना करना।', 'பின்னங்களை ஒப்பிடுவது.', 'ಭಿನ್ನಾಂಶಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡುವುದು.') },
    { id: 'c4', name: M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'), mastery: 36, description: M('Add fractions with unlike denominators.', 'విభిన్న హారాలతో భిన్నాలను కూడడం.', 'भिन्न हरों के साथ भिन्न जोड़ना।', 'வெவ்வேறு பகுதிகளுடன் பின்னங்களைச் சேர்ப்பது.', 'ವಿಭಿನ್ನ ಛೇದಗಳೊಂದಿಗೆ ಭಿನ್ನಾಂಶಗಳನ್ನು ಸೇರಿಸುವುದು.') },
  ],
};

export const lessonLibrary: UploadedLesson[] = [
  lessonData,
  {
    id: 'lesson-decimals',
    title: M('Introduction to Decimals', 'దశాంశాల పరిచయం', 'दशमलव परिचय', 'தசமங்கள் அறிமுகம்', 'ದಶಮಾಂಶಗಳ ಪರಿಚಯ'),
    subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'),
    category: 'Mathematics',
    fileType: 'ppt',
    uploadDate: '2026-08-20',
    size: '5.1 MB',
    source: 'Google Drive',
    summary: M('Understanding decimal numbers and their relationship to fractions.', 'దశాంశ సంఖ్యలు మరియు భిన్నాలతో వాటి సంబంధం.', 'दशमलव संख्या और भिन्न के साथ उनका संबंध।', 'தசம எண்கள் மற்றும் பின்னங்களுடன் அவற்றின் தொடர்பு.', 'ದಶಮಾಂಶ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಭಿನ್ನಾಂಶಗಳೊಂದಿಗೆ ಅವುಗಳ ಸಂಬಂಧ.'),
    keyPoints: { en: ['Decimals represent fractions with denominator 10, 100, etc.', 'Place value extends beyond the decimal point'], te: ['దశాంశాలు 10, 100 హారాలతో భిన్నాలను సూచిస్తాయి', 'స్థాన విలువ దశాంశ బిందువు తరువాత విస్తరిస్తుంది'], hi: ['दशमलव हर 10, 100 आदि के साथ भिन्न दर्शाते हैं', 'स्थान मान दशमलव बिंदु से परे विस्तृत होता है'], ta: ['தசமங்கள் பகுதி 10, 100 ஆகியவற்றுடன் பின்னங்களைக் குறிக்கின்றன', 'இடமதிப்பு தசம புள்ளிக்கு அப்பால் நீட்டிக்கப்படுகிறது'], kn: ['ದಶಮಾಂಶಗಳು ಛೇದ 10, 100 ರೊಂದಿಗೆ ಭಿನ್ನಾಂಶಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತವೆ', 'ಸ್ಥಾನ ಮೌಲ್ಯವು ದಶಮಾಂಶ ಬಿಂದುವಿನ ಹಿಂದೆ ವಿಸ್ತರಿಸುತ್ತದೆ'] },
    importantQuestions: { en: ['Convert 3/4 to decimal.', 'What is 0.25 as a fraction?'], te: ['3/4 ని దశాంశంగా మార్చండి.', '0.25 ని భిన్నంగా ఏమిటి?'], hi: ['3/4 को दशमलव में बदलें।', '0.25 भिन्न के रूप में क्या है?'], ta: ['3/4 ஐ தசமமாக மாற்றவும்.', '0.25 பின்னமாக என்ன?'], kn: ['3/4 ಅನ್ನು ದಶಮಾಂಶಕ್ಕೆ ಪರಿವರ್ತಿಸಿ.', '0.25 ಭಿನ್ನಾಂಶವಾಗಿ ಏನು?'] },
    objectives: { en: ['Understand decimal place value', 'Convert between fractions and decimals'], te: ['దశాంశ స్థాన విలువను అర్థం చేసుకోవడం', 'భిన్నాలు మరియు దశాంశాల మధ్య మార్పిడి'], hi: ['दशमलव स्थान मान को समझना', 'भिन्न और दशमलव के बीच रूपांतरण'], ta: ['தசம இடமதிப்பைப் புரிந்துகொள்வது', 'பின்னங்கள் மற்றும் தசமங்களுக்கு இடையே மாற்றம்'], kn: ['ದಶಮಾಂಶ ಸ್ಥಾನ ಮೌಲ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು', 'ಭಿನ್ನಾಂಶ ಮತ್ತು ದಶಮಾಂಶಗಳ ನಡುವೆ ಪರಿವರ್ತನೆ'] },
    concepts: [
      { id: 'd1', name: M('Decimal Place Value', 'దశాంశ స్థాన విలువ', 'दशमलव स्थान मान', 'தசம இடமதிப்பு', 'ದಶಮಾಂಶ ಸ್ಥಾನ ಮೌಲ್ಯ'), mastery: 82, description: M('Understanding tenths and hundredths.', 'దశాంశాలు మరియు శతాంశాలను అర్థం చేసుకోవడం.', 'दसवें और सौवें को समझना।', 'பத்தில் ஒரு பங்கு மற்றும் நூற்றில் ஒரு பங்கைப் புரிந்துகொள்வது.', 'ದಶಕಗಳು ಮತ್ತು ಶತಕಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು.') },
    ],
  },
  {
    id: 'lesson-photosynthesis',
    title: M('Plant Biology & Photosynthesis', 'మొక్కల జీవశాస్త్రం', 'पादप जीव विज्ञान', 'தாவர உயிரியல்', 'ಸಸ್ಯ ಜೀವಶಾಸ್ತ್ರ'),
    subject: M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ'),
    category: 'Science',
    fileType: 'video',
    uploadDate: '2026-08-18',
    size: '48 MB',
    source: 'Mobile',
    summary: M('How plants make food using sunlight, water, and carbon dioxide.', 'మొక్కలు సూర్యకాంతం, నీరు, కార్బన్ డయాక్సైడ్ ఉపయోగించి ఆహారం ఎలా తయారు చేస్తాయి.', 'पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड से भोजन कैसे बनाते हैं।', 'தாவரங்கள் சூரிய ஒளி, நீர், கார்பன் டை ஆக்ஸைடு பயன்படுத்தி உணவை எவ்வாறு தயாரிக்கின்றன.', 'ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು, ಕಾರ್ಬನ್ ಡಯಾಕ್ಸೈಡ್ ಬಳಸಿ ಆಹಾರವನ್ನು ಹೇಗೆ ತಯಾರಿಸುತ್ತವೆ.'),
    keyPoints: { en: ['Photosynthesis produces glucose and oxygen', 'Chlorophyll captures light energy', 'Equation: 6CO2 + 6H2O → C6H12O6 + 6O2'], te: ['కిరణజన్య సంశ్లేషణ గ్లూకోస్ మరియు ఆక్సిజన్‌ను ఉత్పత్తి చేస్తుంది', 'క్లోరోఫిల్ కాంతి శక్తిని గ్రహిస్తుంది'], hi: ['प्रकाश संश्लेषण ग्लूकोज और ऑक्सीजन उत्पन्न करता है', 'क्लोरोफिल प्रकाश ऊर्जा को ग्रहण करता है'], ta: ['ஒளிச்சேர்க்கை குளுக்கோஸ் மற்றும் ஆக்ஸிஜனை உற்பத்தி செய்கிறது', 'குளோரோபில் ஒளி ஆற்றலை பிடிக்கிறது'], kn: ['ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಗ್ಲೂಕೋಸ್ ಮತ್ತು ಆಮ್ಲಜನಕವನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ', 'ಕ್ಲೋರೋಫಿಲ್ ಬೆಳಕಿನ ಶಕ್ತಿಯನ್ನು ಸೆರೆಹಿಡಿಯುತ್ತದೆ'] },
    importantQuestions: { en: ['What is the role of chlorophyll?', 'Write the photosynthesis equation.'], te: ['క్లోరోఫిల్ పాత్ర ఏమిటి?', 'కిరణజన్య సంశ్లేషణ సమీకరణం రాయండి.'], hi: ['क्लोरोफिल की भूमिका क्या है?', 'प्रकाश संश्लेषण समीकरण लिखें।'], ta: ['குளோரோபில்லின் பங்கு என்ன?', 'ஒளிச்சேர்க்கை சமன்பாட்டை எழுதுங்கள்.'], kn: ['ಕ್ಲೋರೋಫಿಲ್‌ನ ಪಾತ್ರವೇನು?', 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಸಮೀಕರಣವನ್ನು ಬರೆಯಿರಿ.'] },
    objectives: { en: ['Understand photosynthesis process', 'Identify plant cell components'], te: ['కిరణజన్య సంశ్లేషణ ప్రక్రియను అర్థం చేసుకోవడం', 'మొక్క కణ భాగాలను గుర్తించడం'], hi: ['प्रकाश संश्लेषण प्रक्रिया को समझना', 'पादप कोशिका घटकों की पहचान करना'], ta: ['ஒளிச்சேர்க்கை செயல்முறையைப் புரிந்துகொள்வது', 'தாவர செல் கூறுகளை அடையாளம் காண்பது'], kn: ['ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು', 'ಸಸ್ಯ ಕೋಶ ಘಟಕಗಳನ್ನು ಗುರುತಿಸುವುದು'] },
    concepts: [
      { id: 'p1', name: M('Photosynthesis', 'కిరణజన్య సంశ్లేషణ', 'प्रकाश संश्लेषण', 'ஒளிச்சேர்க்கை', 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ'), mastery: 65, description: M('Process of making food from sunlight.', 'సూర్యకాంతం నుండి ఆహారం తయారు చేసే ప్రక్రియ.', 'सूर्य के प्रकाश से भोजन बनाने की प्रक्रिया।', 'சூரிய ஒளியிலிருந்து உணவு தயாரிக்கும் செயல்முறை.', 'ಸೂರ್ಯನ ಬೆಳಕಿನಿಂದ ಆಹಾರ ತಯಾರಿಸುವ ಪ್ರಕ್ರಿಯೆ.') },
    ],
  },
];

export const firstScores: Record<string, number> = { c1: 88, c2: 74, c3: 68, c4: 36 };
export const secondScores: Record<string, number> = { c1: 92, c2: 85, c3: 80, c4: 84 };

export const reTeachingStrategy = {
  title: M('Re-Teaching Strategy: Adding Fractions', 'పునర్బోధన వ్యూహం: భిన్నాల సంకలనం', 'पुनः शिक्षण रणनीति: भिन्न जोड़ना', 'மறுபயிற்றி உத்தி: பின்னங்களைச் சேர்த்தல்', 'ಪುನರ್ಬೋಧನೆ ತಂತ್ರ: ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'),
  strategies: [
    { icon: 'ruler', label: M('Visual Teaching Strategy', 'దృశ్య బోధనా వ్యూహం', 'दृश्य शिक्षण रणनीति', 'காட்சி கற்பித்தல் உத்தி', 'ದೃಶ್ಯ ಬೋಧನಾ ತಂತ್ರ'), text: M('Use fraction strips to show 1/4 + 1/4 = 2/4 = 1/2.', 'భిన్నం పట్టీలను ఉపయోగించండి.', 'भिन्न पट्टी का उपयोग करें।', 'பின்ன பட்டைகளைப் பயன்படுத்துங்கள்.', 'ಭಿನ್ನಾಂಶ ಪಟ್ಟಿಗಳನ್ನು ಬಳಸಿ.') },
    { icon: 'apple', label: M('Real-Life Example', 'వాస్తవ జీవిత ఉదాహరణ', 'वास्तविक उदाहरण', 'நிஜ வாழ்க்கை உதாரணம்', 'ನಿಜ ಜೀವನ ಉದಾಹರಣೆ'), text: M('Cut a chapati into 4 pieces. Take 1, then another = 2/4 = half.', 'రొట్టెను 4 ముక్కలుగా కట్ చేయండి.', 'रोटी को 4 टुकड़ों में काटें।', 'ரொட்டியை 4 துண்டுகளாக வெட்டவும்.', 'ರೊಟ್ಟಿಯನ್ನು 4 ತುಂಡುಗಳಾಗಿ ಕತ್ತರಿಸಿ.') },
    { icon: 'pen', label: M('Blackboard Activity', 'బ్లాక్‌బోర్డ్ కార్యకలాపం', 'ब्लैकबोर्ड गतिविधि', 'கருப்புப் பலகை செயல்பாடு', 'ಬ್ಲ್ಯಾಕ್‌ಬೋರ್ಡ್ ಚಟುವಟಿಕೆ'), text: M('Draw two pizzas, shade 1/4 each, count total.', 'రెండు పిజ్జాలు గీయండి.', 'दो पिज़्ज़ा बनाएं।', 'இரண்டு பிச்சா வரையவும்.', 'ಎರಡು ಪಿಜ್ಜಾ ಎಳೆಯಿರಿ.') },
    { icon: 'users', label: M('Group Activity', 'సమూహ కార్యకలాపం', 'समूह गतिविधि', 'குழு செயல்பாடு', 'ಗುಂಪು ಚಟುವಟಿಕೆ'), text: M('In groups of 4, each student = 1/4. Combine to show 2/4, 3/4, 4/4.', '4 గ్రూపుల్లో, ఒక్కొక్కరు 1/4.', '4 के समूह में, प्रत्येक = 1/4।', '4 குழுக்களில், ஒவ்வொருவரும் 1/4.', '4 ಗುಂಪುಗಳಲ್ಲಿ, ಪ್ರತಿಯೊಬ್ಬರೂ 1/4.') },
  ],
};

// ─── Gap Analysis ──────────────────────────────────────────────────

export const gapAnalysisData = {
  understood: 28,
  struggling: 12,
  total: 40,
  understandingScore: 70,
  classPerformance: 66,
  confusingConcepts: [
    { concept: M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'), confusionRate: 64 },
    { concept: M('Common Denominators', 'సాధారణ హారాలు', 'सामान्य हर', 'பொது பகுதிகள்', 'ಸಾಮಾನ್ಯ ಛೇದಗಳು'), confusionRate: 52 },
    { concept: M('Equivalent Fractions', 'సమాన భిన్నాలు', 'समान भिन्न', 'சமான பின்னங்கள்', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು'), confusionRate: 26 },
  ],
};

// ─── Student Progress ──────────────────────────────────────────────

export interface StudentProgress {
  id: string;
  name: { en: string; te: string; hi: string; ta: string; kn: string };
  lessonsCompleted: number;
  quizScore: number;
  attendance: number;
  learningLevel: 'good' | 'moderate' | 'attention';
  weakTopics: { en: string; te: string; hi: string; ta: string; kn: string }[];
}

export const studentProgress: StudentProgress[] = [
  { id: 's1', name: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'), lessonsCompleted: 12, quizScore: 88, attendance: 95, learningLevel: 'good', weakTopics: [] },
  { id: 's2', name: M('Priya', 'ప్రియా', 'प्रिया', 'ப்ரியா', 'ಪ್ರಿಯಾ'), lessonsCompleted: 10, quizScore: 72, attendance: 88, learningLevel: 'moderate', weakTopics: [M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ')] },
  { id: 's3', name: M('Rahul', 'రాహుల్', 'राहुल', 'ராஹுல்', 'ರಾಹುಲ್'), lessonsCompleted: 7, quizScore: 45, attendance: 72, learningLevel: 'attention', weakTopics: [M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'), M('Comparing Fractions', 'భిన్నాల సరామర్మీ', 'भिन्न तुलना', 'பின்னங்களை ஒப்பிடுதல்', 'ಭಿನ್ನಾಂಶಗಳ ಹೋಲಿಕೆ')] },
  { id: 's4', name: M('Sneha', 'స్నేహ', 'स्नेहा', 'ஸ்நேகா', 'ಸ್ನೇಹಾ'), lessonsCompleted: 11, quizScore: 81, attendance: 92, learningLevel: 'good', weakTopics: [] },
  { id: 's5', name: M('Karthik', 'కార్తిక్', 'कार्तिक', 'கார்த்திக்', 'ಕಾರ್ತಿಕ್'), lessonsCompleted: 8, quizScore: 58, attendance: 80, learningLevel: 'moderate', weakTopics: [M('Equivalent Fractions', 'సమాన భిన్నాలు', 'समान भिन्न', 'சமான பின்னங்கள்', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು')] },
  { id: 's6', name: M('Divya', 'దివ్య', 'दिव्या', 'திவ்யா', 'ದಿವ್ಯಾ'), lessonsCompleted: 13, quizScore: 94, attendance: 98, learningLevel: 'good', weakTopics: [] },
];

// ─── Urban: Live Tracking ──────────────────────────────────────────

export const liveClassData = {
  totalPresent: 38,
  activeStudents: 31,
  inactiveStudents: 7,
  questionCount: 14,
  participationScore: 78,
  engagementScore: 82,
};

export const studentInteractions = [
  { id: 'si1', name: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'), questions: 5, answers: 8, participation: 90, chats: 12, discussion: 7, score: 88 },
  { id: 'si2', name: M('Sneha', 'స్నేహ', 'स्नेहा', 'ஸ்நேகா', 'ಸ್ನೇಹಾ'), questions: 3, answers: 6, participation: 82, chats: 8, discussion: 5, score: 76 },
  { id: 'si3', name: M('Karthik', 'కార్తిక్', 'कार्तिक', 'கார்த்திக்', 'ಕಾರ್ತಿಕ್'), questions: 1, answers: 3, participation: 55, chats: 2, discussion: 1, score: 48 },
  { id: 'si4', name: M('Divya', 'దివ్య', 'दिव्या', 'திவ்யா', 'ದಿವ್ಯಾ'), questions: 4, answers: 9, participation: 95, chats: 15, discussion: 8, score: 92 },
  { id: 'si5', name: M('Rahul', 'రాహుల్', 'राहुल', 'ராஹுல்', 'ರಾಹುಲ್'), questions: 0, answers: 1, participation: 30, chats: 0, discussion: 0, score: 25 },
];

export const handRaises = [
  { id: 'hr1', name: M('Priya', 'ప్రియా', 'प्रिया', 'ப்ரியா', 'ಪ್ರಿಯಾ'), time: '10:32 AM', duration: '2 min', priority: 1 },
  { id: 'hr2', name: M('Karthik', 'కార్తిక్', 'कार्तिक', 'கார்த்திக்', 'ಕಾರ್ತಿಕ್'), time: '10:34 AM', duration: '4 min', priority: 2 },
  { id: 'hr3', name: M('Sneha', 'స్నేహ', 'स्नेहा', 'ஸ்நேகா', 'ಸ್ನேಹಾ'), time: '10:35 AM', duration: '1 min', priority: 3 },
];

export const doubts = [
  { id: 'd1', student: M('Priya', 'ప్రియా', 'प्रिया', 'ப்ரியா', 'ಪ್ರಿಯಾ'), question: M('Why do we need common denominators?', 'సాధారణ హారాలు ఎందుకు అవసరం?', 'सामान्य हर क्यों चाहिए?', 'பொது பகுதிகள் ஏன் தேவை?', 'ಸಾಮಾನ್ಯ ಛೇದಗಳು ಏಕೆ ಬೇಕು?'), topic: M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'), time: '10:30 AM', difficulty: 'Medium', status: 'pending' as const },
  { id: 'd2', student: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'), question: M('Is 2/4 the same as 1/2?', '2/4 మరియు 1/2 ఒక్కటేనా?', 'क्या 2/4 और 1/2 समान हैं?', '2/4 மற்றும் 1/2 ஒன்றா?', '2/4 ಮತ್ತು 1/2 ಒಂದೇಯೇ?'), topic: M('Equivalent Fractions', 'సమాన భిన్నాలు', 'समान भिन्न', 'சமான பின்னங்கள்', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು'), time: '10:22 AM', difficulty: 'Easy', status: 'answered' as const },
  { id: 'd3', student: M('Karthik', 'కార్తిక్', 'कार्तिक', 'கார்த்திக்', 'ಕಾರ್ತಿಕ್'), question: M('How to compare 3/5 and 2/3?', '3/5 మరియు 2/3 ను ఎలా సరాసరి చేయాలి?', '3/5 और 2/3 की तुलना कैसे करें?', '3/5 மற்றும் 2/3 ஒப்பிட எப்படி?', '3/5 ಮತ್ತು 2/3 ಅನ್ನು ಹೇಗೆ ಹೋಲಿಕೆ ಮಾಡಲಿ?'), topic: M('Comparing Fractions', 'భిన్నాల సరామర్మీ', 'भिन्न तुलना', 'பின்னங்களை ஒப்பிடுதல்', 'ಭಿನ್ನಾಂಶಗಳ ಹೋಲಿಕೆ'), time: '10:15 AM', difficulty: 'Hard', status: 'pending' as const },
  { id: 'd4', student: M('Divya', 'దివ్య', 'दिव्या', 'திவ்யா', 'ದಿವ್ಯಾ'), question: M('Can fractions be greater than 1?', 'భిన్నాలు 1 కంటే పెద్దవి కాగలవా?', 'क्या भिन्न 1 से बड़े हो सकते हैं?', 'பின்னங்கள் 1 ஐ விட பெரியதாக இருக்க முடியுமா?', 'ಭಿನ್ನಾಂಶಗಳು 1 ಕ್ಕಿಂತ ದೊಡ್ಡದಾಗಿರಬಹುದೇ?'), topic: M('Improper Fractions', 'అసమాన భిన్నాలు', 'विषम भिन्न', 'கலப்பு பின்னங்கள்', 'ವಿಷಮ ಭಿನ್ನಾಂಶಗಳು'), time: '10:08 AM', difficulty: 'Medium', status: 'resolved' as const },
];

// Classroom heatmap: 5x4 grid representing seat positions
export const classroomHeatmap: ('green' | 'yellow' | 'red' | 'purple')[][] = [
  ['green', 'green', 'yellow', 'green', 'green'],
  ['green', 'yellow', 'red', 'yellow', 'green'],
  ['yellow', 'red', 'purple', 'red', 'yellow'],
  ['green', 'yellow', 'red', 'yellow', 'green'],
];

// AI Attention Analysis
export const attentionAnalysis = {
  eyeContact: 78,
  participation: 74,
  speakingActivity: 62,
  noteTaking: 81,
  questionAsking: 55,
  attentionScore: 72,
  engagementScore: 76,
  learningScore: 68,
};

// AI Teacher Assistant suggestions
export const aiSuggestions = [
  M('Many students are confused about Adding Fractions. Consider revisiting common denominators.', 'భిన్నాల సంకలనం గురించి అనేక విద్యార్థులు గందరగోలలో ఉన్నారు.', 'कई छात्र भिन्न जोड़ने को लेकर उलझन में हैं।', 'பல மாணவர்கள் பின்னங்களைச் சேர்ப்பதில் குழப்பத்தில் உள்ளனர்.', 'ಅನೇಕ ವಿದ್ಯಾರ್ಥಿಗಳು ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನದಲ್ಲಿ ಗೊಂದಲದಲ್ಲಿದ್ದಾರೆ.'),
  M('Engagement has dropped below 50% in the last 5 minutes. Ask an interactive question.', 'గత 5 నిమిషాలలో నిమగ్నత 50% కంటే తగ్గింది.', 'पिछले 5 मिनट में जुड़ाव 50% से नीचे गिर गया है।', 'கடந்த 5 நிமிடங்களில் ஈடுபாடு 50% க்கும் குறைந்துள்ளது.', 'ಕಳೆದ 5 ನಿಮಿಷಗಳಲ್ಲಿ ನಿರತತೆ 50% ಗಿಂತ ಕಡಿಮೆಯಾಗಿದೆ.'),
  M('Provide another example for equivalent fractions using visual aids.', 'దృశ్య సహాయాలతో సమాన భిన్నాలకు మరొక ఉదాహరణ ఇవ్వండి.', 'समान भिन्न के लिए एक और उदाहरण दें।', 'சமான பின்னங்களுக்கு மற்றொரு உதாரணம் கொடுக்கவும்.', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳಿಗೆ ಇನ್ನೊಂದು ಉದಾಹರಣೆ ನೀಡಿ.'),
  M('Conduct a quick 3-question quiz to check understanding before moving on.', 'ముందుకు వెళ్ళడానికి ముందు త్వరిత క్విజ్ నిర్వహించండి.', 'आगे बढ़ने से पहले एक त्वरित क्विज़ आयोजित करें।', 'முன்னேறுவதற்கு முன் ஒரு விரைவான வினா நடத்தவும்.', 'ಮುಂದಕ್ಕೆ ಸಾಗುವ ಮೊದಲು ತ್ವರಿತ ಕ್ವಿಜ್ ನಡೆಸಿ.'),
];

// ─── AI Smart Quiz Generator ───────────────────────────────────────

export const quizQuestions = [
  { id: 'qz1', type: 'mcq', typeLabel: 'MCQ', question: M('What is 1/2 + 1/4?', '1/2 + 1/4 ఎంత?', '1/2 + 1/4 कितना है?', '1/2 + 1/4 எவ்வளவு?', '1/2 + 1/4 ಎಷ್ಟು?'), options: ['2/6', '3/4', '1/6', '2/8'], answer: '3/4', difficulty: 'Easy' as const },
  { id: 'qz2', type: 'truefalse', typeLabel: 'True/False', question: M('1/3 is equivalent to 2/6.', '1/3 మరియు 2/6 సమానమైనవి.', '1/3 और 2/6 समान हैं।', '1/3 மற்றும் 2/6 சமானமானவை.', '1/3 ಮತ್ತು 2/6 ಸಮಾನವಾಗಿವೆ.'), options: ['True', 'False'], answer: 'True', difficulty: 'Easy' as const },
  { id: 'qz3', type: 'short', typeLabel: 'Short Answer', question: M('Convert 3/4 to a decimal.', '3/4 ని దశాంశంగా మార్చండి.', '3/4 को दशमलव में बदलें।', '3/4 ஐ தசமமாக மாற்றவும்.', '3/4 ಅನ್ನು ದಶಮಾಂಶಕ್ಕೆ ಪರಿವರ್ತಿಸಿ.'), answer: '0.75', difficulty: 'Medium' as const },
  { id: 'qz4', type: 'scenario', typeLabel: 'Scenario', question: M('A pizza is cut into 8 slices. Arjun eats 3 slices and Priya eats 2. What fraction is left?', 'పిజ్జా 8 ముక్కలుగా కట్ చేయబడింది. అర్జున్ 3 ముక్కలు, ప్రియా 2 ముక్కలు తింటే ఎంత మిగులుతుంది?', 'पिज़्ज़ा 8 स्लाइस में कटा है। अर्जुन 3 और प्रिया 2 खाते हैं। कितना बचेगा?', 'பிச்சா 8 துண்டுகளாக வெட்டப்பட்டது. அர்ஜுன் 3, ப்ரியா 2 சாப்பிட்டால் எவ்வளவு மீதம்?', 'ಪಿಜ್ಜಾ 8 ತುಣುಕುಗಳಾಗಿ ಕತ್ತರಿಸಲಾಗಿದೆ. ಅರ್ಜುನ್ 3, ಪ್ರಿಯಾ 2 ತಿಂದರೆ ಎಷ್ಟು ಉಳಿಯುತ್ತದೆ?'), options: ['3/8', '5/8', '3/5', '1/4'], answer: '3/8', difficulty: 'Hard' as const },
  { id: 'qz5', type: 'mcq', typeLabel: 'MCQ', question: M('Which is the largest fraction?', 'అతిపెద్ద భిన్నం ఏది?', 'सबसे बड़ा भिन्न कौन सा है?', 'பெரிய பின்னம் எது?', 'ಅತಿದೊಡ್ಡ ಭಿನ್ನಾಂಶ ಯಾವುದು?'), options: ['2/3', '3/4', '1/2', '5/8'], answer: '3/4', difficulty: 'Medium' as const },
];

// ─── AI Parent Dashboard ───────────────────────────────────────────

export const parentData = {
  childName: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'),
  attendance: 95,
  performance: 88,
  assignments: { completed: 11, total: 12 },
  teacherFeedback: M('Arjun shows excellent understanding of fractions and actively participates. Keep practicing adding fractions with unlike denominators.', 'అర్జున్ భిన్నాలపై అద్భుత అవగాహన చూపుతున్నాడు.', 'अर्जुन भिन्न की उत्कृष्ट समझ दिखाता है।', 'அர்ஜுன் பின்னங்களில் சிறந்த புரிதலைக் காட்டுகிறார்.', 'ಅರ್ಜುನ್ ಭಿನ್ನಾಂಶಗಳ ಉತ್ತಮ ತಿಳುವಳಿಕೆ ತೋರುತ್ತಾನೆ.'),
  progressReports: [
    { week: 'W1', score: 72 },
    { week: 'W2', score: 78 },
    { week: 'W3', score: 82 },
    { week: 'W4', score: 85 },
    { week: 'W5', score: 88 },
  ],
};

// ─── AI Weekly Report ──────────────────────────────────────────────

export const weeklyReportData = {
  week: 'Aug 18–22, 2026',
  attendance: [95, 88, 92, 98, 85],
  performance: [72, 78, 82, 85, 88],
  engagement: [65, 70, 75, 72, 80],
  weakAreas: [M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ')],
  improvement: M('Continue practicing with visual fraction strips. Focus on unlike denominators.', 'దృశ్య భిన్నం పట్టీలతో అభ్యాసం కొనసాగించండి.', 'दृश्य भिन्न पट्टी के साथ अभ्यास जारी रखें।', 'காட்சி பின்ன பட்டைகளுடன் பயிற்சியைத் தொடரவும்.', 'ದೃಶ್ಯ ಭಿನ್ನಾಂಶ ಪಟ್ಟಿಗಳೊಂದಿಗೆ ಅಭ್ಯಾಸ ಮುಂದುವರಿಸಿ.'),
};

// ─── AI Personalized Learning Path ─────────────────────────────────

export const learningPathData = {
  studentName: M('Priya', 'ప్రియా', 'प्रिया', 'ப்ரியா', 'ಪ್ರಿಯಾ'),
  weakTopics: [
    M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'),
  ],
  strongTopics: [
    M('Numerator & Denominator', 'లవము & హారము', 'अंश और हर', 'தொகுதி & பகுதி', 'ಅಂಶ & ಛೇದ'),
    M('Equivalent Fractions', 'సమాన భిన్నాలు', 'समान भिन्न', 'சமான பின்னங்கள்', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು'),
  ],
  recommendedLessons: [
    M('Visual Guide: Adding Unlike Fractions', 'దృశ్య గైడ్: విభిన్న హారాల సంకలనం', 'दृश्य गाइड: भिन्न हर जोड़ना', 'காட்சி வழிகாட்டி: வெவ்வேறு பகுதி சேர்த்தல்', 'ದೃಶ್ಯ ಮಾರ್ಗದರ್ಶಿ: ವಿಭಿನ್ನ ಛೇದ ಸಂಕಲನ'),
    M('Common Denominators Explained', 'సాధారణ హారాలు వివరణ', 'सामान्य हर समझाए गए', 'பொது பகுதி விளக்கம்', 'ಸಾಮಾನ್ಯ ಛೇದಗಳ ವಿವರಣೆ'),
  ],
  recommendedPractice: [
    M('Fraction Strips Activity', 'భిన్నం పట్టీల కార్యకలాపం', 'भिन्न पट्टी गतिविधि', 'பின்ன பட்டை செயல்பாடு', 'ಭಿನ್ನಾಂಶ ಪಟ್ಟಿ ಚಟುವಟಿಕೆ'),
    M('10 Practice Problems: Adding Fractions', '10 అభ్యాస సమస్యలు', '10 अभ्यास प्रश्न', '10 பயிற்சி கேள்விகள்', '10 ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು'),
  ],
  progressHistory: [
    { week: 'W1', mastery: 55 },
    { week: 'W2', mastery: 62 },
    { week: 'W3', mastery: 68 },
    { week: 'W4', mastery: 72 },
    { week: 'W5', mastery: 78 },
  ],
};

// ─── AI Attendance ─────────────────────────────────────────────────

export const attendanceData = {
  total: 40,
  present: 38,
  absent: 2,
  late: 3,
  students: [
    { id: 'a1', name: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'), status: 'present', time: '09:00', method: 'Face Recognition' },
    { id: 'a2', name: M('Priya', 'ప్రియా', 'प्रिया', 'ப்ரியா', 'ಪ್ರಿಯಾ'), status: 'present', time: '09:01', method: 'Face Recognition' },
    { id: 'a3', name: M('Rahul', 'రాహుల్', 'राहुल', 'ராஹுல்', 'ರಾಹುಲ್'), status: 'late', time: '09:15', method: 'Face Recognition' },
    { id: 'a4', name: M('Sneha', 'స్నేహ', 'स्नेहा', 'ஸ்நேகா', 'ಸ್ನೇಹಾ'), status: 'present', time: '08:59', method: 'Face Recognition' },
    { id: 'a5', name: M('Karthik', 'కార్తిక్', 'कार्तिक', 'கார்த்திக்', 'ಕಾರ್ತಿಕ್'), status: 'late', time: '09:22', method: 'Manual' },
    { id: 'a6', name: M('Divya', 'దివ్య', 'दिव्या', 'திவ்யா', 'ದಿವ್ಯಾ'), status: 'present', time: '08:58', method: 'Face Recognition' },
    { id: 'a7', name: M('Vikram', 'విక్రమ్', 'विक्रम', 'விக்ரம்', 'ವಿಕ್ರಮ್'), status: 'absent', time: '-', method: '-' },
  ],
};

// ─── Teacher Dashboard (kept compatible) ───────────────────────────

export const teacherCards = [
  { id: 'classes', label: M('Classes', 'తరగతులు', 'कक्षाएँ', 'வகுப்புகள்', 'ತರಗತಿಗಳು'), value: 6, icon: 'school', trend: '+2', trendUp: true },
  { id: 'students', label: M('Students', 'విద్యార్థులు', 'छात्र', 'மாணவர்கள்', 'ವಿದ್ಯಾರ್ಥಿಗಳು'), value: 184, icon: 'users', trend: '+12', trendUp: true },
  { id: 'assessments', label: M('Assessments', 'మూల్యాంకనాలు', 'मूल्यांकन', 'மதிப்பீடுகள்', 'ಮೌಲ್ಯಮಾಪನಗಳು'), value: 24, icon: 'clipboard', trend: '+5', trendUp: true },
  { id: 'gaps', label: M('Learning Gaps', 'అభ్యాస అంతరాలు', 'सीखने के अंतराल', 'கற்றல் இடைவெளிகள்', 'ಕಲಕ ಅಂತರಗಳು'), value: 3, icon: 'alert', trend: '-1', trendUp: false },
  { id: 'improvement', label: M('Improvement %', 'మెరుగుదల %', 'सुधार %', 'மேம்பாடு %', 'ಸುಧಾರಣೆ %'), value: 48, icon: 'trending', trend: '+48%', trendUp: true, suffix: '%' },
];

export const aiInsights = [
  { label: M('Most Difficult Concept', 'అత్యంత కష్టమైన భావన', 'सबसे कठिन अवधारणा', 'கடினமான கருத்து', 'ಕಷ್ಟದ ಪರಿಕಲ್ಪನೆ'), value: M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'), icon: 'alert', tone: 'warning' },
  { label: M('Most Improved Concept', 'అత్యధిక మెరుగుదల భావన', 'सबसे सुधरी अवधारणा', 'அதிக மேம்பாடு கருத்து', 'ಹೆಚ್ಚು ಸುಧಾರಿಸಿದ ಪರಿಕಲ್ಪನೆ'), value: M('Adding Fractions (+48%)', 'భిన్నాల సంకలనం (+48%)', 'भिन्न जोड़ना (+48%)', 'பின்னங்களைச் சேர்த்தல் (+48%)', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ (+48%)'), icon: 'trending', tone: 'success' },
  { label: M('Suggested Intervention', 'సూచించబడిన జోక్యం', 'सुझाई गई हस्तक्षेप', 'பரிந்துரைக்கப்பட்ட தலையீடு', 'ಸೂಚಿಸಲಾದ ಹಸ್ತಕ್ಷೇಪ'), value: M('Visual fraction strips activity', 'దృశ్య భిన్నం పట్టీల కార్యకలాపం', 'दृश्य भिन्न पट्टी गतिविधि', 'காட்சி பின்ன பட்டை செயல்பாடு', 'ದೃಶ್ಯ ಭಿನ್ನಾಂಶ ಪಟ್ಟಿ ಚಟುವಟಿಕೆ'), icon: 'lightbulb', tone: 'primary' },
];

export const lessonAnalytics = [
  { month: 'Jul', lessons: 8, assessments: 6, reteaching: 2 },
  { month: 'Aug', lessons: 12, assessments: 10, reteaching: 4 },
  { month: 'Sep', lessons: 14, assessments: 12, reteaching: 5 },
  { month: 'Oct', lessons: 16, assessments: 14, reteaching: 3 },
  { month: 'Nov', lessons: 18, assessments: 16, reteaching: 6 },
  { month: 'Dec', lessons: 22, assessments: 20, reteaching: 4 },
];

// ─── Admin ─────────────────────────────────────────────────────────

export const adminData = {
  schools: 12,
  teachers: 48,
  classes: 96,
  students: 2840,
  aiUsage: [
    { name: M('Concept Extraction', 'భావన సంగ్రహణ', 'अवधारणा निष्कर्षण', 'கருத்து பிரித்தல்', 'ಪರಿಕಲ್ಪನೆ ಹೊರತೆಗೆಯುವಿಕೆ'), calls: 1240 },
    { name: M('Assessment Gen', 'మూల్యాంకన ఉత్పత్తి', 'मूल्यांकन जनरेशन', 'மதிப்பீடு உருவாக்கம்', 'ಮೌಲ್ಯಮಾಪನ ರಚನೆ'), calls: 980 },
    { name: M('Gap Detection', 'అంతరం గుర్తింపు', 'अंतराल पहचान', 'இடைவெளி கண்டறிதல்', 'ಅಂತರ ಪತ್ತೆ'), calls: 620 },
    { name: M('Summary Gen', 'సారాంశ ఉత్పత్తి', 'सारांश जनरेशन', 'சுருக்க உருவாக்கம்', 'ಸಾರಾಂಶ ರಚನೆ'), calls: 840 },
    { name: M('Recommendations', 'సిఫార్సులు', 'सुझाव', 'பரிந்துரைகள்', 'ಶಿಫಾರಸುಗಳು'), calls: 510 },
  ],
};

// ─── Student Dashboard Data ────────────────────────────────────────

export const studentData = {
  name: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'),
  lessons: [
    { id: 's1', title: M('Understanding Fractions', 'భిన్నాలను అర్థం చేసుకోవడం', 'भिन्न को समझना', 'பின்னங்களைப் புரிந்துகொள்ளுதல்', 'ಭಿನ್ನಾಂಶಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು'), date: 'Aug 22', mastered: 3, total: 4 },
    { id: 's2', title: M('Introduction to Decimals', 'దశాంశాల పరిచయం', 'दशमलव परिचय', 'தசமங்கள் அறிமுகம்', 'ದಶಮಾಂಶಗಳ ಪರಿಚಯ'), date: 'Aug 20', mastered: 4, total: 4 },
    { id: 's3', title: M('Plant Biology', 'మొక్కల జీవశాస్త్రం', 'पादप जीव विज्ञान', 'தாவர உயிரியல்', 'ಸಸ್ಯ ಜೀವಶಾಸ್ತ್ರ'), date: 'Aug 18', mastered: 2, total: 5 },
  ],
  quizScores: [
    { quiz: 'Q1', score: 72 },
    { quiz: 'Q2', score: 65 },
    { quiz: 'Q3', score: 80 },
    { quiz: 'Q4', score: 84 },
    { quiz: 'Q5', score: 88 },
  ],
  conceptsMastered: 14,
  conceptsTotal: 18,
  weakTopics: [
    M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'),
    M('Photosynthesis', 'కిరణజన్య సంశ్లేషణ', 'प्रकाश संश्लेषण', 'ஒளிச்சேர்க்கை', 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ'),
    M('Long Division', 'దీర్ఘ విభజన', 'लंबा भाग', 'நீண்ட வகுத்தல்', 'ಉದ್ದ ವಿಭಾಗ'),
  ],
};

// ─── Urban Engagement (kept) ───────────────────────────────────────

export const urbanEngagement = [
  { name: M('Focus Trend', 'ఏకాగ్రత ధోరణి', 'एकाग्रता रुझान', 'கவன ஒருமுகப்படுதல் போக்கு', 'ಏಕಾಗ್ರತೆ ಪ್ರವೃತ್ತಿ'), value: 82, level: 'High' as const, trend: [60, 65, 70, 72, 78, 82] },
  { name: M('Participation Trend', 'పాల్గొనడం ధోరణి', 'भागीदारी रुझान', 'பங்கேற்பு போக்கு', 'ಭಾಗವಹಿಸುವಿಕೆ ಪ್ರವೃತ್ತಿ'), value: 74, level: 'Medium' as const, trend: [55, 58, 60, 65, 70, 74] },
  { name: M('Response Activity', 'ప్రతిస్పందన కార్యకలాపం', 'प्रतिक्रिया गतिविधि', 'பதில் செயல்பாடு', 'ಪ್ರತಿಕ್ರಿಯೆ ಚಟುವಟಿಕೆ'), value: 68, level: 'Medium' as const, trend: [50, 52, 58, 60, 64, 68] },
  { name: M('Question Engagement', 'ప్రశ్న నిమగ్నత', 'प्रश्न जुड़ाव', 'கேள்வி ஈடுபாடு', 'ಪ್ರಶ್ನೆ ನಿರತತೆ'), value: 45, level: 'Low' as const, trend: [40, 38, 42, 44, 43, 45] },
];

// ─── AI Quiz Generator Extended Data ───────────────────────────────

export const quizAnalytics = {
  attempted: 36,
  total: 40,
  averageScore: 76,
  highestScore: 96,
  lowestScore: 42,
  passPercentage: 85,
  scoreDistribution: [
    { range: '0-20', count: 1 },
    { range: '21-40', count: 2 },
    { range: '41-60', count: 5 },
    { range: '61-80', count: 14 },
    { range: '81-100', count: 14 },
  ],
  weeklyAttempts: [
    { week: 'W1', attempts: 28 },
    { week: 'W2', attempts: 32 },
    { week: 'W3', attempts: 35 },
    { week: 'W4', attempts: 36 },
  ],
};

export const quizSubjects = [
  M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'),
  M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ'),
  M('English', 'ఇంగ్లీష్', 'अंग्रेज़ी', 'ஆங்கிலம்', 'ಇಂಗ್ಲಿಷ್'),
  M('Social Studies', 'సాంఘిక శాస్త్రం', 'सामाजिक विज्ञान', 'சமூக அறிவியல்', 'ಸಮಾಜ ವಿಜ್ಞಾನ'),
  M('Computer Science', 'కంప్యూటర్ సైన్స్', 'कंप्यूटर विज्ञान', 'கணினி அறிவியல்', 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ'),
];

export const quizChapters = [
  M('Chapter 1: Fractions', 'అధ్యాయం 1: భిన్నాలు', 'अध्याय 1: भिन्न', 'அத்தியாயம் 1: பின்னங்கள்', 'ಅಧ್ಯಾಯ 1: ಭಿನ್ನಾಂಶಗಳು'),
  M('Chapter 2: Decimals', 'అధ్యాయం 2: దశాంశాలు', 'अध्याय 2: दशमलव', 'அத்தியாயம் 2: தசமங்கள்', 'ಅಧ್ಯಾಯ 2: ದಶಮಾಂಶಗಳು'),
  M('Chapter 3: Geometry', 'అధ్యాయం 3: జ్యామితి', 'अध्याय 3: ज्यामिति', 'அத்தியாயம் 3: வடிவியல்', 'ಅಧ್ಯಾಯ 3: ರೇಖಾಗಣಿತ'),
  M('Chapter 4: Photosynthesis', 'అధ్యాయం 4: కిరణజన్య సంశ్లేషణ', 'अध्याय 4: प्रकाश संश्लेषण', 'அத்தியாயம் 4: ஒளிச்சேர்க்கை', 'ಅಧ್ಯಾಯ 4: ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ'),
];

export const quizTopics = [
  M('Adding Fractions', 'భిన్నాల సంకలనం', 'भिन्न जोड़ना', 'பின்னங்களைச் சேர்த்தல்', 'ಭಿನ್ನಾಂಶಗಳ ಸಂಕಲನ'),
  M('Equivalent Fractions', 'సమాన భిన్నాలు', 'समान भिन्न', 'சமான பின்னங்கள்', 'ಸಮಾನ ಭಿನ್ನಾಂಶಗಳು'),
  M('Comparing Fractions', 'భిన్నాల సరామర్మీ', 'भिन्न तुलना', 'பின்னங்களை ஒப்பிடுதல்', 'ಭಿನ್ನಾಂಶಗಳ ಹೋಲಿಕೆ'),
  M('Decimal Conversions', 'దశాంశ మార్పిడులు', 'दशमलव रूपांतरण', 'தசம மாற்றங்கள்', 'ದಶಮಾಂಶ ಪರಿವರ್ತನೆಗಳು'),
];

// ─── Parent Dashboard Extended Data ─────────────────────────────────

export const parentStudentDetails = {
  name: M('Arjun', 'అర్జున్', 'अर्जुन', 'அர்ஜுன்', 'ಅರ್ಜುನ್'),
  rollNumber: '8A-024',
  class: '8th Standard',
  section: 'A',
  attendance: 90,
  performance: 88,
  rank: 3,
  avatar: '',
};

export const parentSubjectPerformance = [
  { subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'), score: 92, grade: 'A' },
  { subject: M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ'), score: 88, grade: 'A' },
  { subject: M('English', 'ఇంగ్లీష్', 'अंग्रेज़ी', 'ஆங்கிலம்', 'ಇಂಗ್ಲಿಷ್'), score: 85, grade: 'B+' },
  { subject: M('Social Studies', 'సాంఘిక శాస్త్రం', 'सामाजिक विज्ञान', 'சமூக அறிவியல்', 'ಸಮಾಜ ವಿಜ್ಞಾನ'), score: 90, grade: 'A' },
  { subject: M('Computer Science', 'కంప్యూటర్ సైన్స్', 'कंप्यूटर विज्ञान', 'கணினி அறிவியல்', 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ'), score: 95, grade: 'A+' },
];

export const parentExamResults = [
  { exam: 'Unit Test 1', date: 'Jul 15, 2026', marks: '88/100', grade: 'A', percentage: 88, status: 'Pass' },
  { exam: 'Mid Term', date: 'Aug 05, 2026', marks: '92/100', grade: 'A+', percentage: 92, status: 'Pass' },
  { exam: 'Unit Test 2', date: 'Sep 10, 2026', marks: '85/100', grade: 'B+', percentage: 85, status: 'Pass' },
  { exam: 'Quiz Competition', date: 'Sep 20, 2026', marks: '78/100', grade: 'B+', percentage: 78, status: 'Pass' },
];

export const parentOverall = {
  averagePercentage: 88,
  classRank: 3,
  attendance: 90,
  engagementScore: 84,
  participationScore: 76,
  progressTrend: [
    { month: 'Apr', score: 72 },
    { month: 'May', score: 76 },
    { month: 'Jun', score: 80 },
    { month: 'Jul', score: 83 },
    { month: 'Aug', score: 87 },
    { month: 'Sep', score: 88 },
  ],
};

export const parentComplaints = [
  { id: 'c1', title: M('Incomplete Homework', 'పూర్తి కాని హోంవర్క్', 'अधूरा गृहकार्य', 'முடிக்கப்படாத வீட்டுப்பாடம்', 'ಅಪೂರ್ಣ ಮನೆಕೆಲಸ'), desc: M('Arjun has not submitted homework for 3 consecutive days.', 'అర్జున్ 3 రోజులుగా హోంవర్క్ సమర్పించలేదు.', 'अर्जुन ने 3 दिन से गृहकार्य नहीं दिया।', 'அர்ஜுன் 3 நாட்களாக வீட்டுப்பாடம் சமர்ப்பிக்கவில்லை.', 'ಅರ್ಜುನ್ 3 ದಿನಗಳಿಂದ ಮನೆಕೆಲಸ ಸಲ್ಲಿಸಿಲ್ಲ.'), date: 'Aug 20, 2026', teacher: M('Lakshmi', 'లక్ష్మి', 'लक्ष्मी', 'லக்ஷ்மி', 'ಲಕ್ಷ್ಮಿ'), priority: 'Medium' as const },
  { id: 'c2', title: M('Talking in Class', 'తరగతిలో మాట్లాడటం', 'कक्षा में बात करना', 'வகுப்பில் பேசுதல்', 'ತರಗತಿಯಲ್ಲಿ ಮಾತನಾಡುವುದು'), desc: M('Arjun was talking during the science lecture.', 'అర్జున్ సైన్స్ లెక్చర్ సమయంలో మాట్లాడుతున్నాడు.', 'अर्जुन विज्ञान व्याख्यान के दौरान बात कर रहा था।', 'அர்ஜுன் அறிவியல் விரிவுரையின் போது பேசினார்.', 'ಅರ್ಜುನ್ ವಿಜ್ಞಾನ ಉಪನ್ಯಾಸದ ಸಮಯದಲ್ಲಿ ಮಾತನಾಡುತ್ತಿದ್ದನೆ.'), date: 'Aug 18, 2026', teacher: M('Ramesh', 'రమేష్', 'रमेश', 'ரமேஷ்', 'ರಮೇಶ್'), priority: 'Low' as const },
  { id: 'c3', title: M('Late Arrival', 'ఆలస్యంగా రావడం', 'देर से आना', 'தாமதமாக வருதல்', 'ತಡವಾಗಿ ಬರುವುದು'), desc: M('Arjun arrived 15 minutes late to class.', 'అర్జున్ తరగతికి 15 నిమిషాలు ఆలస్యంగా వచ్చాడు.', 'अर्जुन कक्षा में 15 मिनट देर से आया।', 'அர்ஜுன் வகுப்பிற்கு 15 நிமிடங்கள் தாமதமாக வந்தார்.', 'ಅರ್ಜುನ್ ತರಗತಿಗೆ 15 ನಿಮಿಷಗಳು ತಡವಾಗಿ ಬಂದನು.'), date: 'Aug 15, 2026', teacher: M('Lakshmi', 'లక్ష్మి', 'लक्ष्मी', 'லக்ஷ்மி', 'ಲಕ್ಷ್ಮಿ'), priority: 'High' as const },
];

export const parentAppreciations = [
  { id: 'ap1', title: M('Top Scorer in Math Quiz', 'గణిత క్విజ్‌లో అగ్ర స్కోరర్', 'गणित क्विज़ में टॉप स्कोरर', 'கணித வினாவில் சிறந்த மதிப்பெண்', 'ಗಣಿತ ಕ್ವಿಜ್‌ನಲ್ಲಿ ಅಗ್ರ ಸ್ಕೋರರ್'), desc: M('Arjun scored the highest in the class quiz on fractions.', 'అర్జున్ భిన్నాలపై క్విజ్‌లో అత్యధిక స్కోర్ సాధించాడు.', 'अर्जुन ने भिन्न क्विज़ में सर्वोच्च अंक प्राप्त किए।', 'அர்ஜுன் பின்னங்கள் வினாவில் அதிகபட்ச மதிப்பெண்ணைப் பெற்றார்.', 'ಅರ್ಜುನ್ ಭಿನ್ನಾಂಶಗಳ ಕ್ವಿಜ್‌ನಲ್ಲಿ ಅತ್ಯಧಿಕ ಸ್ಕೋರ್ ಪಡೆದನು.'), date: 'Aug 22, 2026', teacher: M('Lakshmi', 'లక్ష్మి', 'लक्ष्मी', 'லக்ஷ்மி', 'ಲಕ್ಷ್ಮಿ'), type: 'Achievement' as const },
  { id: 'ap2', title: M('Active Participation', 'చురుకైన పాల్గొనడం', 'सक्रिय भागीदारी', 'செயல்படும் பங்கேற்பு', 'ಸಕ್ರಿಯ ಭಾಗವಹಿಸುವಿಕೆ'), desc: M('Arjun actively participates in all class discussions.', 'అర్జున్ అన్ని తరగతి చర్చలలో చురుకుగా పాల్గొంటాడు.', 'अर्जुन सभी कक्षा चर्चाओं में सक्रिय रूप से भाग लेता है।', 'அர்ஜுன் அனைத்து வகுப்பு விவாதங்களிலும் செயல்படும் பங்கேற்பு கொள்கிறார்.', 'ಅರ್ಜುನ್ ಎಲ್ಲಾ ತರಗತಿ ಚರ್ಚೆಗಳಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿ ಭಾಗವಹಿಸುತ್ತಾನೆ.'), date: 'Aug 19, 2026', teacher: M('Ramesh', 'రమేష్', 'रमेश', 'ரமேஷ்', 'ರಮೇಶ್'), type: 'Participation' as const },
  { id: 'ap3', title: M('Certificate of Excellence', 'ఉత్కృష్టత ధృవీకరణ పత్రం', 'उत्कृष्टता प्रमाण पत्र', 'சிறப்புச் சான்றிதழ்', 'ಉತ್ಕೃಷ್ಟತೆ ಪ್ರಮಾಣಪತ್ರ'), desc: M('Awarded for outstanding performance in the first term.', 'మొదటి సెమ్‌లో అద్భుత ప్రదర్శనకు ప్రదానం చేయబడింది.', 'प्रथम सत्र में उत्कृष्ट प्रदर्शन के लिए प्रदान किया गया।', 'முதல் பருவத்தில் சிறப்பான செயல்திறனுக்காக வழங்கப்பட்டது.', 'ಮೊದಲ ಸೆಮ್‌ನಲ್ಲಿ ಅದ್ಭುತ ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಪ್ರದಾನ ಮಾಡಲಾಗಿದೆ.'), date: 'Aug 10, 2026', teacher: M('Saritha', 'సరిత', 'सरिता', 'சரிதா', 'ಸರಿತಾ'), type: 'Award' as const },
];

export const parentMessages = [
  { id: 'm1', from: M('Lakshmi (Math Teacher)', 'లక్ష్మి (గణిత ఉపాధ్యాయురాలు)', 'लक्ष्मी (गणित शिक्षिका)', 'லக்ஷ்மி (கணித ஆசிரியர்)', 'ಲಕ್ಷ್ಮಿ (ಗಣಿತ ಶಿಕ್ಷಕಿ)'), text: M('Arjun is doing great in math. Keep encouraging him at home.', 'అర్జున్ గణితంలో బాగా చేస్తున్నాడు. ఇంట్లో ప్రోత్సహించండి.', 'अर्जुन गणित में अच्छा कर रहा है। घर पर उत्साहित करें।', 'அர்ஜுன் கணிதத்தில் சிறப்பாக செய்கிறார். வீட்டில் ஊக்கப்படுத்துங்கள்.', 'ಅರ್ಜುನ್ ಗಣಿತದಲ್ಲಿ ಉತ್ತಮವಾಗಿ ಮಾಡುತ್ತಿದ್ದಾನೆ. ಮನೆಯಲ್ಲಿ ಪ್ರೋತ್ಸಾಹಿಸಿ.'), date: 'Aug 21, 2026', isReply: true },
  { id: 'm2', from: M('Parent', 'తల్లిదండ్రులు', 'अभिभावक', 'பெற்றோர்', 'ಪೋಷಕ'), text: M('Thank you for the update. We will help him practice more.', 'అప్‌డేట్ కోసం ధన్యవాదాలు. మేము అతనికి మరింత అభ్యాసం చేయడంలో సహాయం చేస్తాము.', 'अपडेट के लिए धन्यवाद। हम उसे और अभ्यास करने में मदद करेंगे।', 'புதுப்பிப்புக்கு நன்றி. நாங்கள் அவருக்கு மேலும் பயிற்சி செய்ய உதவுவோம்.', 'ಅಪ್‌ಡೇಟ್‌ಗಾಗಿ ಧನ್ಯವಾದಗಳು. ನಾವು ಅವನಿಗೆ ಹೆಚ್ಚು ಅಭ್ಯಾಸ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.'), date: 'Aug 21, 2026', isReply: false },
];

// ─── Attendance Dashboard Extended Data ─────────────────────────────

export const attendanceOverview = {
  totalClasses: 120,
  present: 108,
  absent: 12,
  percentage: 90,
};

export const subjectAttendance = [
  { subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'), conducted: 24, present: 22, absent: 2, percentage: 92 },
  { subject: M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ'), conducted: 24, present: 21, absent: 3, percentage: 88 },
  { subject: M('English', 'ఇంగ్లీష్', 'अंग्रेज़ी', 'ஆங்கிலம்', 'ಇಂಗ್ಲಿಷ್'), conducted: 24, present: 23, absent: 1, percentage: 96 },
  { subject: M('Social Studies', 'సాంఘిక శాస్త్రం', 'सामाजिक विज्ञान', 'சமூக அறிவியல்', 'ಸಮಾಜ ವಿಜ್ಞಾನ'), conducted: 24, present: 20, absent: 4, percentage: 83 },
  { subject: M('Computer Science', 'కంప్యూటర్ సైన్స్', 'कंप्यूटर विज्ञान', 'கணினி அறிவியல்', 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ'), conducted: 24, present: 22, absent: 2, percentage: 92 },
];

export const monthlyAttendance = [
  { month: 'Jan', percentage: 88 }, { month: 'Feb', percentage: 92 }, { month: 'Mar', percentage: 85 },
  { month: 'Apr', percentage: 90 }, { month: 'May', percentage: 87 }, { month: 'Jun', percentage: 93 },
  { month: 'Jul', percentage: 89 }, { month: 'Aug', percentage: 91 }, { month: 'Sep', percentage: 86 },
  { month: 'Oct', percentage: 88 }, { month: 'Nov', percentage: 90 }, { month: 'Dec', percentage: 84 },
];

export const attendancePieData = [
  { name: 'Present', value: 108, fill: 'hsl(var(--success))' },
  { name: 'Absent', value: 12, fill: 'hsl(var(--destructive))' },
];

// ─── Student Dashboard Extended Data ────────────────────────────────

export const studentSubjectPerformance = [
  { subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'), score: 92, trend: 'up' },
  { subject: M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ'), score: 88, trend: 'up' },
  { subject: M('English', 'ఇంగ్లీష్', 'अंग्रेज़ी', 'ஆங்கிலம்', 'ಇಂಗ್ಲಿಷ್'), score: 85, trend: 'stable' },
  { subject: M('Social Studies', 'సాంఘిక శాస్త్రం', 'सामाजिक विज्ञान', 'சமூக அறிவியல்', 'ಸಮಾಜ ವಿಜ್ಞಾನ'), score: 90, trend: 'up' },
  { subject: M('Computer Science', 'కంప్యూటర్ సైన్స్', 'कंप्यूटर विज्ञान', 'கணினி அறிவியல்', 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ'), score: 95, trend: 'up' },
];

export const studentAssignments = [
  { id: 'as1', title: M('Fractions Worksheet', 'భిన్నాల వర్క్‌షీట్', 'भिन्न वर्कशीट', 'பின்ன பணித்தாள்', 'ಭಿನ್ನಾಂಶ ವರ್ಕ್‌ಶೀಟ್'), due: 'Aug 25', status: 'pending' as const, subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ') },
  { id: 'as2', title: M('Plant Cell Diagram', 'మొక్క కణ రేఖాచిత్రం', 'पादप कोशिका चित्र', 'தாவர செல் வரைபடம்', 'ಸಸ್ಯ ಕೋಶ ರೇಖಾಚಿತ್ರ'), due: 'Aug 23', status: 'completed' as const, subject: M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ') },
  { id: 'as3', title: M('Essay: My School', 'వ్యాసం: నా పాఠశాల', 'निबंध: मेरा विद्यालय', 'கட்டுரை: என் பள்ளி', 'ಪ್ರಬಂಧ: ನನ್ನ ಶಾಲೆ'), due: 'Aug 28', status: 'pending' as const, subject: M('English', 'ఇంగ్లీష్', 'अंग्रेज़ी', 'ஆங்கிலம்', 'ಇಂಗ್ಲಿಷ್') },
  { id: 'as4', title: M('Programming Exercise', 'ప్రోగ్రామింగ్ వ్యాయామం', 'प्रोग्रामिंग अभ्यास', 'நிரலாக்க பயிற்சி', 'ಪ್ರೋಗ್ರಾಮಿಂಗ್ ವ್ಯಾಯಾಮ'), due: 'Aug 30', status: 'pending' as const, subject: M('Computer Science', 'కంప్యూటర్ సైన్స్', 'कंप्यूटर विज्ञान', 'கணினி அறிவியல்', 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ') },
];

export const studentExamHistory = [
  { exam: 'Unit Test 1', date: 'Jul 15', marks: 88, grade: 'A', percentage: 88 },
  { exam: 'Mid Term', date: 'Aug 05', marks: 92, grade: 'A+', percentage: 92 },
  { exam: 'Unit Test 2', date: 'Sep 10', marks: 85, grade: 'B+', percentage: 85 },
  { exam: 'Quiz Test', date: 'Sep 20', marks: 78, grade: 'B+', percentage: 78 },
];

export const studentTeacherFeedback = [
  { teacher: M('Lakshmi', 'లక్ష్మి', 'लक्ष्मी', 'லக்ஷ்மி', 'ಲಕ್ಷ್ಮಿ'), subject: M('Mathematics', 'గణితం', 'गणित', 'கணிதம்', 'ಗಣಿತ'), feedback: M('Excellent work in fractions. Keep it up!', 'భిన్నాలలో అద్భుత పని. కొనసాగించండి!', 'भिन्न में उत्कृष्ट कार्य। जारी रखें!', 'பின்னங்களில் சிறந்த வேலை. தொடருங்கள்!', 'ಭಿನ್ನಾಂಶಗಳಲ್ಲಿ ಅದ್ಭುತ ಕೆಲಸ. ಮುಂದುವರಿಸಿ!'), date: 'Aug 22' },
  { teacher: M('Ramesh', 'రమేష్', 'रमेश', 'ரமேஷ்', 'ರಮೇಶ್'), subject: M('Science', 'విజ్ఞాన శాస్త్రం', 'विज्ञान', 'அறிவியல்', 'ವಿಜ್ಞಾನ'), feedback: M('Good understanding of photosynthesis. Practice more diagrams.', 'కిరణజన్య సంశ్లేషణపై మంచి అవగాహన. మరిన్ని రేఖాచిత్రాలు అభ్యాసించండి.', 'प्रकाश संश्लेषण की अच्छी समझ। अधिक आरेख अभ्यास करें।', 'ஒளிச்சேர்க்கையில் நல்ல புரிதல். மேலும் வரைபடங்களை பயிற்சி செய்யுங்கள்.', 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಲ್ಲಿ ಉತ್ತಮ ತಿಳುವಳಿಕೆ. ಇನ್ನಷ್ಟು ರೇಖಾಚಿತ್ರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.'), date: 'Aug 20' },
  { teacher: M('Saritha', 'సరిత', 'सरिता', 'சரிதா', 'ಸರಿತಾ'), subject: M('English', 'ఇంగ్లీష్', 'अंग्रेज़ी', 'ஆங்கிலம்', 'ಇಂಗ್ಲಿಷ್'), feedback: M('Improve grammar skills. Read more books.', 'వ్యాకరణ నైపుణ్యాలను మెరుగుపరచండి. మరిన్ని పుస్తకాలు చదవండి.', 'व्याकरण कौशल में सुधार करें। अधिक किताबें पढ़ें।', 'இலக்கண திறன்களை மேம்படுத்துங்கள். மேலும் புத்தகங்கள் படியுங்கள்.', 'ವ್ಯಾಕರಣ ಕೌಶಲಗಳನ್ನು ಸುಧಾರಿಸಿ. ಹೆಚ್ಚು ಪುಸ್ತಕಗಳನ್ನು ಓದಿ.'), date: 'Aug 18' },
];

export const studentPerformanceGraph = [
  { month: 'Apr', score: 72 },
  { month: 'May', score: 76 },
  { month: 'Jun', score: 80 },
  { month: 'Jul', score: 83 },
  { month: 'Aug', score: 87 },
  { month: 'Sep', score: 88 },
];
