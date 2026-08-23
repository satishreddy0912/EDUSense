/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'te' | 'hi' | 'ta' | 'kn';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

type LangText = { en: string; te: string; hi: string; ta: string; kn: string };
type Dict = Record<string, LangText>;

const L = (en: string, te: string, hi: string, ta: string, kn: string): LangText => ({ en, te, hi, ta, kn });

const dict: Dict = {
  // Nav
  'nav.home': L('Home', 'హోమ్', 'होम', 'முகப்பு', 'ಮುಖಪುಟ'),
  'nav.rural': L('Rural Mode', 'గ్రామీణ మోడ్', 'ग्रामीण मोड', 'கிராமப்புற முறை', 'ಗ್ರಾಮೀಣ ಮೋಡ್'),
  'nav.urban': L('Urban Mode', 'పట్టణ మోడ్', 'शहरी मोड', 'நகர்ப்புற முறை', 'ನಗರ ಮೋಡ್'),
  'nav.teacher': L('Teacher', 'ఉపాధ్యాయ', 'शिक्षक', 'ஆசிரியர்', 'ಶಿಕ್ಷಕ'),
  'nav.student': L('Student', 'విద్యార్థి', 'छात्र', 'மாணவர்', 'ವಿದ್ಯಾರ್ಥಿ'),
  'nav.admin': L('Admin', 'నిర్వాహక', 'व्यवस्थापक', 'நிர்வாகம்', 'ನಿರ್ವಾಹಕ'),
  'nav.quiz': L('AI Quiz Gen', 'AI క్విజ్', 'AI क्विज़', 'AI வினா', 'AI ಕ್ವಿಜ್'),
  'nav.parent': L('Parent', 'తల్లిదండ్రులు', 'अभिभावक', 'பெற்றோர்', 'ಪೋಷಕ'),
  'nav.attendance': L('Attendance', 'హాజరు', 'उपस्थिति', 'வருகை', 'ಹಾಜರು'),

  // Intro
  'intro.tagline': L('Helping Teachers Discover Learning Gaps Before Exams', 'పరీక్షల కంటే ముందు ఉపాధ్యాయులు అభ్యాస అంతరాలను కనుగొనడంలో సహాయం', 'परीक्षा से पहले शिक्षकों को सीखने के अंतराल का पता लगाने में मदद', 'தேர்வுக்கு முன் ஆசிரியர்கள் கற்றல் இடைவெளிகளைக் கண்டறிய உதவுதல்', 'ಪರೀಕ್ಷೆಯ ಮೊದಲು ಶಿಕ್ಷಕರು ಕಲಿಕೆ ಅಂತರವನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಹಾಯ'),
  'intro.platform': L('AI Teaching Intelligence Platform', 'AI బోధనా మేధస్సు వేదిక', 'AI शिक्षण बुद्धिमत्ता मंच', 'AI கற்பித்தல் நுண்ணறிவு தளம்', 'AI ಬೋಧನಾ ಬುದ್ಧಿವಂತತೆ ವೇದಿಕೆ'),
  'intro.enter': L('Enter Platform', 'వేదికలోకి ప్రవేశించండి', 'प्लेटफ़ॉर्म में प्रवेश करें', 'தளத்தில் நுழையவும்', 'ವೇದಿಕೆಗೆ ಪ್ರವೇಶಿಸಿ'),

  // Landing
  'landing.title': L('Two Classrooms. One Intelligence.', 'రెండు తరగతి గదులు. ఒక మేధస్సు.', 'दो कक्षाएँ। एक बुद्धिमत्ता।', 'இரண்டு வகுப்பறைகள். ஒரு நுண்ணறிவு.', 'ಎರಡು ತರಗತಿ ಕೋಣೆಗಳು. ಒಂದು ಬುದ್ಧಿವಂತತೆ.'),
  'landing.subtitle': L('Choose your environment to begin.', 'ప్రారంభించడానికి మీ వాతావరణాన్ని ఎంచుకోండి.', 'शुरू करने के लिए अपना वातावरण चुनें।', 'தொடங்க உங்கள் சூழலைத் தேர்ந்தெடுக்கவும்.', 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ವಾತಾವರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ.'),
  'landing.rural.title': L('Rural Education', 'గ్రామీణ విద్య', 'ग्रामीण शिक्षा', 'கிராமப்புற கல்வி', 'ಗ್ರಾಮೀಣ ಶಿಕ್ಷಣ'),
  'landing.rural.desc': L('Works in schools with minimal technology. No smartboards or student smartphones required.', 'కనీస సాంకేతికతతో పనిచేస్తుంది. స్మార్ట్ బోర్డులు లేదా విద్యార్థి ఫోన్‌లు అవసరం లేదు.', 'न्यूनतम तकनीक वाले स्कूलों में काम करता है। स्मार्टबोर्ड या छात्र स्मार्टफोन की आवश्यकता नहीं।', 'குறைந்த தொழில்நுட்பம் கொண்ட பள்ளிகளில் வேலை செய்கிறது.', 'ಕನಿಷ್ಠ ತಂತ್ರಜ್ಞಾನದ ಶಾಲೆಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.'),
  'landing.urban.title': L('Urban Education', 'పట్టణ విద్య', 'शहरी शिक्षा', 'நகர்ப்புற கல்வி', 'ನಗರ ಶಿಕ್ಷಣ'),
  'landing.urban.desc': L('Uses available classroom technology and digital tools with privacy-safe class-level trends.', 'అందుబాటులో ఉన్న తరగతి గది సాంకేతికతను ఉపయోగిస్తుంది.', 'उपलब्ध क्लासरूम तकनीक और डिजिटल उपकरणों का उपयोग करता है।', 'கிடைக்கும் வகுப்பறை தொழில்நுட்பத்தைப் பயன்படுத்துகிறது.', 'ಲಭ್ಯವಿರುವ ತರಗತಿ ಕೋಣೆ ತಂತ್ರಜ್ಞಾನವನ್ನು ಬಳಸುತ್ತದೆ.'),
  'landing.enterRural': L('Enter Rural Mode', 'గ్రామీణ మోడ్‌లోకి', 'ग्रामीण मोड में प्रवेश करें', 'கிராமப்புற முறைக்குள்', 'ಗ್ರಾಮೀಣ ಮೋಡ್‌ಗೆ'),
  'landing.enterUrban': L('Enter Urban Mode', 'పట్టణ మోడ్‌లోకి', 'शहरी मोड में प्रवेश करें', 'நகர்ப்புற முறைக்குள்', 'ನಗರ ಮೋಡ್‌ಗೆ'),
  'landing.demo.label': L('Live Demo Workflow', 'ప్రత్యక్ష ప్రదర్శన', 'लाइव डेमो वर्कफ़्लो', 'நேரடி டெமோ', 'ನೇರ ಪ್ರದರ್ಶನ'),

  // Common
  'common.continue': L('Continue', 'కొనసాగించు', 'जारी रखें', 'தொடரவும்', 'ಮುಂದುವರಿಸಿ'),
  'common.back': L('Back', 'వెనుకకు', 'वापस', 'பின்செல்', 'ಹಿಂದೆ'),
  'common.next': L('Next Step', 'తదుపరి దశ', 'अगला कदम', 'அடுத்த படி', 'ಮುಂದಿನ ಹಂತ'),
  'common.save': L('Save', 'భద్రపరుచు', 'सहेजें', 'சேமி', 'ಉಳಿಸಿ'),
  'common.close': L('Close', 'మూసివేయి', 'बंद करें', 'மூடு', 'ಮುಚ್ಚಿ'),
  'common.generate': L('Generate', 'ఉత్పత్తి చేయి', 'उत्पन्न करें', 'உருவாக்கு', 'ರಚಿಸಿ'),
  'common.download': L('Download PDF', 'PDF డౌన్‌లోడ్', 'PDF डाउनलोड', 'PDF பதிவிறக்க', 'PDF ಡೌನ್‌ಲೋಡ್'),
  'common.upload': L('Upload', 'అప్‌లోడ్', 'अपलोड', 'பதிவேற்று', 'ಅಪ್‌ಲೋಡ್'),
  'common.analyze': L('Analyze', 'విశ్లేషించు', 'विश्लेषण करें', 'பகுப்பாய்வு', 'ವಿಶ್ಲೇಷಿಸಿ'),
};

type LangArray = { en: string[]; te: string[]; hi: string[]; ta: string[]; kn: string[] };

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  tr: (texts: Partial<LangText> | string, fallback?: string) => string;
  trA: (texts: Partial<LangArray>) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const t = (key: string) => dict[key]?.[lang] ?? key;
  const tr = (texts: Partial<LangText> | string, fallback?: string) =>
    typeof texts === 'string' ? texts : texts[lang] ?? texts.en ?? fallback ?? '';
  const trA = (texts: Partial<LangArray>): string[] => texts[lang] ?? texts.en ?? [];
  return (
    <I18nContext.Provider value={{ lang, setLang, t, tr, trA }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
