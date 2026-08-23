import { useMemo } from 'react';
import {
  Brain,
  Camera,
  Mic,
  ClipboardCheck,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Activity,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

import {
  analyzeCrossSense,
} from '@/lib/crossSenseEngine';

import CameraAssistant from '@/components/CameraAssistant';
import AudioAssistant from '@/components/AudioAssistant';

type CrossSensePanelProps = {
  visualActivity: number;
  audioActivity: number;
  assessmentScore: number;
  attendance: number;
  learningGaps: number;
  onVisualActivityChange: (value: number) => void;
  onAudioActivityChange: (value: number) => void;
};

export default function CrossSensePanel({
  visualActivity,
  audioActivity,
  assessmentScore,
  attendance,
  learningGaps,
  onVisualActivityChange,
  onAudioActivityChange,
}: CrossSensePanelProps) {
  const result = useMemo(
    () =>
      analyzeCrossSense({
        visualActivity,
        audioActivity,
        assessmentScore,
        attendance,
        learningGaps,
      }),
    [
      visualActivity,
      audioActivity,
      assessmentScore,
      attendance,
      learningGaps,
    ]
  );

  const statusText =
    result.status === 'high'
      ? 'HIGH RISK'
      : result.status === 'moderate'
        ? 'MONITOR'
        : 'HEALTHY';

  return (
    <div className="space-y-6">

      {/* MAIN HEADER */}

      <Card className="glass overflow-hidden border-primary/20">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Brain className="h-5 w-5 text-primary" />
                </div>

                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  CROSS-SENSE AI
                </Badge>
              </div>

              <CardTitle className="text-2xl">
                Smart Classroom Intelligence
              </CardTitle>

              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Combines classroom activity, audio activity,
                assessment performance, attendance and learning
                gaps to produce a contextual learning signal.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-success" />

              <div>
                <p className="text-xs text-muted-foreground">
                  AI Confidence
                </p>

                <p className="font-bold">
                  {result.confidence}%
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* INPUTS */}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <SignalCard
              icon={Camera}
              title="Visual Activity"
              value={visualActivity}
              signal={result.signals.visual}
            />

            <SignalCard
              icon={Mic}
              title="Audio Activity"
              value={audioActivity}
              signal={result.signals.audio}
            />

            <SignalCard
              icon={ClipboardCheck}
              title="Assessment"
              value={assessmentScore}
              signal={result.signals.learning}
            />

            <SignalCard
              icon={CalendarDays}
              title="Attendance"
              value={attendance}
              signal={result.signals.attendance}
            />

          </div>

          {/* FUSION */}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Activity className="h-4 w-4 text-primary" />

              <span className="text-xs font-semibold text-primary">
                MULTI-MODAL FUSION
              </span>
            </div>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* RESULT */}

          <div
            className={cn(
              'rounded-2xl border p-5',
              result.status === 'high' &&
                'border-destructive/30 bg-destructive/5',

              result.status === 'moderate' &&
                'border-warning/30 bg-warning/5',

              result.status === 'low' &&
                'border-success/30 bg-success/5'
            )}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

              <div className="flex flex-1 items-start gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',

                    result.status === 'high' &&
                      'bg-destructive/10 text-destructive',

                    result.status === 'moderate' &&
                      'bg-warning/10 text-warning',

                    result.status === 'low' &&
                      'bg-success/10 text-success'
                  )}
                >
                  {result.status === 'high' ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {result.status === 'high'
                        ? 'Contextual Learning Difficulty Detected'
                        : result.status === 'moderate'
                          ? 'Learning Signals Need Monitoring'
                          : 'Classroom Learning Signals Are Healthy'}
                    </h3>

                    <Badge
                      variant="outline"
                      className={cn(
                        result.status === 'high' &&
                          'border-destructive/30 text-destructive',

                        result.status === 'moderate' &&
                          'border-warning/30 text-warning',

                        result.status === 'low' &&
                          'border-success/30 text-success'
                      )}
                    >
                      {statusText}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {result.reasoning}
                  </p>
                </div>
              </div>

              {/* RISK */}

              <div className="min-w-[180px] rounded-xl bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Learning Risk
                  </span>

                  <span className="font-bold">
                    {result.learningRisk}%
                  </span>
                </div>

                <Progress
                  value={result.learningRisk}
                  className="mt-3 h-2"
                />

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Engagement
                  </span>

                  <span>
                    {result.engagementScore}%
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* RECOMMENDATION */}

          <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />

              <h3 className="font-semibold">
                AI Recommendation
              </h3>
            </div>

            <div className="mt-4 space-y-2">
              {result.recommendation.map(
                (recommendation, index) => (
                  <div
                    key={recommendation}
                    className="flex items-start gap-3 rounded-xl bg-background/50 p-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6">
                      {recommendation}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* LIVE INPUTS */}

      <div className="grid gap-6 lg:grid-cols-2">

        <CameraAssistant
          onActivityChange={
            onVisualActivityChange
          }
        />

        <AudioAssistant
          onActivityChange={
            onAudioActivityChange
          }
        />

      </div>

      {/* EXPLANATION */}

      <Card className="glass">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Brain className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h3 className="font-semibold">
                How Cross-Sense AI works
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The system does not treat a single signal as
                proof of a learning problem. It combines
                multiple independent signals and looks for
                agreement between them. This allows the teacher
                to distinguish a temporary change in classroom
                activity from a stronger indication that students
                may need instructional support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function SignalCard({
  icon: Icon,
  title,
  value,
  signal,
}: {
  icon: typeof Camera;
  title: string;
  value: number;
  signal: 'positive' | 'neutral' | 'negative';
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <span
          className={cn(
            'h-2 w-2 rounded-full',

            signal === 'positive' &&
              'bg-success',

            signal === 'neutral' &&
              'bg-warning',

            signal === 'negative' &&
              'bg-destructive'
          )}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}%
      </p>
    </div>
  );
}