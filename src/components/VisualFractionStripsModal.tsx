import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Printer,
  Share2,
  Plus,
  Minus,
  X,
  BookOpen,
  Layers,
  Award,
  Lightbulb,
  Check,
  ChevronRight,
  Info,
  Sliders,
  HelpCircle,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n';

/* =========================================================
   TYPES & CONSTANTS
========================================================= */

export type FractionDenominator = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

interface StripConfig {
  denominator: FractionDenominator;
  label: string;
  color: string;
  border: string;
  bgLight: string;
  textCol: string;
  glow: string;
}

const STRIP_CONFIGS: Record<FractionDenominator, StripConfig> = {
  1: {
    denominator: 1,
    label: '1 Whole',
    color: 'from-red-500 to-rose-600',
    border: 'border-red-500/40',
    bgLight: 'bg-red-500/15',
    textCol: 'text-red-400',
    glow: 'rgba(239, 68, 68, 0.25)',
  },
  2: {
    denominator: 2,
    label: '1/2 Halves',
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/40',
    bgLight: 'bg-amber-500/15',
    textCol: 'text-amber-400',
    glow: 'rgba(245, 158, 11, 0.25)',
  },
  3: {
    denominator: 3,
    label: '1/3 Thirds',
    color: 'from-yellow-500 to-amber-600',
    border: 'border-yellow-500/40',
    bgLight: 'bg-yellow-500/15',
    textCol: 'text-yellow-400',
    glow: 'rgba(234, 179, 8, 0.25)',
  },
  4: {
    denominator: 4,
    label: '1/4 Fourths',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/40',
    bgLight: 'bg-emerald-500/15',
    textCol: 'text-emerald-400',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  5: {
    denominator: 5,
    label: '1/5 Fifths',
    color: 'from-cyan-500 to-teal-600',
    border: 'border-cyan-500/40',
    bgLight: 'bg-cyan-500/15',
    textCol: 'text-cyan-400',
    glow: 'rgba(6, 182, 212, 0.25)',
  },
  6: {
    denominator: 6,
    label: '1/6 Sixths',
    color: 'from-blue-500 to-indigo-600',
    border: 'border-blue-500/40',
    bgLight: 'bg-blue-500/15',
    textCol: 'text-blue-400',
    glow: 'rgba(59, 130, 246, 0.25)',
  },
  8: {
    denominator: 8,
    label: '1/8 Eighths',
    color: 'from-purple-500 to-violet-600',
    border: 'border-purple-500/40',
    bgLight: 'bg-purple-500/15',
    textCol: 'text-purple-400',
    glow: 'rgba(168, 85, 247, 0.25)',
  },
  10: {
    denominator: 10,
    label: '1/10 Tenths',
    color: 'from-pink-500 to-rose-600',
    border: 'border-pink-500/40',
    bgLight: 'bg-pink-500/15',
    textCol: 'text-pink-400',
    glow: 'rgba(236, 72, 153, 0.25)',
  },
  12: {
    denominator: 12,
    label: '1/12 Twelfths',
    color: 'from-fuchsia-500 to-purple-600',
    border: 'border-fuchsia-500/40',
    bgLight: 'bg-fuchsia-500/15',
    textCol: 'text-fuchsia-400',
    glow: 'rgba(217, 70, 239, 0.25)',
  },
};

const AVAILABLE_DENOMINATORS: FractionDenominator[] = [1, 2, 3, 4, 5, 6, 8, 10, 12];

interface ActiveStrip {
  id: string;
  denominator: FractionDenominator;
  shadedCount: number;
}

interface Challenge {
  id: number;
  question: { en: string; te: string; hi: string; ta: string; kn: string };
  targetValue: number;
  targetFractionText: string;
  hint: { en: string; te: string; hi: string; ta: string; kn: string };
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    question: {
      en: 'Show that 1/4 + 1/4 equals 1/2 using fraction strips.',
      te: 'భిన్నం పట్టీలను ఉపయోగించి 1/4 + 1/4 = 1/2 అని చూపించండి.',
      hi: 'भिन्न पट्टियों का उपयोग करके दिखाएं कि 1/4 + 1/4 = 1/2 होता है।',
      ta: 'பின்ன பட்டைகளைப் பயன்படுத்தி 1/4 + 1/4 = 1/2 என்பதைக் காட்டுங்கள்.',
      kn: 'ಭಿನ್ನಾಂಶ ಪಟ್ಟಿಗಳನ್ನು ಬಳಸಿ 1/4 + 1/4 = 1/2 ಎಂದು ತೋರಿಸಿ.',
    },
    targetValue: 0.5,
    targetFractionText: '2/4 = 1/2',
    hint: {
      en: 'Add a 1/2 strip and a 1/4 strip. Shade 2 parts of the fourths strip!',
      te: '1/2 పట్టీ మరియు 1/4 పట్టీని జోడించండి. 1/4 పట్టీలో 2 భాగాలను షేడ్ చేయండి!',
      hi: '1/2 पट्टी और 1/4 पट्टी जोड़ें। 1/4 पट्टी के 2 भागों को छायांकित करें!',
      ta: '1/2 மற்றும் 1/4 பட்டையைச் சேர்க்கவும். 2 பகுதிகளை நிழலிடவும்!',
      kn: '1/2 ಮತ್ತು 1/4 ಪಟ್ಟಿ ಸೇರಿಸಿ. 2 ಭಾಗಗಳನ್ನು ಶೇಡ್ ಮಾಡಿ!',
    },
  },
  {
    id: 2,
    question: {
      en: 'Find how many 1/6 pieces are needed to equal 1/2.',
      te: '1/2 కి సమానం కావడానికి ఎన్ని 1/6 భాగాలు అవసరమో కనుగొనండి.',
      hi: '1/2 के बराबर होने के लिए कितने 1/6 टुकड़ों की आवश्यकता है?',
      ta: '1/2 க்கு சமமாக எத்தனை 1/6 துண்டுகள் தேவை?',
      kn: '1/2 ಕ್ಕೆ ಸಮನಾಗಲು ಎಷ್ಟು 1/6 ತುಣುಕುಗಳು ಬೇಕು?',
    },
    targetValue: 0.5,
    targetFractionText: '3/6 = 1/2',
    hint: {
      en: 'Add a 1/6 strip and shade 3 parts (3/6). Notice how it aligns exactly with 1/2!',
      te: '1/6 పట్టీని జోడించి 3 భాగాలను షేడ్ చేయండి (3/6). ఇది 1/2 తో సరిగ్గా సరిపోలుతుంది!',
      hi: '1/6 पट्टी जोड़ें और 3 भागों को छायांकित करें। यह 1/2 के बिल्कुल बराबर है!',
      ta: '1/6 பட்டையைச் சேர்த்து 3 பகுதிகளை நிழலிடவும் (3/6).',
      kn: '1/6 ಪಟ್ಟಿ ಸೇರಿಸಿ 3 ಭಾಗಗಳನ್ನು ಶೇಡ್ ಮಾಡಿ (3/6).',
    },
  },
  {
    id: 3,
    question: {
      en: 'Solve the unlike fraction sum: 1/3 + 1/6 using common 1/6 strips.',
      te: 'సాధారణ 1/6 పట్టీలను ఉపయోగించి 1/3 + 1/6 కూడికను పరిష్కరించండి.',
      hi: 'समान 1/6 पट्टियों का उपयोग करके 1/3 + 1/6 का योग हल करें।',
      ta: '1/3 + 1/6 கூட்டலை 1/6 பட்டைகளைப் பயன்படுத்தித் தீர்க்கவும்.',
      kn: '1/3 + 1/6 ಸಂಕಲನವನ್ನು 1/6 ಪಟ್ಟಿಗಳನ್ನು ಬಳಸಿ ಪರಿಹರಿಸಿ.',
    },
    targetValue: 0.5,
    targetFractionText: '1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2',
    hint: {
      en: 'Convert 1/3 into 2/6. Then 2/6 + 1/6 = 3/6 = 1/2!',
      te: '1/3 ని 2/6 గా మార్చండి. అప్పుడు 2/6 + 1/6 = 3/6 = 1/2!',
      hi: '1/3 को 2/6 में बदलें। फिर 2/6 + 1/6 = 3/6 = 1/2!',
      ta: '1/3 ஐ 2/6 ஆக மாற்றவும். பிறகு 2/6 + 1/6 = 3/6 = 1/2!',
      kn: '1/3 ಅನ್ನು 2/6 ಗೆ ಪರಿವರ್ತಿಸಿ. ನಂತರ 2/6 + 1/6 = 3/6 = 1/2!',
    },
  },
  {
    id: 4,
    question: {
      en: 'Build 3/4 and find its equivalent in eighths (1/8 strips).',
      te: '3/4 ని నిర్మించి, 1/8 పట్టీలలో దానికి సమానమైన భిన్నాన్ని కనుగొనండి.',
      hi: '3/4 बनाएं और 1/8 पट्टियों में इसका समतुल्य खोजें।',
      ta: '3/4 ஐ உருவாக்கி 1/8 பட்டைகளில் அதன் சமமான மதிப்பைக் கண்டறியவும்.',
      kn: '3/4 ರಚಿಸಿ ಮತ್ತು 1/8 ಪಟ್ಟಿಗಳಲ್ಲಿ ಅದರ ಸಮಾನ ಮೌಲ್ಯವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.',
    },
    targetValue: 0.75,
    targetFractionText: '3/4 = 6/8',
    hint: {
      en: 'Shade 3 parts of 1/4 strip, then shade 6 parts of 1/8 strip to match!',
      te: '1/4 పట్టీలో 3 భాగాలు, 1/8 పట్టీలో 6 భాగాలను షేడ్ చేయండి!',
      hi: '1/4 पट्टी के 3 भाग और 1/8 पट्टी के 6 भाग छायांकित करें!',
      ta: '1/4 பட்டையில் 3 பாகங்கள் மற்றும் 1/8 பட்டையில் 6 பாகங்களை நிழலிடவும்!',
      kn: '1/4 ಪಟ್ಟಿಯಲ್ಲಿ 3 ಭಾಗಗಳು ಮತ್ತು 1/8 ಪಟ್ಟಿಯಲ್ಲಿ 6 ಭಾಗಗಳನ್ನು ಶೇಡ್ ಮಾಡಿ!',
    },
  },
];

/* =========================================================
   COMPONENT PROPS
========================================================= */

interface VisualFractionStripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignToStudents?: (activityTitle: string) => void;
}

export default function VisualFractionStripsModal({
  isOpen,
  onClose,
  onAssignToStudents,
}: VisualFractionStripsModalProps) {
  const { tr } = useI18n();

  const [activeTab, setActiveTab] = useState<'manipulative' | 'addition' | 'challenges'>('manipulative');

  // Active workspace strips
  const [workspaceStrips, setWorkspaceStrips] = useState<ActiveStrip[]>([
    { id: '1-whole', denominator: 1, shadedCount: 1 },
    { id: '2-halves', denominator: 2, shadedCount: 1 },
    { id: '4-fourths', denominator: 4, shadedCount: 2 },
  ]);

  // Addition visualizer state
  const [addFrac1, setAddFrac1] = useState<{ num: number; den: FractionDenominator }>({ num: 1, den: 4 });
  const [addFrac2, setAddFrac2] = useState<{ num: number; den: FractionDenominator }>({ num: 1, den: 4 });

  // Current challenge state
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Helper to add a strip
  const addStrip = (denominator: FractionDenominator) => {
    if (workspaceStrips.length >= 7) return;
    const newStrip: ActiveStrip = {
      id: `${denominator}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      denominator,
      shadedCount: Math.ceil(denominator / 2),
    };
    setWorkspaceStrips((prev) => [...prev, newStrip]);
  };

  // Helper to remove a strip
  const removeStrip = (id: string) => {
    setWorkspaceStrips((prev) => prev.filter((s) => s.id !== id));
  };

  // Helper to toggle a segment in a strip
  const toggleSegment = (stripId: string, segmentIndex: number) => {
    setWorkspaceStrips((prev) =>
      prev.map((strip) => {
        if (strip.id !== stripId) return strip;
        const targetCount = segmentIndex + 1;
        const newCount = strip.shadedCount === targetCount ? targetCount - 1 : targetCount;
        return {
          ...strip,
          shadedCount: Math.max(0, Math.min(strip.denominator, newCount)),
        };
      })
    );
  };

  // Reset workspace
  const resetWorkspace = () => {
    setWorkspaceStrips([
      { id: '1-whole', denominator: 1, shadedCount: 1 },
      { id: '2-halves', denominator: 2, shadedCount: 1 },
      { id: '4-fourths', denominator: 4, shadedCount: 2 },
    ]);
  };

  // Print worksheet
  const handlePrint = () => {
    window.print();
  };

  // Assign to students
  const handleAssign = () => {
    const activityData = {
      id: `act-${Date.now()}`,
      title: 'Visual Fraction Strips Activity',
      subject: 'Mathematics',
      topic: 'Fraction Equivalence & Strip Alignment',
      assignedDate: new Date().toISOString(),
      type: 'Activity',
      status: 'Assigned',
      dueDate: 'Tomorrow',
      teacherName: localStorage.getItem('vidya_auth_name') || 'Dr. Sarah Rao',
      totalMarks: 6,
      questions: [
        {
          id: 'vfs-1',
          type: 'Math Calculation',
          text: 'How many 1/4 fraction strips are equal in length to one 1/2 strip?',
          answer: '2',
          hint: '2/4 equals 1/2.',
          solution: '2 strips of 1/4 = 2/4 = 1/2',
          marks: 2,
          source: 'Fraction Strips Manipulative',
        },
        {
          id: 'vfs-2',
          type: 'Math Calculation',
          text: 'Compute the sum of 1/3 + 1/6 using visual strip alignment.',
          answer: '1/2',
          hint: '1/3 is 2/6. 2/6 + 1/6 = 3/6 = 1/2.',
          solution: '1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2',
          marks: 2,
          source: 'Fraction Strips Manipulative',
        },
        {
          id: 'vfs-3',
          type: 'True/False',
          text: 'Two 1/8 strips are equivalent to one 1/4 strip.',
          answer: 'True',
          hint: '2/8 simplifies to 1/4.',
          solution: 'True: 2/8 = 1/4.',
          marks: 2,
          source: 'Fraction Strips Manipulative',
        },
      ],
    };

    try {
      const existing = localStorage.getItem('vidya_assigned_activities');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(activityData);
      localStorage.setItem('vidya_assigned_activities', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('vidya-activities-updated'));
    } catch {
      // ignore
    }

    setAssignSuccess(true);
    onAssignToStudents?.('Visual Fraction Strips Activity');
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  // Calculate sum for Addition Solver
  const additionMath = useMemo(() => {
    const d1 = addFrac1.den;
    const d2 = addFrac2.den;
    const n1 = addFrac1.num;
    const n2 = addFrac2.num;

    // GCD & LCM
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const commonDenom = (d1 * d2) / gcd(d1, d2);

    const convertedNum1 = n1 * (commonDenom / d1);
    const convertedNum2 = n2 * (commonDenom / d2);
    const sumNum = convertedNum1 + convertedNum2;

    const finalGcd = gcd(sumNum, commonDenom);
    const simplifiedNum = sumNum / finalGcd;
    const simplifiedDen = commonDenom / finalGcd;

    const decimalValue = sumNum / commonDenom;

    return {
      commonDenom,
      convertedNum1,
      convertedNum2,
      sumNum,
      simplifiedNum,
      simplifiedDen,
      decimalValue,
      isLike: d1 === d2,
    };
  }, [addFrac1, addFrac2]);

  // Check current challenge matching
  const currentChallenge = CHALLENGES[currentChallengeIndex];
  const isCurrentChallengeMet = useMemo(() => {
    if (!currentChallenge) return false;
    return workspaceStrips.some((strip) => {
      const fractionVal = strip.shadedCount / strip.denominator;
      return Math.abs(fractionVal - currentChallenge.targetValue) < 0.001;
    });
  }, [workspaceStrips, currentChallenge]);

  const markChallengeComplete = () => {
    setChallengeCompleted((prev) => ({ ...prev, [currentChallenge.id]: true }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-primary/30 bg-[#0c1024]/95 shadow-[0_0_60px_rgba(0,210,255,0.25)] flex flex-col text-foreground"
        >
          {/* TOP HEADER */}
          <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_20px_rgba(0,210,255,0.4)]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-white tracking-wide">
                    Visual Fraction Strips Workspace
                  </h2>
                  <Badge variant="outline" className="border-primary/40 bg-primary/15 text-primary text-[11px] font-semibold uppercase">
                    Interactive Remedial Activity
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hands-on visual manipulatives for fraction understanding, common denominators & addition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-border/60 hover:border-primary/40 text-xs hidden sm:flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Worksheet
              </Button>

              <Button
                size="sm"
                onClick={handleAssign}
                disabled={assignSuccess}
                className={cn(
                  'text-xs font-semibold shadow-md transition-all',
                  assignSuccess
                    ? 'bg-success text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                )}
              >
                {assignSuccess ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Assigned to Students!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-1.5 h-3.5 w-3.5" />
                    Assign to Class
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/20 px-6 py-2">
            <button
              type="button"
              onClick={() => setActiveTab('manipulative')}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                activeTab === 'manipulative'
                  ? 'bg-primary/20 text-primary border border-primary/40 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              <Layers className="h-4 w-4" />
              Interactive Strips Playground
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addition')}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                activeTab === 'addition'
                  ? 'bg-accent/20 text-accent border border-accent/40 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              <Sliders className="h-4 w-4" />
              Addition Step-by-Step Visualizer
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                activeTab === 'challenges'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              <Award className="h-4 w-4" />
              Guided Class Challenges
              {Object.keys(challengeCompleted).length > 0 && (
                <span className="rounded-full bg-amber-500/30 px-1.5 py-0.2 text-[10px] text-amber-300 font-bold">
                  {Object.keys(challengeCompleted).length}/{CHALLENGES.length}
                </span>
              )}
            </button>
          </div>

          {/* WORKSPACE BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: INTERACTIVE MANIPULATIVE PLAYGROUND */}
            {activeTab === 'manipulative' && (
              <div className="space-y-6">
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/10 p-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Add Fraction Strip to Visual Board:
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {AVAILABLE_DENOMINATORS.map((den) => {
                        const cfg = STRIP_CONFIGS[den];
                        return (
                          <button
                            key={den}
                            type="button"
                            onClick={() => addStrip(den)}
                            className={cn(
                              'flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition border shadow-sm',
                              cfg.bgLight,
                              cfg.border,
                              cfg.textCol,
                              'hover:scale-105 active:scale-95'
                            )}
                          >
                            <Plus className="h-3 w-3" />
                            {den === 1 ? '1 Whole' : `1/${den}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetWorkspace}
                      className="border-border/60 text-xs gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset Strips
                    </Button>
                  </div>
                </div>

                {/* VISUAL WORKSPACE STRIPS DISPLAY */}
                <div className="rounded-2xl border border-border/80 bg-black/40 p-6 shadow-inner relative overflow-hidden">
                  {/* Background vertical alignment grid lines */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-12 opacity-10">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="border-r border-dashed border-cyan-300 h-full" />
                    ))}
                  </div>

                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-1 pb-1 border-b border-border/40">
                      <span>Fraction Strip Type & Shaded Fraction</span>
                      <span>Visual Strip Representation (Click segments to shade/unshade)</span>
                      <span>Value</span>
                    </div>

                    {workspaceStrips.map((strip) => {
                      const cfg = STRIP_CONFIGS[strip.denominator];
                      const fractionText =
                        strip.denominator === 1
                          ? `${strip.shadedCount}/1 (${strip.shadedCount === 1 ? '1.0' : '0.0'})`
                          : `${strip.shadedCount}/${strip.denominator} (${((strip.shadedCount / strip.denominator) * 100).toFixed(0)}%)`;

                      return (
                        <motion.div
                          key={strip.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3.5 hover:border-primary/40 transition"
                        >
                          {/* Label & Controls */}
                          <div className="flex items-center justify-between sm:w-44 shrink-0">
                            <div>
                              <span className={cn('text-xs font-bold', cfg.textCol)}>
                                {cfg.label}
                              </span>
                              <div className="text-[11px] font-mono font-semibold text-foreground">
                                {fractionText}
                              </div>
                            </div>
                            {workspaceStrips.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStrip(strip.id)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-muted transition"
                                title="Remove strip"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Interactive Fraction Strip Bar */}
                          <div className="flex-1 flex h-10 overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-inner">
                            {Array.from({ length: strip.denominator }).map((_, segIdx) => {
                              const isShaded = segIdx < strip.shadedCount;
                              return (
                                <button
                                  key={segIdx}
                                  type="button"
                                  onClick={() => toggleSegment(strip.id, segIdx)}
                                  className={cn(
                                    'flex-1 flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 border-r border-background/40 last:border-r-0 select-none relative group',
                                    isShaded
                                      ? cn(
                                          'bg-gradient-to-r text-white shadow-[0_0_12px_rgba(0,0,0,0.3)]',
                                          cfg.color
                                        )
                                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/60'
                                  )}
                                >
                                  <span>{strip.denominator === 1 ? '1' : `1/${strip.denominator}`}</span>
                                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
                                </button>
                              );
                            })}
                          </div>

                          {/* Quick Increment / Decrement Buttons */}
                          <div className="flex items-center gap-1 sm:w-20 justify-end shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setWorkspaceStrips((prev) =>
                                  prev.map((s) =>
                                    s.id === strip.id
                                      ? { ...s, shadedCount: Math.max(0, s.shadedCount - 1) }
                                      : s
                                  )
                                )
                              }
                              className="h-7 w-7 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground text-xs"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setWorkspaceStrips((prev) =>
                                  prev.map((s) =>
                                    s.id === strip.id
                                      ? { ...s, shadedCount: Math.min(s.denominator, s.shadedCount + 1) }
                                      : s
                                  )
                                )
                              }
                              className="h-7 w-7 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground text-xs"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* EQUIVALENCE INSIGHT CARD */}
                <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Visual Equivalence Observation:</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Notice how shaded portions line up directly vertically. When <span className="font-semibold text-emerald-400">2 of 1/4 strips (2/4)</span> are shaded, they take up the exact same length as <span className="font-semibold text-amber-400">1 of 1/2 strip (1/2)</span> and <span className="font-semibold text-blue-400">3 of 1/6 strips (3/6)</span>. This provides students an intuitive geometric proof that <span className="font-mono text-cyan-300 font-bold">1/2 = 2/4 = 3/6 = 4/8</span>!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ADDITION STEP-BY-STEP VISUALIZER */}
            {activeTab === 'addition' && (
              <div className="space-y-6">
                {/* INTERACTIVE FRACTION INPUTS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* FRACTION 1 */}
                  <Card className="glass p-4 border-emerald-500/30">
                    <div className="text-xs font-bold text-emerald-400 mb-2 uppercase flex items-center gap-1.5">
                      <Layers className="h-4 w-4" /> Fraction 1
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          min={1}
                          max={addFrac1.den}
                          value={addFrac1.num}
                          onChange={(e) =>
                            setAddFrac1((prev) => ({
                              ...prev,
                              num: Math.max(1, Math.min(prev.den, parseInt(e.target.value) || 1)),
                            }))
                          }
                          className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-center font-bold text-base"
                        />
                        <div className="h-0.5 w-full bg-foreground my-1" />
                        <select
                          value={addFrac1.den}
                          onChange={(e) => {
                            const newDen = parseInt(e.target.value) as FractionDenominator;
                            setAddFrac1((prev) => ({
                              den: newDen,
                              num: Math.min(prev.num, newDen),
                            }));
                          }}
                          className="w-14 rounded-lg border border-border bg-background px-1 py-1 text-center font-bold text-xs"
                        >
                          {AVAILABLE_DENOMINATORS.filter((d) => d > 1).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {addFrac1.num}/{addFrac1.den}
                        </span>{' '}
                        represents {addFrac1.num} out of {addFrac1.den} equal parts of a whole.
                      </div>
                    </div>
                  </Card>

                  {/* PLUS OPERATOR */}
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 border border-primary/40 text-primary font-bold text-2xl shadow-[0_0_20px_rgba(0,210,255,0.3)]">
                      +
                    </div>
                  </div>

                  {/* FRACTION 2 */}
                  <Card className="glass p-4 border-blue-500/30">
                    <div className="text-xs font-bold text-blue-400 mb-2 uppercase flex items-center gap-1.5">
                      <Layers className="h-4 w-4" /> Fraction 2
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          min={1}
                          max={addFrac2.den}
                          value={addFrac2.num}
                          onChange={(e) =>
                            setAddFrac2((prev) => ({
                              ...prev,
                              num: Math.max(1, Math.min(prev.den, parseInt(e.target.value) || 1)),
                            }))
                          }
                          className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-center font-bold text-base"
                        />
                        <div className="h-0.5 w-full bg-foreground my-1" />
                        <select
                          value={addFrac2.den}
                          onChange={(e) => {
                            const newDen = parseInt(e.target.value) as FractionDenominator;
                            setAddFrac2((prev) => ({
                              den: newDen,
                              num: Math.min(prev.num, newDen),
                            }));
                          }}
                          className="w-14 rounded-lg border border-border bg-background px-1 py-1 text-center font-bold text-xs"
                        >
                          {AVAILABLE_DENOMINATORS.filter((d) => d > 1).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {addFrac2.num}/{addFrac2.den}
                        </span>{' '}
                        represents {addFrac2.num} out of {addFrac2.den} equal parts of a whole.
                      </div>
                    </div>
                  </Card>
                </div>

                {/* STEP-BY-STEP VISUAL SOLVER DEMONSTRATION */}
                <div className="rounded-2xl border border-border/80 bg-black/40 p-6 space-y-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Visual Step-by-Step Solution:
                  </h3>

                  {/* Step 1: Show original strips */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Step 1: Original Fraction Strips
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono text-xs font-bold text-emerald-400">
                          {addFrac1.num}/{addFrac1.den}
                        </span>
                        <div className="flex-1 flex h-8 rounded-lg overflow-hidden border border-border/60 bg-muted/30">
                          {Array.from({ length: addFrac1.den }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                'flex-1 flex items-center justify-center font-mono text-[11px] font-bold border-r border-background/30 last:border-r-0',
                                i < addFrac1.num ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-muted/20 text-muted-foreground'
                              )}
                            >
                              1/{addFrac1.den}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono text-xs font-bold text-blue-400">
                          {addFrac2.num}/{addFrac2.den}
                        </span>
                        <div className="flex-1 flex h-8 rounded-lg overflow-hidden border border-border/60 bg-muted/30">
                          {Array.from({ length: addFrac2.den }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                'flex-1 flex items-center justify-center font-mono text-[11px] font-bold border-r border-background/30 last:border-r-0',
                                i < addFrac2.num ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-muted/20 text-muted-foreground'
                              )}
                            >
                              1/{addFrac2.den}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Common Denominator Conversion (if unlike) */}
                  {!additionMath.isLike && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        Step 2: Subdivide into Common Denominator (LCD = {additionMath.commonDenom})
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-16 font-mono text-xs font-bold text-amber-400">
                            {additionMath.convertedNum1}/{additionMath.commonDenom}
                          </span>
                          <div className="flex-1 flex h-8 rounded-lg overflow-hidden border border-amber-500/40 bg-muted/30">
                            {Array.from({ length: additionMath.commonDenom }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'flex-1 flex items-center justify-center font-mono text-[10px] font-bold border-r border-background/30 last:border-r-0',
                                  i < additionMath.convertedNum1 ? 'bg-amber-500 text-black' : 'bg-muted/20 text-muted-foreground'
                                )}
                              >
                                1/{additionMath.commonDenom}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="w-16 font-mono text-xs font-bold text-amber-400">
                            {additionMath.convertedNum2}/{additionMath.commonDenom}
                          </span>
                          <div className="flex-1 flex h-8 rounded-lg overflow-hidden border border-amber-500/40 bg-muted/30">
                            {Array.from({ length: additionMath.commonDenom }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'flex-1 flex items-center justify-center font-mono text-[10px] font-bold border-r border-background/30 last:border-r-0',
                                  i < additionMath.convertedNum2 ? 'bg-amber-500 text-black' : 'bg-muted/20 text-muted-foreground'
                                )}
                              >
                                1/{additionMath.commonDenom}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Combine Combined Strips */}
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <div className="text-xs font-semibold text-cyan-400">
                      Step {additionMath.isLike ? '2' : '3'}: Combined Sum Strip
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-16 font-mono text-xs font-bold text-cyan-400">
                        {additionMath.sumNum}/{additionMath.commonDenom}
                      </span>
                      <div className="flex-1 flex h-9 rounded-xl overflow-hidden border border-cyan-500/60 bg-muted/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                        {Array.from({ length: additionMath.commonDenom }).map((_, i) => {
                          const isFrac1Part = i < additionMath.convertedNum1;
                          const isFrac2Part = i >= additionMath.convertedNum1 && i < additionMath.sumNum;
                          return (
                            <div
                              key={i}
                              className={cn(
                                'flex-1 flex items-center justify-center font-mono text-[10px] font-bold border-r border-background/40 last:border-r-0',
                                isFrac1Part
                                  ? 'bg-emerald-500 text-white'
                                  : isFrac2Part
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-muted/20 text-muted-foreground'
                              )}
                            >
                              1/{additionMath.commonDenom}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* FINAL ANSWER BANNER */}
                  <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-bold text-lg">
                        =
                      </div>
                      <div>
                        <div className="text-xs font-medium text-cyan-300">Final Mathematical Equation:</div>
                        <div className="font-mono text-lg font-bold text-white">
                          {addFrac1.num}/{addFrac1.den} + {addFrac2.num}/{addFrac2.den} = {additionMath.sumNum}/{additionMath.commonDenom}
                          {additionMath.simplifiedDen !== additionMath.commonDenom && (
                            <span className="text-emerald-400 ml-2">
                              = {additionMath.simplifiedNum}/{additionMath.simplifiedDen}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge className="bg-primary/20 text-primary border-primary/40">
                        Decimal Value: {additionMath.decimalValue.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GUIDED CLASS CHALLENGES */}
            {activeTab === 'challenges' && (
              <div className="space-y-6">
                {/* CHALLENGE PROGRESS HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Class Challenge {currentChallengeIndex + 1} of {CHALLENGES.length}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Use the fraction strips below to solve this visual fraction challenge.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {CHALLENGES.map((ch, idx) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          setCurrentChallengeIndex(idx);
                          setShowHint(false);
                        }}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition border',
                          currentChallengeIndex === idx
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                            : challengeCompleted[ch.id]
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted'
                        )}
                      >
                        {challengeCompleted[ch.id] ? <Check className="h-4 w-4" /> : idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ACTIVE QUESTION CARD */}
                <Card className="glass p-6 border-amber-500/40 bg-amber-500/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="mb-2 bg-amber-500/20 text-amber-300 border-amber-500/40">
                        Problem Statement
                      </Badge>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {tr(currentChallenge.question)}
                      </h3>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="border-amber-500/40 text-amber-300 text-xs shrink-0"
                    >
                      <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                  </div>

                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200"
                    >
                      <span className="font-bold">Hint: </span>
                      {tr(currentChallenge.hint)}
                    </motion.div>
                  )}
                </Card>

                {/* INTERACTIVE WORKSPACE FOR CHALLENGE */}
                <div className="rounded-2xl border border-border/80 bg-black/40 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Adjust your strips on the board to match the target value:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {AVAILABLE_DENOMINATORS.slice(0, 6).map((den) => (
                        <button
                          key={den}
                          type="button"
                          onClick={() => addStrip(den)}
                          className="rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                        >
                          +1/{den}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strip board */}
                  <div className="space-y-3">
                    {workspaceStrips.map((strip) => {
                      const cfg = STRIP_CONFIGS[strip.denominator];
                      return (
                        <div key={strip.id} className="flex items-center gap-3">
                          <span className={cn('w-20 text-xs font-bold', cfg.textCol)}>
                            {strip.shadedCount}/{strip.denominator}
                          </span>
                          <div className="flex-1 flex h-9 rounded-xl overflow-hidden border border-border/80 bg-muted/40">
                            {Array.from({ length: strip.denominator }).map((_, segIdx) => (
                              <button
                                key={segIdx}
                                type="button"
                                onClick={() => toggleSegment(strip.id, segIdx)}
                                className={cn(
                                  'flex-1 flex items-center justify-center font-mono text-xs font-bold border-r border-background/40 last:border-r-0',
                                  segIdx < strip.shadedCount
                                    ? cn('bg-gradient-to-r text-white', cfg.color)
                                    : 'bg-muted/30 text-muted-foreground'
                                )}
                              >
                                1/{strip.denominator}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CHALLENGE VALIDATION STATUS */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40">
                    <div>
                      {isCurrentChallengeMet ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                          Correct! Your fraction strips perfectly match: {currentChallenge.targetFractionText}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Target equivalence: <span className="font-mono text-cyan-300 font-semibold">{currentChallenge.targetFractionText}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrentChallengeMet && (
                        <Button
                          size="sm"
                          onClick={() => {
                            markChallengeComplete();
                            if (currentChallengeIndex < CHALLENGES.length - 1) {
                              setCurrentChallengeIndex(currentChallengeIndex + 1);
                              setShowHint(false);
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                        >
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          {currentChallengeIndex < CHALLENGES.length - 1 ? 'Next Challenge' : 'Complete All Challenges'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex flex-wrap items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-3.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Remedial Mode Active — Connected to Teacher Control Center</span>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                Close Workspace
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
