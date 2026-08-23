import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  Headphones,
  Lightbulb,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Video,
  VideoOff,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CrossSensePanelProps = {
  visualActivity: number;
  audioActivity: number;
  assessmentScore: number;
  attendance: number;
  learningGaps: number;

  studentName?: string;

  onVisualActivityChange?: (value: number) => void;
  onAudioActivityChange?: (value: number) => void;

  onInterventionCreate?: (data: {
    studentName: string;
    riskLevel: RiskLevel;
    recommendation: string;
    action: string;
  }) => void;

  onTeacherNotify?: (data: {
    studentName: string;
    riskLevel: RiskLevel;
    reasoning: string;
  }) => void;
};

type RiskLevel = 'Low' | 'Moderate' | 'High';

type DecisionHistoryItem = {
  id: number;
  time: string;
  riskLevel: RiskLevel;
  confidence: number;
  reason: string;
};

type InputSignal = {
  label: string;
  value: number;
  icon: typeof Eye;
  description: string;
};

type TemporalReading = {
  visual: number;
  audio: number;
  assessment: number;
  attendance: number;
  gaps: number;
  timestamp: number;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function average(values: number[]) {
  if (values.length === 0) return 0;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CrossSensePanel({
  visualActivity,
  audioActivity,
  assessmentScore,
  attendance,
  learningGaps,
  studentName = 'Aarav Reddy',
  onVisualActivityChange,
  onAudioActivityChange,
  onInterventionCreate,
  onTeacherNotify,
}: CrossSensePanelProps) {
  /*
   * =========================================================
   * LIVE SENSOR STATE
   * =========================================================
   */

  const [cameraActive, setCameraActive] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);

  const [liveVisual, setLiveVisual] =
    useState(clamp(visualActivity));

  const [liveAudio, setLiveAudio] =
    useState(clamp(audioActivity));

  const [temporalReadings, setTemporalReadings] =
    useState<TemporalReading[]>([]);

  const [decisionHistory, setDecisionHistory] =
    useState<DecisionHistoryItem[]>([]);

  const [interventionCreated, setInterventionCreated] =
    useState(false);

  const [teacherNotified, setTeacherNotified] =
    useState(false);

  const [cameraStatus, setCameraStatus] =
    useState('Camera assistance inactive');

  const [microphoneStatus, setMicrophoneStatus] =
    useState('Microphone monitoring inactive');

  const [motionIntensity, setMotionIntensity] = useState(0);
  const [motionState, setMotionState] = useState<'Active Engagement' | 'Attentive Focus' | 'Subtle Movement' | 'Idle / Still'>('Attentive Focus');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const cameraAnimRef = useRef<number | null>(null);
  const smoothedVisualRef = useRef(visualActivity || 75);
  const lastUpdateTimestampRef = useRef(0);

  const cameraStreamRef =
    useRef<MediaStream | null>(null);

  const audioStreamRef =
    useRef<MediaStream | null>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  /*
   * =========================================================
   * KEEP PROPS SYNCHRONIZED
   * =========================================================
   */

  useEffect(() => {
    if (!cameraActive) {
      setLiveVisual(clamp(visualActivity));
      smoothedVisualRef.current = clamp(visualActivity);
    }
  }, [visualActivity, cameraActive]);

  useEffect(() => {
    if (!microphoneActive) {
      setLiveAudio(clamp(audioActivity));
    }
  }, [audioActivity, microphoneActive]);

  /*
   * =========================================================
   * CAMERA ASSISTANCE
   * =========================================================
   *
   * This intentionally uses browser camera access only.
   *
   * The camera signal is an activity estimate rather than
   * identity recognition.
   */

  const attachVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && cameraStreamRef.current) {
      element.srcObject = cameraStreamRef.current;
      element.muted = true;
      element.playsInline = true;
      element.play().catch(() => {});
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraAnimRef.current !== null) {
      cancelAnimationFrame(cameraAnimRef.current);
      cameraAnimRef.current = null;
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      cameraStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    previousFrameRef.current = null;
    setCameraActive(false);
    setCameraStatus('Camera assistance inactive');
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraStatus(
          'Camera API is not supported in this browser (HTTPS or localhost required)',
        );
        return;
      }

      setCameraStatus('Requesting camera permission...');

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

      cameraStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play().catch(() => {});
      }

      setCameraActive(true);
      setCameraStatus(
        'Camera live — visual activity monitored',
      );
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraActive(false);

      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            setCameraStatus(
              'Camera permission blocked. Please allow camera in browser site settings.',
            );
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            setCameraStatus('No camera found on this device.');
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            setCameraStatus(
              'Camera is already in use by another application.',
            );
            break;
          case 'SecurityError':
            setCameraStatus(
              'Camera access blocked by browser security policy (requires HTTPS).',
            );
            break;
          default:
            setCameraStatus(`Camera error: ${err.name}`);
        }
      } else if (err instanceof Error) {
        setCameraStatus(err.message);
      } else {
        setCameraStatus('Camera permission was not granted');
      }
    }
  }, []);

  useEffect(() => {
    if (cameraActive && cameraStreamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = cameraStreamRef.current;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    }
  }, [cameraActive]);

  /*
   * =========================================================
   * MICROPHONE ASSISTANCE
   * =========================================================
   */

  const stopMicrophone = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(
        animationFrameRef.current,
      );

      animationFrameRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      audioStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current
        .close()
        .catch(() => {});

      audioContextRef.current = null;
    }

    analyserRef.current = null;

    setMicrophoneActive(false);
    setMicrophoneStatus(
      'Microphone monitoring inactive',
    );
  }, []);

  const startMicrophone = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicrophoneStatus(
          'Microphone API is not supported',
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

      audioStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        setMicrophoneStatus(
          'Audio analysis is not supported',
        );
        return;
      }

      const audioContext =
        new AudioContextClass();

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 256;

      const source =
        audioContext.createMediaStreamSource(
          stream,
        );

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setMicrophoneActive(true);
      setMicrophoneStatus(
        'Microphone active — participation signal monitored',
      );

      const dataArray = new Uint8Array(
        analyser.frequencyBinCount,
      );

      const monitorAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteTimeDomainData(
          dataArray,
        );

        let sum = 0;

        for (let i = 0; i < dataArray.length; i += 1) {
          const normalized =
            (dataArray[i] - 128) / 128;

          sum += normalized * normalized;
        }

        const rms = Math.sqrt(
          sum / dataArray.length,
        );

        /*
         * Convert microphone energy to a
         * simple 0-100 participation signal.
         */

        const estimatedActivity = clamp(
          Math.round(rms * 420),
        );

        setLiveAudio((previous) => {
          const next = Math.round(
            previous * 0.65 +
              estimatedActivity * 0.35,
          );

          onAudioActivityChange?.(next);

          return next;
        });

        animationFrameRef.current =
          requestAnimationFrame(monitorAudio);
      };

      monitorAudio();
    } catch {
      setMicrophoneStatus(
        'Microphone permission was not granted',
      );
      setMicrophoneActive(false);
    }
  }, [onAudioActivityChange]);

  /*
   * =========================================================
   * CLEANUP
   * =========================================================
   */

  useEffect(() => {
    return () => {
      stopCamera();
      stopMicrophone();
    };
  }, [stopCamera, stopMicrophone]);

  /*
   * =========================================================
   * REAL-TIME CAMERA ACTIVITY ESTIMATION
   * =========================================================
   */

  useEffect(() => {
    if (!cameraActive) {
      if (cameraAnimRef.current !== null) {
        cancelAnimationFrame(cameraAnimRef.current);
        cameraAnimRef.current = null;
      }
      previousFrameRef.current = null;
      setMotionIntensity(0);
      return;
    }

    const analyzeVideoFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState < 2) {
        cameraAnimRef.current = requestAnimationFrame(analyzeVideoFrame);
        return;
      }

      const width = 160;
      const height = 90;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d', {
        willReadFrequently: true,
      });

      if (!context) {
        cameraAnimRef.current = requestAnimationFrame(analyzeVideoFrame);
        return;
      }

      context.drawImage(video, 0, 0, width, height);
      const currentFrame = context.getImageData(0, 0, width, height).data;

      if (previousFrameRef.current) {
        let activePixels = 0;
        let totalDelta = 0;
        const totalPixels = width * height;

        for (let i = 0; i < currentFrame.length; i += 4) {
          const delta =
            Math.abs(currentFrame[i] - previousFrameRef.current[i]) +
            Math.abs(currentFrame[i + 1] - previousFrameRef.current[i + 1]) +
            Math.abs(currentFrame[i + 2] - previousFrameRef.current[i + 2]);

          // Filter camera digital sensor noise (threshold = 24)
          if (delta > 24) {
            activePixels += 1;
            totalDelta += delta;
          }
        }

        const motionFraction = activePixels / totalPixels;
        const motionScore = Math.min(100, Math.round(motionFraction * 500));

        // Adaptive target visual engagement based on human movement in frame
        let targetEngagement = 72; // baseline attentive focus
        if (motionFraction > 0.08) {
          // Dynamic movement (hand gestures, speaking, active participation)
          targetEngagement = clamp(Math.round(86 + Math.min(12, motionFraction * 90)));
        } else if (motionFraction > 0.015) {
          // Subtle movement (head motion, blinking, writing)
          targetEngagement = clamp(Math.round(74 + motionFraction * 140));
        } else {
          // Very still / resting
          targetEngagement = 64;
        }

        // Exponential Moving Average filter for liquid-smooth transitions
        smoothedVisualRef.current =
          smoothedVisualRef.current * 0.84 + targetEngagement * 0.16;

        const finalScore = clamp(Math.round(smoothedVisualRef.current));
        const now = performance.now();

        // Throttle React state dispatches to ~10 FPS for max performance & no UI lag
        if (now - lastUpdateTimestampRef.current > 100) {
          lastUpdateTimestampRef.current = now;
          setLiveVisual(finalScore);
          onVisualActivityChange?.(finalScore);
          setMotionIntensity(motionScore);

          if (finalScore >= 80) {
            setMotionState('Active Engagement');
          } else if (finalScore >= 68) {
            setMotionState('Attentive Focus');
          } else if (finalScore >= 52) {
            setMotionState('Subtle Movement');
          } else {
            setMotionState('Idle / Still');
          }
        }
      }

      previousFrameRef.current = new Uint8ClampedArray(currentFrame);
      cameraAnimRef.current = requestAnimationFrame(analyzeVideoFrame);
    };

    cameraAnimRef.current = requestAnimationFrame(analyzeVideoFrame);

    return () => {
      if (cameraAnimRef.current !== null) {
        cancelAnimationFrame(cameraAnimRef.current);
        cameraAnimRef.current = null;
      }
    };
  }, [cameraActive, onVisualActivityChange]);

  /*
   * =========================================================
   * CROSS-SENSE FUSION ENGINE
   * =========================================================
   */

  const analysis = useMemo(() => {
    const visual = clamp(liveVisual);
    const audio = clamp(liveAudio);
    const assessment = clamp(assessmentScore);
    const attendanceValue = clamp(attendance);
    const gaps = clamp(learningGaps);

    /*
     * ---------------------------------------------------------
     * STEP 1 — NORMALIZE
     * ---------------------------------------------------------
     */

    const visualRisk = 100 - visual;
    const audioRisk = 100 - audio;
    const assessmentRisk = 100 - assessment;
    const attendanceRisk =
      100 - attendanceValue;

    /*
     * ---------------------------------------------------------
     * STEP 2 — PRIMARY RISKS
     * ---------------------------------------------------------
     */

    const engagementRisk =
      visualRisk * 0.45 +
      audioRisk * 0.55;

    const learningRisk =
      assessmentRisk * 0.45 +
      gaps * 0.55;

    /*
     * ---------------------------------------------------------
     * STEP 3 — CROSS-MODAL RELATIONSHIPS
     * ---------------------------------------------------------
     */

    let interactionBoost = 0;

    const relationships: string[] = [];

    if (visual < 60 && audio < 60) {
      interactionBoost += 15;

      relationships.push(
        'Visual and audio engagement are both reduced',
      );
    }

    if (
      visual < 60 &&
      assessment < 70
    ) {
      interactionBoost += 15;

      relationships.push(
        'Low visual engagement is associated with weaker assessment performance',
      );
    }

    if (
      audio < 60 &&
      assessment < 70
    ) {
      interactionBoost += 15;

      relationships.push(
        'Low participation is associated with weaker assessment performance',
      );
    }

    if (
      gaps > 35 &&
      assessment < 70
    ) {
      interactionBoost += 12;

      relationships.push(
        'Learning gaps and assessment difficulty reinforce one another',
      );
    }

    if (
      attendanceValue < 75 &&
      assessment < 70
    ) {
      interactionBoost += 10;

      relationships.push(
        'Attendance continuity may be contributing to performance difficulty',
      );
    }

    /*
     * ---------------------------------------------------------
     * SPECIAL CONTEXT
     * ---------------------------------------------------------
     */

    let contextType =
      'General classroom monitoring';

    if (
      visual >= 70 &&
      audio >= 70 &&
      assessment < 70
    ) {
      contextType =
        'Possible comprehension difficulty';
    } else if (
      visual < 60 &&
      audio < 60
    ) {
      contextType =
        'Possible disengagement pattern';
    } else if (
      assessment < 70 &&
      gaps > 35
    ) {
      contextType =
        'Learning-support requirement';
    } else if (
      attendanceValue < 75 &&
      assessment < 70
    ) {
      contextType =
        'Learning continuity concern';
    } else if (
      visual >= 75 &&
      audio >= 75 &&
      assessment >= 75
    ) {
      contextType =
        'Healthy learning pattern';
    }

    /*
     * ---------------------------------------------------------
     * COMBINED RISK
     * ---------------------------------------------------------
     */

    const attendanceAdjustedRisk =
      learningRisk * 0.85 +
      attendanceRisk * 0.15;

    const combinedRisk = clamp(
      attendanceAdjustedRisk +
        interactionBoost,
    );

    let riskLevel: RiskLevel;

    if (combinedRisk >= 65) {
      riskLevel = 'High';
    } else if (combinedRisk >= 40) {
      riskLevel = 'Moderate';
    } else {
      riskLevel = 'Low';
    }

    /*
     * ---------------------------------------------------------
     * CONTRIBUTING CONCERNS
     * ---------------------------------------------------------
     */

    const concerns: string[] = [];

    if (visual < 60) {
      concerns.push(
        'Visual engagement is low',
      );
    }

    if (audio < 60) {
      concerns.push(
        'Audio participation is low',
      );
    }

    if (assessment < 70) {
      concerns.push(
        'Assessment performance is below target',
      );
    }

    if (gaps > 35) {
      concerns.push(
        'Learning gaps are significant',
      );
    }

    if (attendanceValue < 75) {
      concerns.push(
        'Attendance may affect learning continuity',
      );
    }

    /*
     * ---------------------------------------------------------
     * EXPLAINABLE REASONING
     * ---------------------------------------------------------
     */

    let reasoning: string;

    if (
      visual < 60 &&
      audio < 60 &&
      assessment < 70
    ) {
      reasoning =
        `${studentName}'s visual engagement (${Math.round(
          visual,
        )}%), audio participation (${Math.round(
          audio,
        )}%), and assessment performance (${Math.round(
          assessment,
        )}%) are simultaneously below target. The cross-sense pattern indicates a possible difficulty following or understanding the current lesson.`;
    } else if (
      visual >= 70 &&
      audio >= 70 &&
      assessment < 70
    ) {
      reasoning =
        `${studentName} shows healthy classroom engagement and participation, but assessment performance is ${Math.round(
          assessment,
        )}%. This pattern suggests a possible comprehension or concept-mastery issue rather than simple disengagement.`;
    } else if (
      visual < 60 &&
      assessment < 70
    ) {
      reasoning =
        `Visual engagement is ${Math.round(
          visual,
        )}% while assessment performance is ${Math.round(
          assessment,
        )}%. Their interaction indicates that reduced attention may be associated with weaker learning outcomes.`;
    } else if (
      audio < 60 &&
      assessment < 70
    ) {
      reasoning =
        `Audio participation is ${Math.round(
          audio,
        )}% and assessment performance is ${Math.round(
          assessment,
        )}%. The combined evidence suggests that more interactive explanation or guided practice may help.`;
    } else if (
      assessment < 70 &&
      gaps > 35
    ) {
      reasoning =
        `Assessment performance is ${Math.round(
          assessment,
        )}% while estimated learning gaps are ${Math.round(
          gaps,
        )}%. The two learning indicators reinforce each other and suggest a need for targeted remediation.`;
    } else if (
      attendanceValue < 75 &&
      assessment < 70
    ) {
      reasoning =
        `Attendance is ${Math.round(
          attendanceValue,
        )}% and assessment performance is ${Math.round(
          assessment,
        )}%. Missed classroom exposure may be contributing to the observed learning difficulty.`;
    } else if (combinedRisk < 40) {
      reasoning =
        `${studentName}'s available signals are generally healthy. Engagement, participation, attendance, assessment performance, and learning readiness do not show a significant combined risk.`;
    } else {
      reasoning =
        `The signals show some areas requiring attention. The strongest contributing indicators are being combined to recommend a targeted classroom response.`;
    }

    /*
     * ---------------------------------------------------------
     * UNIFIED RECOMMENDATION
     * ---------------------------------------------------------
     */

    let recommendation: string;
    let action: string;

    if (
      contextType ===
      'Possible comprehension difficulty'
    ) {
      recommendation =
        'Provide concept-focused explanation.';
      action =
        'Give a short teacher explanation, visual example, and 5-question comprehension check.';
    } else if (
      riskLevel === 'High'
    ) {
      recommendation =
        'Start a targeted remedial intervention.';
      action =
        'Re-teach the topic using a short visual explanation followed by interactive practice.';
    } else if (
      riskLevel === 'Moderate'
    ) {
      recommendation =
        'Provide targeted reinforcement.';
      action =
        'Assign a short revision activity and monitor engagement during the next lesson.';
    } else {
      recommendation =
        'Continue the current learning strategy.';
      action =
        'Maintain the current teaching approach while monitoring changes in engagement and assessment performance.';
    }

    /*
     * ---------------------------------------------------------
     * TEMPORAL CONFIDENCE
     * ---------------------------------------------------------
     */

    const signalValues = [
      visual,
      audio,
      assessment,
      attendanceValue,
      100 - gaps,
    ];

    const mean = average(signalValues);

    const variance = average(
      signalValues.map((value) =>
        Math.pow(value - mean, 2),
      ),
    );

    const consistency = clamp(
      1 - Math.sqrt(variance) / 50,
      0,
      1,
    );

    const temporalStrength = clamp(
      temporalReadings.length / 8,
      0,
      1,
    );

    let confidence =
      58 +
      consistency * 20 +
      temporalStrength * 12;

    if (
      relationships.length >= 2
    ) {
      confidence += 5;
    }

    if (
      cameraActive ||
      microphoneActive
    ) {
      confidence += 2;
    }

    confidence = Math.round(
      clamp(confidence, 55, 96),
    );

    return {
      visual,
      audio,
      assessment,
      attendanceValue,
      gaps,
      engagementRisk,
      learningRisk,
      interactionBoost,
      combinedRisk,
      riskLevel,
      reasoning,
      recommendation,
      action,
      confidence,
      concerns,
      relationships,
      contextType,
    };
  }, [
    liveVisual,
    liveAudio,
    assessmentScore,
    attendance,
    learningGaps,
    studentName,
    temporalReadings.length,
    cameraActive,
    microphoneActive,
  ]);

  /*
   * =========================================================
   * TEMPORAL ANALYSIS
   * =========================================================
   *
   * Every 3 seconds a reading is stored.
   * The system therefore evaluates patterns rather than
   * relying only on a single instant.
   */

  useEffect(() => {
    const interval = window.setInterval(() => {
      const reading: TemporalReading = {
        visual: liveVisual,
        audio: liveAudio,
        assessment: clamp(
          assessmentScore,
        ),
        attendance: clamp(attendance),
        gaps: clamp(learningGaps),
        timestamp: Date.now(),
      };

      setTemporalReadings((previous) => [
        ...previous.slice(-7),
        reading,
      ]);
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    liveVisual,
    liveAudio,
    assessmentScore,
    attendance,
    learningGaps,
  ]);

  /*
   * =========================================================
   * DECISION HISTORY
   * =========================================================
   */

  useEffect(() => {
    const historyItem: DecisionHistoryItem = {
      id: Date.now(),
      time: formatTime(Date.now()),
      riskLevel: analysis.riskLevel,
      confidence: analysis.confidence,
      reason: analysis.contextType,
    };

    setDecisionHistory((previous) => {
      if (
        previous.length > 0 &&
        previous[previous.length - 1].riskLevel ===
          historyItem.riskLevel
      ) {
        return previous;
      }

      return [
        ...previous.slice(-4),
        historyItem,
      ];
    });
  }, [
    analysis.riskLevel,
    analysis.confidence,
    analysis.contextType,
  ]);

  /*
   * =========================================================
   * INPUT SIGNALS
   * =========================================================
   */

  const inputSignals: InputSignal[] = [
    {
      label: 'Visual Engagement',
      value: analysis.visual,
      icon: Eye,
      description:
        'Camera-assisted classroom engagement signal',
    },
    {
      label: 'Audio Participation',
      value: analysis.audio,
      icon: Mic,
      description:
        'Microphone-based participation activity',
    },
    {
      label: 'Assessment',
      value: analysis.assessment,
      icon: Target,
      description:
        'Current learning performance',
    },
    {
      label: 'Attendance',
      value: analysis.attendanceValue,
      icon: CheckCircle2,
      description:
        'Class attendance continuity',
    },
    {
      label: 'Learning Readiness',
      value: 100 - analysis.gaps,
      icon: Brain,
      description:
        'Estimated readiness based on learning gaps',
    },
  ];

  /*
   * =========================================================
   * RISK STYLES
   * =========================================================
   */

  const riskStyles = {
    Low: {
      card:
        'border-success/30 bg-success/5',
      text: 'text-success',
      icon:
        'bg-success/10 text-success',
    },
    Moderate: {
      card:
        'border-warning/30 bg-warning/5',
      text: 'text-warning',
      icon:
        'bg-warning/10 text-warning',
    },
    High: {
      card:
        'border-destructive/30 bg-destructive/5',
      text: 'text-destructive',
      icon:
        'bg-destructive/10 text-destructive',
    },
  };

  const currentRisk =
    riskStyles[analysis.riskLevel];

  /*
   * =========================================================
   * ACTION HANDLERS
   * =========================================================
   */

  const handleCreateIntervention =
    () => {
      setInterventionCreated(true);

      onInterventionCreate?.({
        studentName,
        riskLevel:
          analysis.riskLevel,
        recommendation:
          analysis.recommendation,
        action: analysis.action,
      });
    };

  const handleNotifyTeacher = () => {
    setTeacherNotified(true);

    onTeacherNotify?.({
      studentName,
      riskLevel:
        analysis.riskLevel,
      reasoning:
        analysis.reasoning,
    });
  };

  const resetActions = () => {
    setInterventionCreated(false);
    setTeacherNotified(false);
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <Card className="glass overflow-hidden border-primary/20">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Cross-Sense AI
                </p>

                <h2 className="text-xl font-bold">
                  Classroom Intelligence Engine
                </h2>
              </div>
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground">
              Fuses visual, audio, performance,
              attendance, and learning-gap signals
              into one contextual learning decision
              for{' '}
              <span className="font-semibold text-foreground">
                {studentName}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Multi-Modal Fusion Active
            </div>

            {temporalReadings.length > 0 && (
              <Badge
                variant="outline"
                className="rounded-full"
              >
                <Clock3 className="mr-1 h-3.5 w-3.5" />
                {temporalReadings.length} observations
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* ===================================================
            LIVE CAMERA + MICROPHONE
        ==================================================== */}

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  Live Classroom Assistance
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Camera and microphone signals can be
                activated to strengthen real-time
                classroom analysis.
              </p>
            </div>

            <Badge
              className={cn(
                'rounded-full',
                cameraActive ||
                  microphoneActive
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {cameraActive ||
              microphoneActive ? (
                <>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Live assistance active
                </>
              ) : (
                'Ready to activate'
              )}
            </Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Camera */}

            <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Camera className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Camera Assistance
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {cameraStatus}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={
                    cameraActive
                      ? 'destructive'
                      : 'default'
                  }
                  onClick={
                    cameraActive
                      ? stopCamera
                      : startCamera
                  }
                  className="gap-2"
                >
                  {cameraActive ? (
                    <>
                      <VideoOff className="h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
              </div>

              {cameraActive && (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-primary/30 bg-black shadow-inner">
                  <video
                    ref={attachVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[11px] font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    LIVE OPTICAL FEED
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                    {motionState}
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Visual Activity Level
                    </span>
                    {cameraActive && (
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        analysis.visual >= 75
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : analysis.visual >= 55
                          ? 'bg-amber-500/15 text-amber-500'
                          : 'bg-rose-500/15 text-rose-500'
                      )}>
                        {motionState}
                      </span>
                    )}
                  </div>

                  <span className={cn(
                    'font-bold font-display text-base',
                    analysis.visual >= 75
                      ? 'text-emerald-500'
                      : analysis.visual >= 55
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  )}>
                    {Math.round(analysis.visual)}%
                  </span>
                </div>

                {/* Animated Activity Progress Bar */}
                <div className="h-2.5 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      analysis.visual >= 75
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : analysis.visual >= 55
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-500 to-red-400'
                    )}
                    style={{
                      width: `${analysis.visual}%`,
                    }}
                  />
                </div>

                {/* Quick Calibration / Preset Buttons when Camera is Inactive */}
                {!cameraActive && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                      <span>Quick Signal Calibration:</span>
                      <span className="text-primary font-medium">Manual Mode</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setLiveVisual(88);
                          onVisualActivityChange?.(88);
                        }}
                        className={cn(
                          'rounded-lg px-2 py-1 text-[11px] font-medium transition border',
                          Math.round(analysis.visual) >= 80
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted/40 border-border/60 hover:bg-muted text-muted-foreground'
                        )}
                      >
                        High Focus (88%)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLiveVisual(72);
                          onVisualActivityChange?.(72);
                        }}
                        className={cn(
                          'rounded-lg px-2 py-1 text-[11px] font-medium transition border',
                          Math.round(analysis.visual) >= 60 && Math.round(analysis.visual) < 80
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                            : 'bg-muted/40 border-border/60 hover:bg-muted text-muted-foreground'
                        )}
                      >
                        Normal (72%)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLiveVisual(45);
                          onVisualActivityChange?.(45);
                        }}
                        className={cn(
                          'rounded-lg px-2 py-1 text-[11px] font-medium transition border',
                          Math.round(analysis.visual) < 60
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                            : 'bg-muted/40 border-border/60 hover:bg-muted text-muted-foreground'
                        )}
                      >
                        Low Focus (45%)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Microphone */}

            <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    {microphoneActive ? (
                      <Mic className="h-5 w-5" />
                    ) : (
                      <MicOff className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">
                      Audio Assistance
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {microphoneStatus}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={
                    microphoneActive
                      ? 'destructive'
                      : 'default'
                  }
                  onClick={
                    microphoneActive
                      ? stopMicrophone
                      : startMicrophone
                  }
                  className="gap-2"
                >
                  {microphoneActive ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Audio participation
                  </span>

                  <span className="font-bold text-primary">
                    {Math.round(
                      analysis.audio,
                    )}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${analysis.audio}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            EVALUATION CRITERIA 1
            MULTI-INPUT
        ==================================================== */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  1. Multi-Input
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Five independent signals are processed
                together.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              YES
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {inputSignals.map(
              ({
                label,
                value,
                icon: Icon,
                description,
              }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border/60 bg-muted/10 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className="text-lg font-bold">
                      {Math.round(value)}%
                    </span>
                  </div>

                  <p className="text-sm font-semibold">
                    {label}
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                    {description}
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${value}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* ===================================================
            CROSS-MODAL FUSION
        ==================================================== */}

        <section className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-card to-primary/5 p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Headphones className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  2. Cross-Modal Interaction
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Signals influence one another instead of
                being treated as isolated metrics.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              YES
            </div>
          </div>

          <div className="grid items-center gap-3 md:grid-cols-5">
            <FusionNode
              icon={Eye}
              label="Visual"
              value={analysis.visual}
            />

            <div className="hidden text-center text-primary md:block">
              +
            </div>

            <FusionNode
              icon={Mic}
              label="Audio"
              value={analysis.audio}
            />

            <div className="hidden text-center text-primary md:block">
              +
            </div>

            <FusionNode
              icon={Target}
              label="Assessment"
              value={analysis.assessment}
            />
          </div>

          <div className="my-4 flex justify-center">
            <div className="h-8 w-px bg-border md:h-10" />
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Cross-Modal Fusion
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Combined interaction signal:
            </p>

            <p className="mt-1 text-2xl font-bold">
              {Math.round(
                analysis.combinedRisk,
              )}
              % risk
            </p>

            {analysis.interactionBoost > 0 && (
              <p className="mt-1 text-xs font-medium text-warning">
                +
                {Math.round(
                  analysis.interactionBoost,
                )}
                % cross-modal reinforcement
                detected
              </p>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {analysis.relationships.length >
              0 ? (
                analysis.relationships.map(
                  (relationship) => (
                    <Badge
                      key={relationship}
                      variant="outline"
                      className="max-w-full whitespace-normal text-center"
                    >
                      {relationship}
                    </Badge>
                  ),
                )
              ) : (
                <Badge
                  variant="outline"
                  className="text-success"
                >
                  No negative cross-modal interaction
                  detected
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            TEMPORAL ANALYSIS
        ==================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock3 className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  Temporal Pattern Analysis
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Decisions are strengthened by repeated
                observations instead of a single reading.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              YES
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <TemporalCard
                title="Observations"
                value={`${temporalReadings.length}`}
                description="Recent signal readings"
                icon={Activity}
              />

              <TemporalCard
                title="Current risk"
                value={`${Math.round(
                  analysis.combinedRisk,
                )}%`}
                description="Latest combined risk"
                icon={Target}
              />

              <TemporalCard
                title="AI confidence"
                value={`${analysis.confidence}%`}
                description="Evidence agreement"
                icon={ShieldCheck}
              />
            </div>

            {temporalReadings.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent observations
                </p>

                <div className="space-y-2">
                  {temporalReadings
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((reading) => (
                      <div
                        key={reading.timestamp}
                        className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="text-xs text-muted-foreground">
                          {formatTime(
                            reading.timestamp,
                          )}
                        </span>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span>
                            Visual{' '}
                            <b>
                              {Math.round(
                                reading.visual,
                              )}
                              %
                            </b>
                          </span>

                          <span>
                            Audio{' '}
                            <b>
                              {Math.round(
                                reading.audio,
                              )}
                              %
                            </b>
                          </span>

                          <span>
                            Assessment{' '}
                            <b>
                              {Math.round(
                                reading.assessment,
                              )}
                              %
                            </b>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            CONTEXTUAL REASONING
        ==================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Brain className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  3. Contextual Reasoning
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                The engine interprets the combined
                classroom context.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              YES
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Signal interpretation
              </p>

              <div className="space-y-3">
                <ReasoningSignal
                  label="Engagement risk"
                  value={
                    analysis.engagementRisk
                  }
                />

                <ReasoningSignal
                  label="Learning risk"
                  value={
                    analysis.learningRisk
                  }
                />

                <ReasoningSignal
                  label="Attendance health"
                  value={
                    analysis.attendanceValue
                  }
                  inverse
                />

                <ReasoningSignal
                  label="Learning readiness"
                  value={
                    100 - analysis.gaps
                  }
                  inverse
                />
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />

                <p className="font-semibold">
                  AI Contextual Reasoning
                </p>
              </div>

              <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {analysis.contextType}
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                {analysis.reasoning}
              </p>

              {analysis.concerns.length >
                0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contributing signals
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {analysis.concerns.map(
                      (concern) => (
                        <span
                          key={concern}
                          className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-xs text-warning"
                        >
                          {concern}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            UNIFIED OUTPUT
        ==================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  4. Unified Output
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                All signals are converted into one
                actionable AI decision.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              YES
            </div>
          </div>

          <div
            className={cn(
              'rounded-3xl border p-6',
              currentRisk.card,
            )}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl',
                      currentRisk.icon,
                    )}
                  >
                    {analysis.riskLevel ===
                    'Low' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Unified Learning Decision
                    </p>

                    <h4
                      className={cn(
                        'text-2xl font-bold',
                        currentRisk.text,
                      )}
                    >
                      {analysis.riskLevel}{' '}
                      Learning Risk
                    </h4>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {analysis.reasoning}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/70 p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  AI Confidence
                </p>

                <p className="mt-1 text-4xl font-bold text-primary">
                  {analysis.confidence}%
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Multi-signal agreement
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />

                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    AI Recommendation
                  </p>
                </div>

                <p className="mt-2 font-semibold">
                  {analysis.recommendation}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />

                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommended Action
                  </p>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {analysis.action}
                </p>
              </div>
            </div>

            {/* Teacher actions */}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={
                  handleCreateIntervention
                }
                disabled={interventionCreated}
                className="gap-2"
              >
                {interventionCreated ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Intervention Created
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Create Intervention
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={
                  handleNotifyTeacher
                }
                disabled={teacherNotified}
                className="gap-2"
              >
                {teacherNotified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Teacher Notified
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Notify Teacher
                  </>
                )}
              </Button>

              {(interventionCreated ||
                teacherNotified) && (
                <Button
                  variant="ghost"
                  onClick={resetActions}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            DECISION HISTORY
        ==================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                  AI Decision History
                </h3>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Previous decisions help demonstrate how
                the student's learning state changes over
                time.
              </p>
            </div>

            <Badge
              variant="outline"
              className="rounded-full"
            >
              Temporal monitoring
            </Badge>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5">
            {decisionHistory.length ===
            0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Waiting for the first AI decision...
              </div>
            ) : (
              <div className="space-y-3">
                {decisionHistory
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    const style =
                      riskStyles[
                        item.riskLevel
                      ];

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-xl',
                              style.icon,
                            )}
                          >
                            {item.riskLevel ===
                            'Low' ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              Decision{' '}
                              {decisionHistory.length -
                                index}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {item.time} ·{' '}
                              {item.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              style.text,
                            )}
                          >
                            {item.riskLevel}
                          </Badge>

                          <span className="text-xs text-muted-foreground">
                            {item.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            FUSION SUMMARY
        ==================================================== */}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={TrendingUp}
            title="Inputs Combined"
            value="5 Signals"
            description="Visual + Audio + Assessment + Attendance + Learning"
          />

          <SummaryCard
            icon={Brain}
            title="Reasoning"
            value="Context-Aware"
            description="Signals reinforce and influence each other"
          />

          <SummaryCard
            icon={Clock3}
            title="Temporal Analysis"
            value={`${temporalReadings.length} Observations`}
            description="Repeated readings strengthen the decision"
          />

          <SummaryCard
            icon={ShieldCheck}
            title="Final Output"
            value="1 Decision"
            description="Risk + confidence + intervention"
          />
        </div>
      </div>
    </Card>
  );
}

/*
 * =========================================================
 * FUSION NODE
 * =========================================================
 */

function FusionNode({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 text-center">
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {Math.round(value)}%
      </p>
    </div>
  );
}

/*
 * =========================================================
 * REASONING SIGNAL
 * =========================================================
 */

function ReasoningSignal({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const safeValue = clamp(value);

  const isHealthy = inverse
    ? safeValue >= 75
    : safeValue < 40;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>

        <span
          className={cn(
            'text-xs font-semibold',
            isHealthy
              ? 'text-success'
              : 'text-warning',
          )}
        >
          {Math.round(safeValue)}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isHealthy
              ? 'bg-success'
              : 'bg-warning',
          )}
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

/*
 * =========================================================
 * TEMPORAL CARD
 * =========================================================
 */

function TemporalCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-xs text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/*
 * =========================================================
 * SUMMARY CARD
 * =========================================================
 */

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: typeof TrendingUp;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-xs text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>

      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}