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
    icon: FileText,
    title: 'Worksheet',
    titleTe: 'వర్క్‌షీట్',
    desc:
      'Adding fractions — 20 problems, auto-generated',
    descTe:
      'భిన్నాల సంకలనం — 20 సమస్యలు',
  },
  {
    icon: Sparkles,
    title: 'Remedial Activity',
    titleTe: 'ప్రతివిధి కార్యకలాపం',
    desc:
      'Fraction strips hands-on exercise',
    descTe:
      'భిన్నం పట్టీల ఆచరణీయ వ్యాయామం',
  },
  {
    icon: BookOpen,
    title: 'Homework',
    titleTe: 'హోంవర్క్',
    desc:
      'Daily 5 fraction problems with solutions',
    descTe:
      'రోజుకు 5 భిన్నం సమస్యలు',
  },
  {
    icon: UsersRound,
    title: 'Group Activity',
    titleTe: 'సమూహ కార్యకలాపం',
    desc:
      'Pizza fraction puzzle in teams of 4',
    descTe:
      'పిజ్జా భిన్నం పజిల్ — 4 జట్టులు',
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
     LOAD VIDEOS
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     VIDEO COUNT
  ------------------------------------------------------- */

  const videoCountText =
    useMemo(() => {
      if (videos.length === 1) {
        return '1 explanation available to students';
      }

      return `${videos.length} explanations available to students`;
    }, [videos.length]);

  /* -------------------------------------------------------
     FILE SELECT
  ------------------------------------------------------- */

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

    /*
      Important:
      Do NOT use URL.createObjectURL()
      for the saved value.

      Object URLs are temporary and
      cannot reliably be shared through
      localStorage.

      The file is converted to a data URL
      when publishing.
    */

    setVideoUrl('');
  };

  /* -------------------------------------------------------
     PUBLISH VIDEO
  ------------------------------------------------------- */

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

        /*
          If teacher uploaded a file,
          convert it into a persistent
          data URL for this demo.
        */

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

        /* Reset form */

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

  /* -------------------------------------------------------
     DELETE VIDEO
  ------------------------------------------------------- */

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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">
            {t('nav.teacher')}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          AI Control Center
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Premium teaching intelligence dashboard
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {teacherCards.map((card, index) => {
          const Icon = iconMap[card.icon] ?? School;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
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

                <div className="text-xs text-muted-foreground">{tr(card.label)}</div>
                <div className="font-display text-3xl font-bold">
                  {card.value}
                  {card.suffix ?? ''}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {aiInsights.map((insight, index) => {
          const Icon = iconMap[insight.icon] ?? Lightbulb;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn('glass border p-5', toneClasses[insight.tone])}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-current/10">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="mb-1 text-xs text-muted-foreground">{tr(insight.label)}</div>
                <div className="font-semibold">{tr(insight.value)}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass overflow-hidden border-accent/20">
        <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-transparent p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Video className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Teacher Video Explanations</h2>
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
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">
            <div className="mb-5 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Add Video Explanation</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="video-title" className="mb-1.5 block text-sm font-medium">
                  Video title
                </label>
                <Input
                  id="video-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: Understanding Fractions"
                />
              </div>

              <div>
                <label htmlFor="video-subject" className="mb-1.5 block text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="video-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Mathematics"
                />
              </div>

              <div>
                <label htmlFor="video-description" className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <Input
                  id="video-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short explanation summary"
                />
              </div>

              <div>
                <label htmlFor="video-url" className="mb-1.5 block text-sm font-medium">
                  Video URL
                </label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div>
                <label htmlFor="teacher-video-file" className="mb-1.5 block text-sm font-medium">
                  Or upload a video file
                </label>
                <Input
                  id="teacher-video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFile}
                />
              </div>

              {message && (
                <div
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm',
                    messageType === 'success'
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'border-destructive/30 bg-destructive/10 text-destructive'
                  )}
                >
                  {message}
                </div>
              )}

              <Button onClick={addVideoExplanation} disabled={isSaving} className="w-full">
                {isSaving ? 'Publishing...' : 'Publish explanation'}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">
            <div className="mb-5 flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Student Access</h3>
            </div>

            <div className="space-y-3">
              {videos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                  No explanations published yet.
                </div>
              ) : (
                videos.map((video) => (
                  <div key={video.id} className="rounded-2xl border border-border/60 bg-card/60 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.subject}</p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">{video.description}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.teacherName}</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>

                    {video.videoUrl && (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Open video
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass p-6">
          <h3 className="mb-4 font-semibold">Lesson Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lessonAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="lessons" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="assessments" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="reteaching" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="mb-4 font-semibold">Re-Teaching Sessions</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lessonAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="reteaching" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="glass p-6">
        <div className="mb-4 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">AI Recommendations</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((recommendation, i) => {
            const Icon = recommendation.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/60 bg-muted/20 p-4 transition hover:border-accent/40"
              >
                <Icon className="mb-2 h-5 w-5 text-accent" />
                <div className="mb-1 text-sm font-semibold">
                  {lang === 'en' ? recommendation.title : recommendation.titleTe}
                </div>
                <p className="text-xs text-muted-foreground">
                  {lang === 'en' ? recommendation.desc : recommendation.descTe}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}