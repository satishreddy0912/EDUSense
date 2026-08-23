import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';

import { motion } from 'framer-motion';

import {
  School,
  Users,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  FileText,
  Sparkles,
  BookOpen,
  UsersRound,
  Wand2,
  Video,
  Plus,
  Trash2,
  PlayCircle,
  Link as LinkIcon,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useI18n } from '@/i18n';

import {
  teacherCards,
  aiInsights,
  lessonAnalytics,
} from '@/data/mockData';

/*
  Cross-Sense AI & Visual Activity Modals
*/
import CrossSensePanel from '@/components/CrossSensePanel';
import VisualFractionStripsModal from '@/components/VisualFractionStripsModal';
import TeacherRecommendationsModal, {
  type RecommendationType,
} from '@/components/TeacherRecommendationsModal';

/* =========================================================
   STORAGE
========================================================= */

const VIDEO_STORAGE_KEY =
  'vidya_teacher_video_explanations';

const VIDEO_UPDATED_EVENT =
  'vidya-teacher-videos-updated';

/* =========================================================
   TYPES
========================================================= */

export type TeacherVideoExplanation = {
  id: string;
  title: string;
  subject: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  teacherName: string;
};

/* =========================================================
   ICON MAP
========================================================= */

const iconMap: Record<string, typeof School> = {
  school: School,
  users: Users,
  clipboard: ClipboardList,
  alert: AlertTriangle,
  trending: TrendingUp,
  lightbulb: Lightbulb,
};

/* =========================================================
   TONES
========================================================= */

const toneClasses: Record<string, string> = {
  warning:
    'border-warning/30 bg-warning/10 text-warning',

  success:
    'border-success/30 bg-success/10 text-success',

  primary:
    'border-primary/30 bg-primary/10 text-primary',
};

/* =========================================================
   RECOMMENDATIONS
========================================================= */

const recommendations = [
  {
    type: 'worksheet' as const,
    icon: FileText,
    title: 'Worksheet',
    titleTe: 'వర్క్‌షీట్',
    desc:
      'Adding fractions — 20 problems, auto-generated',
    descTe:
      'భిన్నాల సంకలనం — 20 సమస్యలు',
    actionLabel: 'Generate & Print',
    actionLabelTe: 'జనరేట్ & ప్రింట్',
  },
  {
    type: 'remedial' as const,
    icon: Sparkles,
    title: 'Remedial Activity',
    titleTe: 'ప్రతివిధి కార్యకలాపం',
    desc:
      'Fraction strips hands-on exercise',
    descTe:
      'భిన్నం పట్టీల ఆచరణీయ వ్యాయామం',
    actionLabel: 'Launch Visual Activity',
    actionLabelTe: 'దృశ్య కార్యాచరణ ప్రారంభించండి',
    highlight: true,
  },
  {
    type: 'homework' as const,
    icon: BookOpen,
    title: 'Homework',
    titleTe: 'హోంవర్క్',
    desc:
      'Daily 5 fraction problems with solutions',
    descTe:
      'రోజుకు 5 భిన్నం సమస్యలు',
    actionLabel: 'View & Assign',
    actionLabelTe: 'చూడండి & కేటాయించండి',
  },
  {
    type: 'group' as const,
    icon: UsersRound,
    title: 'Group Activity',
    titleTe: 'సమూహ కార్యకలాపం',
    desc:
      'Pizza fraction puzzle in teams of 4',
    descTe:
      'పిజ్జా భిన్నం పజిల్ — 4 జట్టులు',
    actionLabel: 'Start Group Puzzle',
    actionLabelTe: 'గ్రూప్ పజిల్ ప్రారంభించండి',
  },
];

/* =========================================================
   READ VIDEOS
========================================================= */

function readTeacherVideos(): TeacherVideoExplanation[] {
  try {
    const saved = localStorage.getItem(
      VIDEO_STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        item
      ): item is TeacherVideoExplanation => {
        if (
          !item ||
          typeof item !== 'object'
        ) {
          return false;
        }

        const video =
          item as Record<string, unknown>;

        return (
          typeof video.id === 'string' &&
          typeof video.title === 'string' &&
          typeof video.subject === 'string' &&
          typeof video.description === 'string' &&
          typeof video.videoUrl === 'string' &&
          typeof video.createdAt === 'string' &&
          typeof video.teacherName === 'string'
        );
      }
    );
  } catch (error) {
    console.error(
      'Unable to read teacher videos:',
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE VIDEOS
========================================================= */

function saveTeacherVideos(
  videos: TeacherVideoExplanation[]
) {
  try {
    localStorage.setItem(
      VIDEO_STORAGE_KEY,
      JSON.stringify(videos)
    );

    window.dispatchEvent(
      new CustomEvent(
        VIDEO_UPDATED_EVENT
      )
    );
  } catch (error) {
    console.error(
      'Unable to save teacher videos:',
      error
    );

    throw new Error(
      'Unable to save video. Browser storage may be full.'
    );
  }
}

/* =========================================================
   FILE -> DATA URL
========================================================= */

function fileToDataUrl(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result ===
          'string'
        ) {
          resolve(reader.result);
        } else {
          reject(
            new Error(
              'Unable to read video file.'
            )
          );
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            'Unable to read video file.'
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TeacherDashboard() {
  const {
    t,
    lang,
    tr,
  } = useI18n();

  /* =======================================================
     CROSS-SENSE AI STATE
  ======================================================= */

  /*
    These values are used by the Cross-Sense engine.

    visualActivity:
      Updated by CameraAssistant.

    audioActivity:
      Updated by AudioAssistant.

    assessmentScore:
      Current student/class assessment performance.

    attendance:
      Current attendance percentage.

    learningGaps:
      Estimated percentage of learning gaps.
  */

  const [visualActivity, setVisualActivity] =
    useState(75);

  const [audioActivity, setAudioActivity] =
    useState(70);

  const assessmentScore = 82;

  const attendance = 91;

  const learningGaps = 25;
    

  /* -------------------------------------------------------
     VIDEO STATE
  ------------------------------------------------------- */

  const [videos, setVideos] =
    useState<TeacherVideoExplanation[]>(
      []
    );

  const [title, setTitle] =
    useState('');

  const [subject, setSubject] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [videoUrl, setVideoUrl] =
    useState('');

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [messageType, setMessageType] =
    useState<
      'success' | 'error'
    >('success');

  /* -------------------------------------------------------
     MODALS & INTERACTIVE ACTIVITY STATE
  ------------------------------------------------------- */

  const [isVisualModalOpen, setIsVisualModalOpen] =
    useState(false);

  const [recommendationModalType, setRecommendationModalType] =
    useState<RecommendationType>(null);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  const handleRecommendationClick = (
    type: 'worksheet' | 'remedial' | 'homework' | 'group'
  ) => {
    if (type === 'remedial') {
      setIsVisualModalOpen(true);
    } else {
      setRecommendationModalType(type);
    }
  };

  /* =======================================================
     LOAD VIDEOS
  ======================================================= */

  useEffect(() => {
    setVideos(readTeacherVideos());

    const handleVideoUpdate =
      () => {
        setVideos(
          readTeacherVideos()
        );
      };

    window.addEventListener(
      VIDEO_UPDATED_EVENT,
      handleVideoUpdate
    );

    const handleStorage =
      (event: StorageEvent) => {
        if (
          event.key ===
          VIDEO_STORAGE_KEY
        ) {
          setVideos(
            readTeacherVideos()
          );
        }
      };

    window.addEventListener(
      'storage',
      handleStorage
    );

    return () => {
      window.removeEventListener(
        VIDEO_UPDATED_EVENT,
        handleVideoUpdate
      );

      window.removeEventListener(
        'storage',
        handleStorage
      );
    };
  }, []);

  /* =======================================================
     VIDEO COUNT
  ======================================================= */

  const videoCountText =
    useMemo(() => {
      if (videos.length === 1) {
        return '1 explanation available to students';
      }

      return `${videos.length} explanations available to students`;
    }, [videos.length]);

  /* =======================================================
     FILE SELECT
  ======================================================= */

  const handleVideoFile = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      setVideoFile(null);
      return;
    }

    if (
      !file.type.startsWith(
        'video/'
      )
    ) {
      setMessageType('error');

      setMessage(
        'Please select a valid video file.'
      );

      setVideoFile(null);

      return;
    }

    setMessage('');
    setVideoFile(file);
    setVideoUrl('');
  };

  /* =======================================================
     PUBLISH VIDEO
  ======================================================= */

  const addVideoExplanation =
    async () => {
      setMessage('');

      if (!title.trim()) {
        setMessageType('error');

        setMessage(
          'Please enter a video title.'
        );

        return;
      }

      if (!subject.trim()) {
        setMessageType('error');

        setMessage(
          'Please enter the subject.'
        );

        return;
      }

      if (
        !videoFile &&
        !videoUrl.trim()
      ) {
        setMessageType('error');

        setMessage(
          'Please upload a video or enter a video URL.'
        );

        return;
      }

      setIsSaving(true);

      try {
        let finalVideoUrl =
          videoUrl.trim();

        if (videoFile) {
          finalVideoUrl =
            await fileToDataUrl(
              videoFile
            );
        }

        const teacherName =
          localStorage.getItem(
            'vidya_auth_name'
          ) || 'Teacher';

        const newVideo: TeacherVideoExplanation =
          {
            id:
              typeof crypto !==
                'undefined' &&
              typeof crypto.randomUUID ===
                'function'
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2)}`,

            title:
              title.trim(),

            subject:
              subject.trim(),

            description:
              description.trim() ||
              'Teacher explanation for this lesson.',

            videoUrl:
              finalVideoUrl,

            createdAt:
              new Date().toISOString(),

            teacherName,
          };

        const currentVideos =
          readTeacherVideos();

        const updatedVideos = [
          newVideo,
          ...currentVideos,
        ];

        saveTeacherVideos(
          updatedVideos
        );

        setVideos(
          updatedVideos
        );

        setTitle('');
        setSubject('');
        setDescription('');
        setVideoUrl('');
        setVideoFile(null);

        const fileInput =
          document.getElementById(
            'teacher-video-file'
          ) as HTMLInputElement | null;

        if (fileInput) {
          fileInput.value = '';
        }

        setMessageType(
          'success'
        );

        setMessage(
          'Video explanation published successfully. Students can now access it.'
        );
      } catch (error) {
        console.error(
          'Publishing video failed:',
          error
        );

        setMessageType('error');

        setMessage(
          error instanceof Error
            ? error.message
            : 'Unable to publish video.'
        );
      } finally {
        setIsSaving(false);
      }
    };

  /* =======================================================
     DELETE VIDEO
  ======================================================= */

  const deleteVideo = (
    id: string
  ) => {
    try {
      const updatedVideos =
        readTeacherVideos().filter(
          (video) =>
            video.id !== id
        );

      saveTeacherVideos(
        updatedVideos
      );

      setVideos(
        updatedVideos
      );

      setMessageType(
        'success'
      );

      setMessage(
        'Video explanation deleted.'
      );
    } catch (error) {
      console.error(
        'Delete video failed:',
        error
      );

      setMessageType('error');

      setMessage(
        'Unable to delete video.'
      );
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen space-y-6 pb-12">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-primary font-semibold">
              {t('nav.teacher')}
            </span>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-accent font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Visual Activities Ready
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            AI Control Center
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Premium teaching intelligence dashboard with interactive visual activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsVisualModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] transition-all font-semibold"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Launch Visual Activity
          </Button>
        </div>
      </motion.div>

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-sm text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-emerald-200"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* =====================================================
          TEACHER STATISTICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {teacherCards.map((card, index) => {
          const Icon =
            iconMap[card.icon] ??
            School;

          return (
            <motion.div
              key={card.id}
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
                  index * 0.08,
              }}
            >
              <Card className="glass p-5 transition hover:border-primary/40">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      card.trendUp
                        ? 'bg-success/15 text-success'
                        : 'bg-destructive/15 text-destructive'
                    )}
                  >
                    {card.trend}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {tr(card.label)}
                </div>

                <div className="font-display text-3xl font-bold">
                  {card.value}
                  {card.suffix ?? ''}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* =====================================================
          AI INSIGHTS
      ====================================================== */}

      <div className="grid gap-4 lg:grid-cols-3">
        {aiInsights.map(
          (insight, index) => {
            const Icon =
              iconMap[
                insight.icon
              ] ?? Lightbulb;

            const isSuggestedVisualActivity =
              index === 2 ||
              (typeof insight.value === 'object' &&
                'en' in insight.value &&
                insight.value.en.includes('fraction strips'));

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
                    index * 0.1,
                }}
              >
                <Card
                  onClick={
                    isSuggestedVisualActivity
                      ? () => setIsVisualModalOpen(true)
                      : undefined
                  }
                  className={cn(
                    'glass border p-5 transition relative overflow-hidden',
                    toneClasses[
                      insight.tone
                    ],
                    isSuggestedVisualActivity &&
                      'cursor-pointer hover:border-primary/60 hover:shadow-[0_0_25px_rgba(0,210,255,0.25)] hover:scale-[1.01]'
                  )}
                >
                  {isSuggestedVisualActivity && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary animate-pulse">
                        <Sparkles className="h-2.5 w-2.5" />
                        Click to Launch
                      </span>
                    </div>
                  )}

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-current/10">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mb-1 text-xs text-muted-foreground">
                    {tr(
                      insight.label
                    )}
                  </div>

                  <div className="font-semibold text-foreground">
                    {tr(
                      insight.value
                    )}
                  </div>

                  {isSuggestedVisualActivity && (
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                      <span>Open Interactive Fraction Strips</span>
                      <PlayCircle className="h-3.5 w-3.5" />
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          }
        )}
      </div>

      {/* =====================================================
          CROSS-SENSE AI
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <CrossSensePanel
          visualActivity={
            visualActivity
          }
          audioActivity={
            audioActivity
          }
          assessmentScore={
            assessmentScore
          }
          attendance={
            attendance
          }
          learningGaps={
            learningGaps
          }
          onVisualActivityChange={
            setVisualActivity
          }
          onAudioActivityChange={
            setAudioActivity
          }
        />
      </motion.div>

      {/* =====================================================
          TEACHER VIDEO EXPLANATIONS
      ====================================================== */}

      <Card className="glass overflow-hidden border-accent/20">

        <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-transparent p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Video className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Teacher Video Explanations
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Upload explanations for students to watch from their dashboard.
                  </p>

                </div>

              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">

                <CheckCircle2 className="h-4 w-4 text-success" />

                {videoCountText}

              </div>

            </div>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          {/* ADD VIDEO */}

          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">

            <div className="mb-5 flex items-center gap-2">

              <Plus className="h-5 w-5 text-primary" />

              <h3 className="font-semibold">
                Add Video Explanation
              </h3>

            </div>

            <div className="space-y-4">

              <div>

                <label
                  htmlFor="video-title"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Video title
                </label>

                <Input
                  id="video-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Example: Understanding Fractions"
                />

              </div>

              <div>

                <label
                  htmlFor="video-subject"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Subject
                </label>

                <Input
                  id="video-subject"
                  value={subject}
                  onChange={(event) =>
                    setSubject(
                      event.target.value
                    )
                  }
                  placeholder="Mathematics"
                />

              </div>

              <div>

                <label
                  htmlFor="video-description"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Description
                </label>

                <Input
                  id="video-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Short explanation summary"
                />

              </div>

              <div>

                <label
                  htmlFor="video-url"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Video URL
                </label>

                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(event) =>
                    setVideoUrl(
                      event.target.value
                    )
                  }
                  placeholder="https://example.com/video.mp4"
                />

              </div>

              <div>

                <label
                  htmlFor="teacher-video-file"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Or upload a video file
                </label>

                <Input
                  id="teacher-video-file"
                  type="file"
                  accept="video/*"
                  onChange={
                    handleVideoFile
                  }
                />

              </div>

              {message && (
                <div
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm',
                    messageType ===
                      'success'
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'border-destructive/30 bg-destructive/10 text-destructive'
                  )}
                >
                  {message}
                </div>
              )}

              <Button
                onClick={
                  addVideoExplanation
                }
                disabled={isSaving}
                className="w-full"
              >
                {isSaving
                  ? 'Publishing...'
                  : 'Publish explanation'}
              </Button>

            </div>

          </div>

          {/* STUDENT ACCESS */}

          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">

            <div className="mb-5 flex items-center gap-2">

              <PlayCircle className="h-5 w-5 text-accent" />

              <h3 className="font-semibold">
                Student Access
              </h3>

            </div>

            <div className="space-y-3">

              {videos.length === 0 ? (

                <div className="rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                  No explanations published yet.
                </div>

              ) : (

                videos.map(
                  (video) => (
                    <div
                      key={
                        video.id
                      }
                      className="rounded-2xl border border-border/60 bg-card/60 p-4"
                    >

                      <div className="mb-2 flex items-start justify-between gap-3">

                        <div>

                          <p className="font-semibold">
                            {video.title}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {video.subject}
                          </p>

                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            deleteVideo(
                              video.id
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>

                      <p className="text-sm text-muted-foreground">
                        {
                          video.description
                        }
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">

                        <span>
                          {
                            video.teacherName
                          }
                        </span>

                        <span>
                          {new Date(
                            video.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      {video.videoUrl && (
                        <a
                          href={
                            video.videoUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Open video
                        </a>
                      )}

                    </div>
                  )
                )

              )}

            </div>

          </div>

        </div>

      </Card>

      {/* =====================================================
          LESSON ANALYTICS
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="glass p-6">

          <h3 className="mb-4 font-semibold">
            Lesson Analytics
          </h3>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  lessonAnalytics
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill:
                      'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tick={{
                    fill:
                      'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="lessons"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="assessments"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="reteaching"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </Card>

        {/* =====================================================
            RE-TEACHING
        ====================================================== */}

        <Card className="glass p-6">

          <h3 className="mb-4 font-semibold">
            Re-Teaching Sessions
          </h3>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  lessonAnalytics
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill:
                      'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tick={{
                    fill:
                      'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="reteaching"
                  fill="hsl(var(--warning))"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Card>

      </div>

      {/* =====================================================
          AI RECOMMENDATIONS
      ====================================================== */}

      <Card className="glass p-6">

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-accent" />

            <h3 className="font-semibold text-lg">
              AI Recommendations & Interventions
            </h3>
          </div>

          <span className="text-xs text-muted-foreground">
            Click any recommendation below to launch the interactive workspace
          </span>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {recommendations.map(
            (
              recommendation,
              i
            ) => {

              const Icon =
                recommendation.icon;

              const isRemedial =
                recommendation.type === 'remedial';

              return (
                <motion.div
                  key={i}
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
                      i * 0.1,
                  }}
                  onClick={() =>
                    handleRecommendationClick(
                      recommendation.type
                    )
                  }
                  className={cn(
                    'rounded-2xl border p-5 transition cursor-pointer flex flex-col justify-between group relative overflow-hidden',
                    isRemedial
                      ? 'border-primary/50 bg-gradient-to-b from-primary/15 via-muted/20 to-muted/10 hover:border-primary hover:shadow-[0_0_30px_rgba(0,210,255,0.25)]'
                      : 'border-border/60 bg-muted/20 hover:border-accent/50 hover:bg-muted/30 hover:shadow-md'
                  )}
                >

                  {isRemedial && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary">
                        FEATURED
                      </span>
                    </div>
                  )}

                  <div>
                    <div
                      className={cn(
                        'mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                        isRemedial
                          ? 'bg-primary/20 text-primary'
                          : 'bg-accent/15 text-accent'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="mb-1 text-sm font-bold text-white">

                      {lang === 'en'
                        ? recommendation.title
                        : recommendation.titleTe}

                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">

                      {lang === 'en'
                        ? recommendation.desc
                        : recommendation.descTe}

                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold">
                    <span className={cn(isRemedial ? 'text-primary' : 'text-accent')}>
                      {lang === 'en'
                        ? recommendation.actionLabel
                        : recommendation.actionLabelTe}
                    </span>
                    <PlayCircle className={cn('h-4 w-4 transition-transform group-hover:translate-x-1', isRemedial ? 'text-primary' : 'text-accent')} />
                  </div>

                </motion.div>
              );

            }
          )}

        </div>

      </Card>

      {/* =====================================================
          VISUAL ACTIVITY & RECOMMENDATION MODALS
      ====================================================== */}

      <VisualFractionStripsModal
        isOpen={isVisualModalOpen}
        onClose={() => setIsVisualModalOpen(false)}
        onAssignToStudents={(title) => {
          setToastMessage(`"${title}" has been assigned to students successfully!`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      <TeacherRecommendationsModal
        type={recommendationModalType}
        isOpen={recommendationModalType !== null}
        onClose={() => setRecommendationModalType(null)}
        onAssign={(_type, title) => {
          setToastMessage(`"${title}" has been assigned to students successfully!`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

    </div>
  );
}