import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  ClipboardList,
  PencilLine,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Apple,
  PenLine,
  Users,
  Sparkles,
  Brain,
  Library,
  BarChart3,
  GraduationCap,
  Smartphone,
  Laptop,
  Cloud,
  HardDrive,
  FileVideo,
  FileImage,
  FileAudio,
  Presentation,
  FileType,
  Wifi,
  WifiOff,
  Mic,
  Volume2,
  MessageSquare,
  Languages,
  Eye,
  X,
  type LucideIcon,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

import { useI18n } from '@/i18n';

import {
  lessonData,
  lessonLibrary,
  firstScores,
  secondScores,
  reTeachingStrategy,
  gapAnalysisData,
  studentProgress,
  type UploadedLesson,
} from '@/data/mockData';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type LessonFileType = UploadedLesson['fileType'];

type ServerLesson = {
  id: string;
  name: string;
  subject?: string;
  category?: string;
  fileType?: string;
  uploadDate?: string;
  size?: string;
  source?: string;
  summary?: string;
};

type LessonUploadResponse = {
  id: string;
  name: string;
  subject?: string;
  category?: string;
  fileType?: string;
  uploadDate?: string;
  size?: string;
  source?: string;
  summary?: string;
};

type RuralTab =
  | 'workflow'
  | 'library'
  | 'gap'
  | 'progress'
  | 'accessibility';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeFileType = (fileType?: string): LessonFileType => {
  const value = (fileType || '').toLowerCase();

  if (value === 'pdf') {
    return 'pdf';
  }

  if (value === 'ppt' || value === 'pptx') {
    return 'ppt';
  }

  if (value === 'doc' || value === 'docx') {
    return 'doc';
  }

  if (
    value === 'image' ||
    value === 'png' ||
    value === 'jpg' ||
    value === 'jpeg' ||
    value === 'gif' ||
    value === 'webp'
  ) {
    return 'image';
  }

  if (
    value === 'audio' ||
    value === 'mp3' ||
    value === 'wav' ||
    value === 'm4a'
  ) {
    return 'audio';
  }

  if (
    value === 'video' ||
    value === 'mp4' ||
    value === 'webm' ||
    value === 'mov'
  ) {
    return 'video';
  }

  return 'doc';
};

const getFileTypeFromName = (fileName: string): LessonFileType => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') return 'pdf';

  if (extension === 'ppt' || extension === 'pptx') {
    return 'ppt';
  }

  if (extension === 'doc' || extension === 'docx') {
    return 'doc';
  }

  if (
    extension === 'png' ||
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'gif' ||
    extension === 'webp'
  ) {
    return 'image';
  }

  if (
    extension === 'mp3' ||
    extension === 'wav' ||
    extension === 'm4a'
  ) {
    return 'audio';
  }

  if (
    extension === 'mp4' ||
    extension === 'webm' ||
    extension === 'mov'
  ) {
    return 'video';
  }

  return 'doc';
};

const createLocalizedText = (
  value: string
): {
  en: string;
  te: string;
  hi: string;
  ta: string;
  kn: string;
} => ({
  en: value,
  te: value,
  hi: value,
  ta: value,
  kn: value,
});

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const iconMap: Record<string, LucideIcon> = {
  ruler: Ruler,
  apple: Apple,
  pen: PenLine,
  users: Users,
};

const fileTypeIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  ppt: Presentation,
  doc: FileType,
  image: FileImage,
  audio: FileAudio,
  video: FileVideo,
};

const sourceIcons: Record<string, LucideIcon> = {
  Mobile: Smartphone,
  Laptop: Laptop,
  'Google Drive': Cloud,
  'Local Storage': HardDrive,
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const levelColors: Record<string, string> = {
  good: 'text-success bg-success/15 border-success/30',
  moderate: 'text-warning bg-warning/15 border-warning/30',
  attention: 'text-destructive bg-destructive/15 border-destructive/30',
};

const levelLabels: Record<
  string,
  { en: string; te: string; hi: string; ta: string; kn: string }
> = {
  good: {
    en: 'Good',
    te: 'మంచి',
    hi: 'अच्छा',
    ta: 'நல்ல',
    kn: 'ಒಳ್ಳೆಯದು',
  },
  moderate: {
    en: 'Moderate',
    te: 'మధ్యస్థ',
    hi: 'मध्यम',
    ta: 'மிதமான',
    kn: 'ಮಧ್ಯಮ',
  },
  attention: {
    en: 'Needs Attention',
    te: 'శ్రద్ధ అవసరం',
    hi: 'ध्यान दें',
    ta: 'கவனம் தேவை',
    kn: 'ಗಮನ ಬೇಕು',
  },
};

const steps = [
  {
    label: {
      en: 'Upload',
      te: 'అప్‌లోడ్',
      hi: 'अपलोड',
      ta: 'பதிவேற்று',
      kn: 'ಅಪ್‌ಲೋಡ್',
    },
    icon: Upload,
  },
  {
    label: {
      en: 'Assess',
      te: 'మూల్యాంకన',
      hi: 'मूल्यांकन',
      ta: 'மதிப்பீடு',
      kn: 'ಮೌಲ್ಯಮಾಪನ',
    },
    icon: ClipboardList,
  },
  {
    label: {
      en: 'Results',
      te: 'ఫలితాలు',
      hi: 'परिणाम',
      ta: 'முடிவுகள்',
      kn: 'ಫಲಿತಾಂಶಗಳು',
    },
    icon: PencilLine,
  },
  {
    label: {
      en: 'Gap',
      te: 'అంతరం',
      hi: 'अंतराल',
      ta: 'இடைவெளி',
      kn: 'ಅಂತರ',
    },
    icon: AlertTriangle,
  },
  {
    label: {
      en: 'Re-Teach',
      te: 'పునర్బోధన',
      hi: 'पुनः शिक्षण',
      ta: 'மறுபயிற்றி',
      kn: 'ಪುನರ್ಬೋಧನೆ',
    },
    icon: Lightbulb,
  },
  {
    label: {
      en: 'Re-Assess',
      te: 'పునర్ మూల్యాంకన',
      hi: 'पुनः मूल्यांकन',
      ta: 'மறு மதிப்பீடு',
      kn: 'ಪುನರ್ ಮೌಲ್ಯಮಾಪನ',
    },
    icon: CheckCircle2,
  },
  {
    label: {
      en: 'Improve',
      te: 'మెరుగుదల',
      hi: 'सुधार',
      ta: 'மேம்பாடு',
      kn: 'ಸುಧಾರಣೆ',
    },
    icon: TrendingUp,
  },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function RuralMode() {
  const { t, tr, trA } = useI18n();

  const [tab, setTab] = useState<RuralTab>('workflow');
  const [step, setStep] = useState(0);

  const [uploads, setUploads] =
    useState<UploadedLesson[]>(lessonLibrary);

  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<number | null>(null);

  const [selectedSource, setSelectedSource] =
    useState('Laptop');

  const [processing, setProcessing] = useState(false);

  const [selectedLesson, setSelectedLesson] =
    useState<UploadedLesson | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------------ */
  /* Load lessons from backend                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadLessons = async () => {
      try {
        const response = await api.lessons.list();

        const serverLessons =
          response as ServerLesson[];

        if (!mounted || !serverLessons?.length) {
          return;
        }

        const mapped: UploadedLesson[] =
          serverLessons.map((lesson) => {
            const title =
              lesson.name.replace(/\.[^.]+$/, '');

            return {
              id: lesson.id,

              title: createLocalizedText(title),

              subject: createLocalizedText(
                lesson.subject || 'General'
              ),

              category:
                lesson.category || 'General',

              fileType:
                normalizeFileType(
                  lesson.fileType
                ),

              uploadDate:
                lesson.uploadDate ||
                new Date().toLocaleDateString(),

              size:
                lesson.size || 'Unknown',

              source:
                lesson.source || 'Laptop',

              summary: createLocalizedText(
                lesson.summary ||
                  'Teacher-uploaded classroom lesson.'
              ),

              keyPoints: {
                en: [],
                te: [],
                hi: [],
                ta: [],
                kn: [],
              },

              importantQuestions: {
                en: [],
                te: [],
                hi: [],
                ta: [],
                kn: [],
              },

              objectives: {
                en: [],
                te: [],
                hi: [],
                ta: [],
                kn: [],
              },

              concepts: [],
            };
          });

        setUploads((previous) => [
          ...mapped,
          ...previous.filter(
            (item) =>
              !mapped.some(
                (mappedItem) =>
                  mappedItem.id === item.id
              )
          ),
        ]);
      } catch {
        // Keep demo library if backend is unavailable.
      }
    };

    void loadLessons();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Workflow navigation                                                      */
  /* ------------------------------------------------------------------------ */

  const next = () => {
    setStep((current) =>
      Math.min(current + 1, 6)
    );
  };

  const prev = () => {
    setStep((current) =>
      Math.max(current - 1, 0)
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Chart data                                                               */
  /* ------------------------------------------------------------------------ */

  const conceptData = lessonData.concepts.map(
    (concept) => ({
      name: tr(concept.name),
      First: firstScores[concept.id],
      Second: secondScores[concept.id],
    })
  );

  const radarData = lessonData.concepts.map(
    (concept) => ({
      concept: tr(concept.name).split(' ')[0],
      Before: firstScores[concept.id],
      After: secondScores[concept.id],
    })
  );

  const weakest = lessonData.concepts.reduce(
    (minimum, concept) =>
      firstScores[concept.id] <
      firstScores[minimum.id]
        ? concept
        : minimum
  );

  const improvement =
    secondScores[weakest.id] -
    firstScores[weakest.id];

  /* ------------------------------------------------------------------------ */
  /* File upload                                                              */
  /* ------------------------------------------------------------------------ */

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];

      setUploadProgress(10);
      setProcessing(true);

      try {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        let binary = '';

        const chunkSize = 0x8000;

        for (
          let index = 0;
          index < bytes.length;
          index += chunkSize
        ) {
          binary += String.fromCharCode(
            ...bytes.subarray(
              index,
              Math.min(
                index + chunkSize,
                bytes.length
              )
            )
          );
        }

        const dataBase64 = btoa(binary);

        setUploadProgress(50);

        const response =
          await api.lessons.upload({
            name: file.name,
            mimeType:
              file.type ||
              'application/octet-stream',
            size: `${(
              file.size /
              1024 /
              1024
            ).toFixed(1)} MB`,
            source: selectedSource,
            subject: 'General',
            category: 'General',
            dataBase64,
          });

        setUploadProgress(80);

        const lesson =
          response as LessonUploadResponse;

        const mapped: UploadedLesson = {
          id: lesson.id,

          title: createLocalizedText(
            lesson.name.replace(
              /\.[^.]+$/,
              ''
            )
          ),

          subject: createLocalizedText(
            lesson.subject || 'General'
          ),

          category:
            lesson.category || 'General',

          fileType:
            normalizeFileType(
              lesson.fileType ||
                getFileTypeFromName(
                  file.name
                )
            ),

          uploadDate:
            lesson.uploadDate ||
            new Date().toLocaleDateString(),

          size:
            lesson.size ||
            `${(
              file.size /
              1024 /
              1024
            ).toFixed(1)} MB`,

          source:
            lesson.source ||
            selectedSource,

          summary: createLocalizedText(
            lesson.summary ||
              'Teacher-uploaded classroom lesson.'
          ),

          keyPoints: {
            en: [],
            te: [],
            hi: [],
            ta: [],
            kn: [],
          },

          importantQuestions: {
            en: [],
            te: [],
            hi: [],
            ta: [],
            kn: [],
          },

          objectives: {
            en: [],
            te: [],
            hi: [],
            ta: [],
            kn: [],
          },

          concepts: [],
        };

        setUploads((previous) => [
          mapped,
          ...previous.filter(
            (item) => item.id !== mapped.id
          ),
        ]);

        setUploadProgress(100);

        toast.success(
          `${file.name} saved to the Lesson Library.`
        );

        /*
         * Clear the input so selecting the same
         * file again will trigger onChange.
         */
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        /*
         * Automatically move the teacher to
         * the Lesson Library after upload.
         */
        setTimeout(() => {
          setTab('library');
        }, 400);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Lesson upload failed. Start the backend and try again.';

        toast.error(message);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setTimeout(() => {
          setUploadProgress(null);
          setProcessing(false);
        }, 500);
      }
    },
    [selectedSource]
  );

  /* ------------------------------------------------------------------------ */
  /* Drag and drop                                                            */
  /* ------------------------------------------------------------------------ */

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      setDragOver(false);

      void handleUpload(
        event.dataTransfer.files
      );
    },
    [handleUpload]
  );

  /* ------------------------------------------------------------------------ */
  /* Upload New                                                               */
  /* ------------------------------------------------------------------------ */

  const handleUploadNew = () => {
    setTab('workflow');
    setStep(0);

    /*
     * Give React time to render the Upload step
     * before opening the native file picker.
     */
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  /* ------------------------------------------------------------------------ */
  /* View lesson                                                              */
  /* ------------------------------------------------------------------------ */

  const handleViewLesson = (
    lesson: UploadedLesson
  ) => {
    setSelectedLesson(lesson);
  };

  /* ------------------------------------------------------------------------ */
  /* Tabs                                                                     */
  /* ------------------------------------------------------------------------ */

  const ruralTabs: {
    id: RuralTab;
    label: {
      en: string;
      te: string;
      hi: string;
      ta: string;
      kn: string;
    };
    icon: LucideIcon;
  }[] = [
    {
      id: 'workflow',
      label: {
        en: 'Teaching Workflow',
        te: 'బోధనా వర్క్‌ఫ్లో',
        hi: 'शिक्षण वर्कफ़्लो',
        ta: 'கற்பித்தல் பணிப்பாய்வு',
        kn: 'ಬೋಧನಾ ಕಾರ್ಯಹರಿವು',
      },
      icon: Sparkles,
    },
    {
      id: 'library',
      label: {
        en: 'Lesson Library',
        te: 'పాఠ లైబ్రరీ',
        hi: 'पाठ पुस्तकालय',
        ta: 'பாட நூலகம்',
        kn: 'ಪಾಠ ಗ್ರಂಥಾಲಯ',
      },
      icon: Library,
    },
    {
      id: 'gap',
      label: {
        en: 'Gap Analysis',
        te: 'అంతర విశ్లేషణ',
        hi: 'अंतराल विश्लेषण',
        ta: 'இடைவெளி பகுப்பாய்வு',
        kn: 'ಅಂತರ ವಿಶ್ಲೇಷಣೆ',
      },
      icon: BarChart3,
    },
    {
      id: 'progress',
      label: {
        en: 'Student Progress',
        te: 'విద్యార్థి పురోగతి',
        hi: 'छात्र प्रगति',
        ta: 'மாணவர் முன்னேற்றம்',
        kn: 'ವಿದ್ಯಾರ್ಥಿ ಪ್ರಗತಿ',
      },
      icon: GraduationCap,
    },
    {
      id: 'accessibility',
      label: {
        en: 'Accessibility',
        te: 'యాక్సెసిబిలిటీ',
        hi: 'सुलभता',
        ta: 'அணுகல்',
        kn: 'ಪ್ರವೇಶ',
      },
      icon: Mic,
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen pb-24">

      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">
            {t('nav.rural')}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {tr(lessonData.title)}
        </h1>

        <p className="text-sm text-muted-foreground">
          {tr(lessonData.summary)}
        </p>
      </div>

      {/* ================================================================== */}
      {/* Tabs                                                               */}
      {/* ================================================================== */}

      <div className="mb-6 flex gap-1.5 overflow-x-auto scrollbar-hide">
        {ruralTabs.map((tabItem) => {
          const Icon = tabItem.icon;
          const active =
            tab === tabItem.id;

          return (
            <button
              key={tabItem.id}
              onClick={() =>
                setTab(tabItem.id)
              }
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'glass text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />

              {tr(tabItem.label)}
            </button>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* Main animated content                                              */}
      {/* ================================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          {/* ============================================================ */}
          {/* TEACHING WORKFLOW                                            */}
          {/* ============================================================ */}

          {tab === 'workflow' && (
            <>
              {/* Stepper */}

              <div className="mb-8 overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max gap-1.5">
                  {steps.map((item, index) => {
                    const Icon = item.icon;

                    const active =
                      index === step;

                    const done =
                      index < step;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setStep(index)
                        }
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                          active
                            ? 'bg-primary text-primary-foreground glow-primary'
                            : done
                              ? 'bg-primary/15 text-primary'
                              : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'
                        )}
                      >
                        <Icon className="h-4 w-4" />

                        <span className="hidden sm:inline">
                          {tr(item.label)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >

                  {/* ================================================== */}
                  {/* STEP 0 - UPLOAD                                      */}
                  {/* ================================================== */}

                  {step === 0 && (
                    <div className="grid gap-6 lg:grid-cols-3">

                      {/* Upload panel */}

                      <Card className="glass p-6 lg:col-span-1">
                        <div className="mb-4 flex items-center gap-2">
                          <Upload className="h-5 w-5 text-primary" />

                          <h3 className="font-semibold">
                            Upload Lesson
                          </h3>
                        </div>

                        {/* Source */}

                        <div className="mb-4 grid grid-cols-2 gap-2">
                          {Object.entries(
                            sourceIcons
                          ).map(
                            ([
                              name,
                              Icon,
                            ]) => (
                              <button
                                key={name}
                                onClick={() =>
                                  setSelectedSource(
                                    name
                                  )
                                }
                                className={cn(
                                  'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition',
                                  selectedSource ===
                                    name
                                    ? 'bg-primary/15 text-primary'
                                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                                )}
                              >
                                <Icon className="h-4 w-4" />

                                {name}
                              </button>
                            )
                          )}
                        </div>

                        {/* Drag & Drop */}

                        <div
                          onDragOver={(
                            event
                          ) => {
                            event.preventDefault();
                            setDragOver(
                              true
                            );
                          }}
                          onDragLeave={() =>
                            setDragOver(
                              false
                            )
                          }
                          onDrop={
                            handleDrop
                          }
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          className={cn(
                            'rounded-xl border-2 border-dashed p-6 text-center transition cursor-pointer',
                            dragOver
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-muted/20 hover:border-primary/50'
                          )}
                        >
                          <input
                            ref={
                              fileInputRef
                            }
                            type="file"
                            className="hidden"
                            accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,.mp3,.wav,.m4a,.mp4,.webm,.mov"
                            onChange={(
                              event
                            ) =>
                              void handleUpload(
                                event.target
                                  .files
                              )
                            }
                          />

                          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                          <p className="text-sm text-muted-foreground">
                            PDF · PPT · DOC · Image · Audio · Video
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Drag & drop or click to browse
                          </p>
                        </div>

                        {/* Progress */}

                        {uploadProgress !==
                          null && (
                          <div className="mt-4">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {processing
                                  ? 'Processing...'
                                  : 'Uploading...'}
                              </span>

                              <span className="font-semibold">
                                {
                                  uploadProgress
                                }
                                %
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                              <motion.div
                                animate={{
                                  width: `${uploadProgress}%`,
                                }}
                                className="h-full rounded-full bg-primary"
                              />
                            </div>
                          </div>
                        )}
                      </Card>

                      {/* AI generated content */}

                      <Card className="glass p-6 lg:col-span-2">
                        <div className="mb-4 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-accent" />

                          <h3 className="font-semibold">
                            AI-Generated Content
                          </h3>

                          <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent">
                            {
                              lessonData
                                .concepts
                                .length
                            }{' '}
                            concepts
                          </span>
                        </div>

                        {/* Key points */}

                        <div className="mb-4">
                          <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                            KEY POINTS
                          </h4>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {trA(
                              lessonData.keyPoints
                            ).map(
                              (
                                point: string,
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 rounded-lg bg-muted/20 p-2.5 text-xs"
                                >
                                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />

                                  {point}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Objectives */}

                        <div className="mb-4">
                          <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                            LEARNING OBJECTIVES
                          </h4>

                          <div className="flex flex-wrap gap-2">
                            {trA(
                              lessonData.objectives
                            ).map(
                              (
                                objective: string,
                                index: number
                              ) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                                >
                                  {
                                    objective
                                  }
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Concepts */}

                        <div>
                          <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                            EXTRACTED CONCEPTS
                          </h4>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {lessonData.concepts.map(
                              (
                                concept,
                                index
                              ) => (
                                <div
                                  key={
                                    concept.id
                                  }
                                  className="rounded-xl border border-border/60 bg-muted/20 p-3 transition hover:border-primary/40"
                                >
                                  <div className="mb-1 flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                                      {index +
                                        1}
                                    </span>

                                    <span className="text-sm font-semibold">
                                      {tr(
                                        concept.name
                                      )}
                                    </span>
                                  </div>

                                  <p className="text-xs text-muted-foreground">
                                    {tr(
                                      concept.description
                                    )}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* ================================================== */}
                  {/* STEP 1 - ASSESSMENT                               */}
                  {/* ================================================== */}

                  {step === 1 && (
                    <Card className="glass p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />

                        <h3 className="font-semibold">
                          AI-Generated Assessment
                        </h3>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {[
                          'Quiz',
                          'Assignment',
                          'Poll',
                          'Oral Assessment',
                        ].map(
                          (type) => (
                            <button
                              key={type}
                              className="rounded-xl bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/15 hover:text-primary"
                            >
                              {type}
                            </button>
                          )
                        )}
                      </div>

                      <div className="space-y-3">
                        {lessonData.importantQuestions &&
                          trA(
                            lessonData.importantQuestions
                          ).map(
                            (
                              question: string,
                              index: number
                            ) => (
                              <div
                                key={index}
                                className="rounded-xl border border-border/60 bg-muted/20 p-4"
                              >
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                                    Q
                                    {index +
                                      1}
                                  </span>

                                  <span className="text-xs text-muted-foreground">
                                    Short Answer
                                  </span>
                                </div>

                                <p className="text-sm font-medium">
                                  {
                                    question
                                  }
                                </p>
                              </div>
                            )
                          )}
                      </div>
                    </Card>
                  )}

                  {/* ================================================== */}
                  {/* STEP 2 - RESULTS                                  */}
                  {/* ================================================== */}

                  {step === 2 && (
                    <div className="grid gap-6 lg:grid-cols-2">

                      <Card className="glass p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <PencilLine className="h-5 w-5 text-primary" />

                          <h3 className="font-semibold">
                            Enter Class Results
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {lessonData.concepts.map(
                            (concept) => (
                              <div
                                key={
                                  concept.id
                                }
                              >
                                <div className="mb-1.5 flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {tr(
                                      concept.name
                                    )}
                                  </span>

                                  <span className="text-sm font-bold text-primary">
                                    {
                                      firstScores[
                                        concept.id
                                      ]
                                    }
                                    %
                                  </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                                  <motion.div
                                    initial={{
                                      width: 0,
                                    }}
                                    animate={{
                                      width: `${
                                        firstScores[
                                          concept
                                            .id
                                        ]
                                      }%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                    }}
                                    className={cn(
                                      'h-full rounded-full',
                                      firstScores[
                                        concept.id
                                      ] < 50
                                        ? 'bg-destructive'
                                        : firstScores[
                                              concept
                                                .id
                                            ] <
                                            75
                                          ? 'bg-warning'
                                          : 'bg-success'
                                    )}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </Card>

                      <Card className="glass flex flex-col items-center justify-center p-6">
                        <div className="mb-2 text-sm text-muted-foreground">
                          Class Average
                        </div>

                        <div className="font-display text-6xl font-bold text-gradient">
                          {Math.round(
                            Object.values(
                              firstScores
                            ).reduce(
                              (
                                total,
                                score
                              ) =>
                                total +
                                score,
                              0
                            ) / 4
                          )}
                          %
                        </div>

                        <div className="mt-4 text-sm text-warning">
                          Below target threshold
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* ================================================== */}
                  {/* STEP 3 - GAP                                      */}
                  {/* ================================================== */}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
                            <AlertTriangle className="h-6 w-6" />
                          </div>

                          <div>
                            <h3 className="font-display text-xl font-bold text-destructive">
                              Learning Gap Alert
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              {tr(
                                weakest.name
                              )}{' '}
                              shows low comprehension (
                              {
                                firstScores[
                                  weakest.id
                                ]
                              }
                              %)
                            </p>
                          </div>
                        </div>
                      </div>

                      <Card className="glass p-6">
                        <h3 className="mb-4 font-semibold">
                          Concept Performance
                        </h3>

                        <ResponsiveContainer
                          width="100%"
                          height={300}
                        >
                          <BarChart
                            data={
                              conceptData
                            }
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                            />

                            <XAxis
                              dataKey="name"
                              tick={{
                                fill: 'hsl(var(--muted-foreground))',
                                fontSize: 11,
                              }}
                            />

                            <YAxis
                              domain={[
                                0,
                                100,
                              ]}
                              tick={{
                                fill: 'hsl(var(--muted-foreground))',
                                fontSize: 11,
                              }}
                            />

                            <Tooltip
                              contentStyle={{
                                background:
                                  'hsl(var(--card))',
                                border:
                                  '1px solid hsl(var(--border))',
                                borderRadius:
                                  '12px',
                                fontSize:
                                  '12px',
                              }}
                            />

                            <Bar
                              dataKey="First"
                              radius={[
                                8,
                                8,
                                0,
                                0,
                              ]}
                            >
                              {conceptData.map(
                                (
                                  entry,
                                  index
                                ) => (
                                  <Cell
                                    key={
                                      index
                                    }
                                    fill={
                                      entry.First <
                                      50
                                        ? 'hsl(var(--destructive))'
                                        : entry.First <
                                            75
                                          ? 'hsl(var(--warning))'
                                          : 'hsl(var(--success))'
                                    }
                                  />
                                )
                              )}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>
                    </div>
                  )}

                  {/* ================================================== */}
                  {/* STEP 4 - RE-TEACH                                */}
                  {/* ================================================== */}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-warning" />

                        <h3 className="font-display text-xl font-bold">
                          {tr(
                            reTeachingStrategy.title
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {reTeachingStrategy.strategies.map(
                          (
                            strategy,
                            index
                          ) => {
                            const Icon =
                              iconMap[
                                strategy.icon
                              ] ??
                              Ruler;

                            return (
                              <motion.div
                                key={index}
                                initial={{
                                  opacity: 0,
                                  y: 20,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                }}
                                transition={{
                                  delay:
                                    index *
                                    0.1,
                                }}
                              >
                                <Card className="glass h-full p-6 transition hover:border-primary/40">
                                  <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                      <Icon className="h-5 w-5" />
                                    </div>

                                    <h4 className="font-semibold">
                                      {tr(
                                        strategy.label
                                      )}
                                    </h4>
                                  </div>

                                  <p className="text-sm leading-relaxed text-muted-foreground">
                                    {tr(
                                      strategy.text
                                    )}
                                  </p>
                                </Card>
                              </motion.div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* ================================================== */}
                  {/* STEP 5 - RE-ASSESS                               */}
                  {/* ================================================== */}

                  {step === 5 && (
                    <div className="grid gap-6 lg:grid-cols-2">

                      <Card className="glass p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-success" />

                          <h3 className="font-semibold">
                            Post Re-Teaching Results
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {lessonData.concepts.map(
                            (concept) => {
                              const delta =
                                secondScores[
                                  concept.id
                                ] -
                                firstScores[
                                  concept.id
                                ];

                              return (
                                <div
                                  key={
                                    concept.id
                                  }
                                >
                                  <div className="mb-1.5 flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      {tr(
                                        concept.name
                                      )}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground line-through">
                                        {
                                          firstScores[
                                            concept.id
                                          ]
                                        }
                                        %
                                      </span>

                                      <span className="text-sm font-bold text-success">
                                        {
                                          secondScores[
                                            concept.id
                                          ]
                                        }
                                        %
                                      </span>

                                      <span className="rounded bg-success/15 px-1.5 py-0.5 text-xs font-semibold text-success">
                                        +
                                        {
                                          delta
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                                    <motion.div
                                      initial={{
                                        width: `${firstScores[concept.id]}%`,
                                      }}
                                      animate={{
                                        width: `${secondScores[concept.id]}%`,
                                      }}
                                      transition={{
                                        duration: 1,
                                      }}
                                      className="h-full rounded-full bg-success"
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </Card>

                      <Card className="glass flex flex-col items-center justify-center p-6">
                        <div className="mb-2 text-sm text-muted-foreground">
                          New Class Average
                        </div>

                        <div className="font-display text-6xl font-bold text-gradient-accent">
                          {Math.round(
                            Object.values(
                              secondScores
                            ).reduce(
                              (
                                total,
                                score
                              ) =>
                                total +
                                score,
                              0
                            ) / 4
                          )}
                          %
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-success">
                          <TrendingUp className="h-4 w-4" />

                          +{improvement}% on weakest concept
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* ================================================== */}
                  {/* STEP 6 - IMPROVEMENT                              */}
                  {/* ================================================== */}

                  {step === 6 && (
                    <div className="space-y-6">

                      <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="glass p-6 text-center">
                          <div className="text-sm text-muted-foreground">
                            Before
                          </div>

                          <div className="font-display text-4xl font-bold text-muted-foreground">
                            {
                              firstScores[
                                weakest.id
                              ]
                            }
                            %
                          </div>
                        </Card>

                        <Card className="glass flex flex-col items-center justify-center p-6 text-center">
                          <TrendingUp className="mb-2 h-6 w-6 text-success" />

                          <div className="text-sm text-muted-foreground">
                            Improvement
                          </div>

                          <div className="font-display text-4xl font-bold text-success">
                            +{improvement}%
                          </div>
                        </Card>

                        <Card className="glass p-6 text-center">
                          <div className="text-sm text-muted-foreground">
                            After
                          </div>

                          <div className="font-display text-4xl font-bold text-gradient-accent">
                            {
                              secondScores[
                                weakest.id
                              ]
                            }
                            %
                          </div>
                        </Card>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">

                        <Card className="glass p-6">
                          <h3 className="mb-4 font-semibold">
                            Before vs After
                          </h3>

                          <ResponsiveContainer
                            width="100%"
                            height={300}
                          >
                            <BarChart
                              data={
                                conceptData
                              }
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                              />

                              <XAxis
                                dataKey="name"
                                tick={{
                                  fill: 'hsl(var(--muted-foreground))',
                                  fontSize: 10,
                                }}
                              />

                              <YAxis
                                domain={[
                                  0,
                                  100,
                                ]}
                                tick={{
                                  fill: 'hsl(var(--muted-foreground))',
                                  fontSize: 11,
                                }}
                              />

                              <Tooltip
                                contentStyle={{
                                  background:
                                    'hsl(var(--card))',
                                  border:
                                    '1px solid hsl(var(--border))',
                                  borderRadius:
                                    '12px',
                                  fontSize:
                                    '12px',
                                }}
                              />

                              <Legend
                                wrapperStyle={{
                                  fontSize:
                                    '12px',
                                }}
                              />

                              <Bar
                                dataKey="First"
                                fill="hsl(var(--destructive))"
                                radius={[
                                  8,
                                  8,
                                  0,
                                  0,
                                ]}
                              />

                              <Bar
                                dataKey="Second"
                                fill="hsl(var(--success))"
                                radius={[
                                  8,
                                  8,
                                  0,
                                  0,
                                ]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>

                        <Card className="glass p-6">
                          <h3 className="mb-4 font-semibold">
                            Concept Mastery — Radar
                          </h3>

                          <ResponsiveContainer
                            width="100%"
                            height={300}
                          >
                            <RadarChart
                              data={
                                radarData
                              }
                            >
                              <PolarGrid
                                stroke="hsl(var(--border))"
                              />

                              <PolarAngleAxis
                                dataKey="concept"
                                tick={{
                                  fill: 'hsl(var(--muted-foreground))',
                                  fontSize: 11,
                                }}
                              />

                              <PolarRadiusAxis
                                domain={[
                                  0,
                                  100,
                                ]}
                                tick={{
                                  fill: 'hsl(var(--muted-foreground))',
                                  fontSize: 10,
                                }}
                              />

                              <Radar
                                name="Before"
                                dataKey="Before"
                                stroke="hsl(var(--destructive))"
                                fill="hsl(var(--destructive))"
                                fillOpacity={0.3}
                              />

                              <Radar
                                name="After"
                                dataKey="After"
                                stroke="hsl(var(--success))"
                                fill="hsl(var(--success))"
                                fillOpacity={0.3}
                              />

                              <Legend
                                wrapperStyle={{
                                  fontSize:
                                    '12px',
                                }}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </Card>
                      </div>

                      <Card className="glass p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-accent" />

                          <h3 className="font-semibold">
                            AI Summary
                          </h3>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Today's lesson on{' '}
                          <strong className="text-foreground">
                            Fractions
                          </strong>{' '}
                          was delivered successfully.
                          Students initially struggled
                          with{' '}
                          <strong className="text-warning">
                            {tr(
                              weakest.name
                            )}{' '}
                            (
                            {
                              firstScores[
                                weakest.id
                              ]
                            }
                            %)
                          </strong>
                          . After visual fraction
                          strips and group activities,
                          comprehension improved to{' '}
                          <strong className="text-success">
                            {
                              secondScores[
                                weakest.id
                              ]
                            }
                            % (+
                            {improvement}
                            %)
                          </strong>
                          .
                        </p>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Workflow navigation */}

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={step === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />

                  {t('common.back')}
                </Button>

                <span className="text-xs text-muted-foreground">
                  Step {step + 1} of{' '}
                  {steps.length}
                </span>

                <Button
                  onClick={next}
                  disabled={step === 6}
                >
                  {t('common.next')}

                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* LESSON LIBRARY                                               */}
          {/* ============================================================ */}

          {tab === 'library' && (
            <div className="space-y-6">

              {/* Library header */}

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Lesson Library
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {uploads.length}{' '}
                    {uploads.length === 1
                      ? 'lesson'
                      : 'lessons'}{' '}
                    available
                  </p>
                </div>

                <Button
                  onClick={
                    handleUploadNew
                  }
                  size="sm"
                >
                  <Upload className="mr-2 h-4 w-4" />

                  Upload New
                </Button>
              </div>

              {/* Empty state */}

              {uploads.length === 0 && (
                <Card className="glass p-10 text-center">
                  <Library className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

                  <h3 className="font-semibold">
                    No lessons yet
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload your first lesson
                    to build your library.
                  </p>

                  <Button
                    className="mt-5"
                    onClick={
                      handleUploadNew
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />

                    Upload Lesson
                  </Button>
                </Card>
              )}

              {/* Lessons */}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uploads.map(
                  (lesson, index) => {
                    const FileIcon =
                      fileTypeIcons[
                        lesson.fileType
                      ] ?? FileText;

                    const SourceIcon =
                      sourceIcons[
                        lesson.source
                      ] ?? Laptop;

                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.08,
                        }}
                      >
                        <Card className="glass h-full p-5 transition hover:border-primary/40">

                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                              <FileIcon className="h-5 w-5" />
                            </div>

                            <span className="rounded-full bg-muted/40 px-2.5 py-0.5 text-xs">
                              {tr(
                                lesson.subject
                              )}
                            </span>
                          </div>

                          <h3 className="mb-1 text-sm font-semibold">
                            {tr(
                              lesson.title
                            )}
                          </h3>

                          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                            {tr(
                              lesson.summary
                            )}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <SourceIcon className="h-3 w-3" />

                              {lesson.source}
                            </span>

                            <span>
                              {lesson.size}
                            </span>

                            <span>
                              {
                                lesson.uploadDate
                              }
                            </span>
                          </div>

                          {/* Actions */}

                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() =>
                                handleViewLesson(
                                  lesson
                                )
                              }
                            >
                              <Eye className="mr-1.5 h-4 w-4" />

                              View
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setTab(
                                  'workflow'
                                );

                                setStep(1);

                                toast.success(
                                  `Assessment opened for ${tr(
                                    lesson.title
                                  )}.`
                                );
                              }}
                            >
                              Assess
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GAP ANALYSIS                                                 */}
          {/* ============================================================ */}

          {tab === 'gap' && (
            <div className="space-y-6">

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <Card className="glass p-5">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Understanding Score
                  </div>

                  <div className="font-display text-3xl font-bold text-gradient">
                    {
                      gapAnalysisData.understandingScore
                    }
                    %
                  </div>
                </Card>

                <Card className="glass p-5">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Class Performance
                  </div>

                  <div className="font-display text-3xl font-bold text-primary">
                    {
                      gapAnalysisData.classPerformance
                    }
                    %
                  </div>
                </Card>

                <Card className="glass p-5">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Understood
                  </div>

                  <div className="font-display text-3xl font-bold text-success">
                    {
                      gapAnalysisData.understood
                    }
                  </div>
                </Card>

                <Card className="glass p-5">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Struggling
                  </div>

                  <div className="font-display text-3xl font-bold text-destructive">
                    {
                      gapAnalysisData.struggling
                    }
                  </div>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">

                <Card className="glass p-6">
                  <h3 className="mb-4 font-semibold">
                    Understanding Distribution
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={250}
                  >
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: 'Understood',
                            value:
                              gapAnalysisData.understood,
                            fill: 'hsl(var(--success))',
                          },
                          {
                            name: 'Struggling',
                            value:
                              gapAnalysisData.struggling,
                            fill: 'hsl(var(--destructive))',
                          },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                      >
                        <Cell fill="hsl(var(--success))" />
                        <Cell fill="hsl(var(--destructive))" />
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          background:
                            'hsl(var(--card))',
                          border:
                            '1px solid hsl(var(--border))',
                          borderRadius:
                            '12px',
                          fontSize:
                            '12px',
                        }}
                      />

                      <Legend
                        wrapperStyle={{
                          fontSize:
                            '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="glass p-6">
                  <h3 className="mb-4 font-semibold">
                    Confusing Concepts
                  </h3>

                  <div className="space-y-4">
                    {gapAnalysisData.confusingConcepts.map(
                      (
                        concept,
                        index
                      ) => (
                        <div
                          key={index}
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {tr(
                                concept.concept
                              )}
                            </span>

                            <span className="text-sm font-bold text-destructive">
                              {
                                concept.confusionRate
                              }
                              %
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                            <motion.div
                              initial={{
                                width: 0,
                              }}
                              animate={{
                                width: `${concept.confusionRate}%`,
                              }}
                              transition={{
                                duration:
                                  0.8,
                                delay:
                                  index *
                                  0.1,
                              }}
                              className="h-full rounded-full bg-destructive"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STUDENT PROGRESS                                             */}
          {/* ============================================================ */}

          {tab === 'progress' && (
            <div className="space-y-4">
              <Card className="glass p-6">
                <h3 className="mb-4 font-semibold">
                  Student Progress Dashboard
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">
                          Name
                        </th>

                        <th className="pb-3 pr-4 font-medium">
                          Lessons
                        </th>

                        <th className="pb-3 pr-4 font-medium">
                          Quiz Score
                        </th>

                        <th className="pb-3 pr-4 font-medium">
                          Attendance
                        </th>

                        <th className="pb-3 pr-4 font-medium">
                          Level
                        </th>

                        <th className="pb-3 font-medium">
                          Weak Topics
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {studentProgress.map(
                        (student) => (
                          <tr
                            key={
                              student.id
                            }
                            className="border-b border-border/30 last:border-0"
                          >
                            <td className="py-3 pr-4 font-medium">
                              {tr(
                                student.name
                              )}
                            </td>

                            <td className="py-3 pr-4">
                              {
                                student.lessonsCompleted
                              }
                            </td>

                            <td className="py-3 pr-4">
                              <span
                                className={cn(
                                  'font-semibold',
                                  student.quizScore >=
                                    75
                                    ? 'text-success'
                                    : student.quizScore >=
                                        50
                                      ? 'text-warning'
                                      : 'text-destructive'
                                )}
                              >
                                {
                                  student.quizScore
                                }
                                %
                              </span>
                            </td>

                            <td className="py-3 pr-4">
                              {
                                student.attendance
                              }
                              %
                            </td>

                            <td className="py-3 pr-4">
                              <span
                                className={cn(
                                  'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                  levelColors[
                                    student
                                      .learningLevel
                                  ]
                                )}
                              >
                                {tr(
                                  levelLabels[
                                    student
                                      .learningLevel
                                  ]
                                )}
                              </span>
                            </td>

                            <td className="py-3 text-xs text-muted-foreground">
                              {student.weakTopics
                                .length >
                              0
                                ? student.weakTopics
                                    .map(
                                      (
                                        topic
                                      ) =>
                                        tr(
                                          topic
                                        )
                                    )
                                    .join(
                                      ', '
                                    )
                                : '—'}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-success" />
                  Good
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-warning" />
                  Moderate
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-destructive" />
                  Needs Attention
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACCESSIBILITY                                                */}
          {/* ============================================================ */}

          {tab === 'accessibility' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: WifiOff,
                  title: {
                    en: 'Offline Mode',
                    te: 'ఆఫ్‌లైన్ మోడ్',
                    hi: 'ऑफलाइन मोड',
                    ta: 'ஆஃப்லைன் முறை',
                    kn: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್',
                  },
                  desc: {
                    en: 'Access lessons without internet',
                    te: 'ఇంటర్నెట్ లేకుండా పాఠాలను యాక్సెస్ చేయండి',
                    hi: 'बिना इंटरनेट के पाठ एक्सेस करें',
                    ta: 'இணையம் இல்லாமல் பாடங்களை அணுகவும்',
                    kn: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಪಾಠಗಳನ್ನು ಪ್ರವೇಶಿಸಿ',
                  },
                },

                {
                  icon: Wifi,
                  title: {
                    en: 'Low Internet Mode',
                    te: 'తక్కువ ఇంటర్నెట్ మోడ్',
                    hi: 'कम इंटरनेट मोड',
                    ta: 'குறைந்த இணைய முறை',
                    kn: 'ಕಡಿಮೆ ಇಂಟರ್ನೆಟ್ ಮೋಡ್',
                  },
                  desc: {
                    en: 'Optimized for slow connections',
                    te: 'నెమ్మదైన కనెక్షన్‌ల కోసం',
                    hi: 'धीमे कनेक्शन के लिए अनुकूलित',
                    ta: 'மெதுவான இணைப்புகளுக்கு',
                    kn: 'ನಿಧಾನ ಸಂಪರ್ಕಗಳಿಗಾಗಿ',
                  },
                },

                {
                  icon: Mic,
                  title: {
                    en: 'Voice Navigation',
                    te: 'వాయిస్ నావిగేషన్',
                    hi: 'वॉइस नेविगेशन',
                    ta: 'குரல் வழிசெலுத்தல்',
                    kn: 'ಧ್ವನಿ ನ್ಯಾವಿಗೇಶನ್',
                  },
                  desc: {
                    en: 'Navigate with voice commands',
                    te: 'వాయిస్ కమాండ్‌లతో నావిగేట్ చేయండి',
                    hi: 'वॉइस कमांड से नेविगेट करें',
                    ta: 'குரல் கட்டளைகளுடன் வழிசெல்லவும்',
                    kn: 'ಧ್ವನಿ ಆದೇಶಗಳೊಂದಿಗೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ',
                  },
                },

                {
                  icon: Volume2,
                  title: {
                    en: 'Text-to-Speech',
                    te: 'టెక్స్ట్-టు-స్పీచ్',
                    hi: 'टेक्स्ट-टू-स्पीच',
                    ta: 'உரை-க்கு-பேச்சு',
                    kn: 'ಪಠ್ಯ-ರಿಂದ-ಮಾತು',
                  },
                  desc: {
                    en: 'Listen to lesson content',
                    te: 'పాఠ విషయాన్ని వినండి',
                    hi: 'पाठ सामग्री सुनें',
                    ta: 'பாட உள்ளடக்கத்தைக் கேளுங்கள்',
                    kn: 'ಪಾಠ ವಿಷಯವನ್ನು ಕೇಳಿ',
                  },
                },

                {
                  icon: MessageSquare,
                  title: {
                    en: 'SMS Updates',
                    te: 'SMS అప్‌డేట్‌లు',
                    hi: 'SMS अपडेट',
                    ta: 'SMS புதுப்பிப்புகள்',
                    kn: 'SMS ಅಪ್‌ಡೇಟ್‌ಗಳು',
                  },
                  desc: {
                    en: 'Parent notifications via SMS',
                    te: 'SMS ద్వారా తల్లిదండ్రుల నోటిఫికేషన్‌లు',
                    hi: 'SMS द्वारा अभिभावक सूचना',
                    ta: 'SMS மூலம் பெற்றோர் அறிவிப்புகள்',
                    kn: 'SMS ಮೂಲಕ ಪೋಷಕ ಸೂಚನೆಗಳು',
                  },
                },

                {
                  icon: Languages,
                  title: {
                    en: 'Regional Languages',
                    te: 'ప్రాంతీయ భాషలు',
                    hi: 'क्षेत्रीय भाषाएँ',
                    ta: 'பிராந்திய மொழிகள்',
                    kn: 'ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳು',
                  },
                  desc: {
                    en: 'Telugu, Hindi, Tamil, Kannada',
                    te: 'తెలుగు, హిందీ, తమిళం, కన్నడ',
                    hi: 'तेलुगु, हिंदी, तमिल, कन्नड़',
                    ta: 'தெலுங்கு, இந்தி, தமிழ், கன்னடம்',
                    kn: 'ತೆಲುಗು, ಹಿಂದಿ, ತಮಿಳು, ಕನ್ನಡ',
                  },
                },
              ].map(
                (feature, index) => {
                  const Icon =
                    feature.icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.1,
                      }}
                    >
                      <Card className="glass h-full p-5 transition hover:border-primary/40">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="mb-1 text-sm font-semibold">
                          {tr(
                            feature.title
                          )}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          {tr(
                            feature.desc
                          )}
                        </p>
                      </Card>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ================================================================== */}
      {/* VIEW LESSON MODAL                                                 */}
      {/* ================================================================== */}

      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedLesson(null)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              transition={{
                duration: 0.2,
              }}
              className="w-full max-w-lg"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <Card className="glass overflow-hidden p-0">

                {/* Modal header */}

                <div className="flex items-center justify-between border-b border-border/60 p-5">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon =
                        fileTypeIcons[
                          selectedLesson
                            .fileType
                        ] ??
                        FileText;

                      return (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                      );
                    })()}

                    <div>
                      <h2 className="font-semibold">
                        {tr(
                          selectedLesson.title
                        )}
                      </h2>

                      <p className="text-xs text-muted-foreground">
                        Lesson Details
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedLesson(
                        null
                      )
                    }
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal content */}

                <div className="space-y-4 p-5">

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        Subject
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {tr(
                          selectedLesson.subject
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        File Type
                      </p>

                      <p className="mt-1 text-sm font-medium uppercase">
                        {
                          selectedLesson.fileType
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        Size
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {
                          selectedLesson.size
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">
                        Source
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {
                          selectedLesson.source
                        }
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/30 p-4">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      SUMMARY
                    </p>

                    <p className="text-sm leading-relaxed">
                      {tr(
                        selectedLesson.summary
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />

                      <span className="text-sm font-medium">
                        Available in Lesson Library
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      This lesson has been saved and
                      is ready for assessment.
                    </p>
                  </div>
                </div>

                {/* Modal actions */}

                <div className="flex gap-2 border-t border-border/60 p-5">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setSelectedLesson(
                        null
                      )
                    }
                  >
                    Close
                  </Button>

                  <Button
                    className="flex-1"
                    onClick={() => {
                      const lessonTitle =
                        tr(
                          selectedLesson.title
                        );

                      setSelectedLesson(
                        null
                      );

                      setTab(
                        'workflow'
                      );

                      setStep(1);

                      toast.success(
                        `Assessment opened for ${lessonTitle}.`
                      );
                    }}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />

                    Assess
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}