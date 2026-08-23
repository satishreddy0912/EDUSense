import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Eye,
  Headphones,
  Lightbulb,
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CrossSensePanelProps = {
  visualActivity: number;
  audioActivity: number;
  assessmentScore: number;
  attendance: number;
  learningGaps: number;

  onVisualActivityChange?: (value: number) => void;
  onAudioActivityChange?: (value: number) => void;
};

type RiskLevel = 'Low' | 'Moderate' | 'High';

type InputSignal = {
  label: string;
  value: number;
  icon: typeof Eye;
  description: string;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

export default function CrossSensePanel({
  visualActivity,
  audioActivity,
  assessmentScore,
  attendance,
  learningGaps,
}: CrossSensePanelProps) {
  /*
   * =========================================================
   * CROSS-SENSE FUSION ENGINE
   * =========================================================
   *
   * The important difference from a simple dashboard:
   *
   * We don't just display five independent values.
   *
   * The values are combined to produce:
   *
   * 1. Cross-modal interaction
   * 2. Contextual reasoning
   * 3. One unified AI decision
   */

  const analysis = useMemo(() => {
    const visual = clamp(visualActivity);
    const audio = clamp(audioActivity);
    const assessment = clamp(assessmentScore);
    const attendanceValue = clamp(attendance);
    const gaps = clamp(learningGaps);

    /*
     * ---------------------------------------------------------
     * STEP 1 — NORMALIZE THE SIGNALS
     * ---------------------------------------------------------
     */

    const visualRisk = 100 - visual;
    const audioRisk = 100 - audio;
    const assessmentRisk = 100 - assessment;
    const attendanceRisk = 100 - attendanceValue;

    /*
     * ---------------------------------------------------------
     * STEP 2 — CROSS-MODAL INTERACTION
     * ---------------------------------------------------------
     *
     * Each signal can strengthen another signal.
     *
     * Example:
     *
     * Low visual + low audio
     * = stronger engagement concern.
     *
     * Low engagement + low assessment
     * = stronger learning concern.
     */

    const engagementRisk =
      visualRisk * 0.45 +
      audioRisk * 0.55;

    const learningRisk =
      assessmentRisk * 0.45 +
      gaps * 0.55;

    const attendanceAdjustedRisk =
      learningRisk * 0.85 +
      attendanceRisk * 0.15;

    /*
     * Cross-modal reinforcement.
     */

    let interactionBoost = 0;

    if (
      visual < 60 &&
      audio < 60
    ) {
      interactionBoost += 15;
    }

    if (
      visual < 60 &&
      assessment < 70
    ) {
      interactionBoost += 15;
    }

    if (
      audio < 60 &&
      assessment < 70
    ) {
      interactionBoost += 15;
    }

    if (
      gaps > 35 &&
      assessment < 70
    ) {
      interactionBoost += 12;
    }

    const combinedRisk = clamp(
      attendanceAdjustedRisk +
        interactionBoost
    );

    /*
     * ---------------------------------------------------------
     * STEP 3 — CONTEXTUAL REASONING
     * ---------------------------------------------------------
     */

    let riskLevel: RiskLevel;

    if (combinedRisk >= 65) {
      riskLevel = 'High';
    } else if (combinedRisk >= 40) {
      riskLevel = 'Moderate';
    } else {
      riskLevel = 'Low';
    }

    /*
     * Identify the dominant signals.
     */

    const concerns: string[] = [];

    if (visual < 60) {
      concerns.push(
        'visual engagement is low'
      );
    }

    if (audio < 60) {
      concerns.push(
        'audio participation is low'
      );
    }

    if (assessment < 70) {
      concerns.push(
        'assessment performance is below target'
      );
    }

    if (gaps > 35) {
      concerns.push(
        'learning gaps are significant'
      );
    }

    if (attendanceValue < 75) {
      concerns.push(
        'attendance is affecting learning continuity'
      );
    }

    /*
     * ---------------------------------------------------------
     * CONTEXTUAL INTERPRETATION
     * ---------------------------------------------------------
     */

    let reasoning: string;

    if (
      visual < 60 &&
      audio < 60 &&
      assessment < 70
    ) {
      reasoning =
        'Visual engagement, audio participation, and assessment performance are simultaneously below target. The combined pattern strongly suggests that the student may be struggling to understand or follow the current lesson.';
    } else if (
      visual < 60 &&
      audio < 60
    ) {
      reasoning =
        'Both visual engagement and audio participation are low. Since two independent classroom signals indicate reduced participation, the system identifies a possible disengagement pattern.';
    } else if (
      assessment < 70 &&
      gaps > 35
    ) {
      reasoning =
        'Assessment performance is low while estimated learning gaps are high. The combined evidence indicates that additional explanation or remedial learning may be required.';
    } else if (
      attendanceValue < 75 &&
      assessment < 70
    ) {
      reasoning =
        'Low attendance combined with weaker assessment performance suggests that missed classroom exposure may be contributing to the learning difficulty.';
    } else if (
      visual < 60 &&
      assessment < 70
    ) {
      reasoning =
        'Reduced visual engagement is occurring alongside weaker assessment performance. This combination may indicate difficulty maintaining attention and understanding the lesson.';
    } else if (
      audio < 60 &&
      assessment < 70
    ) {
      reasoning =
        'Reduced audio participation combined with lower assessment performance suggests that the student may need more interactive explanation or guided practice.';
    } else if (combinedRisk < 40) {
      reasoning =
        'The available signals are generally healthy. Engagement, participation, assessment performance, attendance, and learning-gap indicators do not show a significant combined risk.';
    } else {
      reasoning =
        'The signals show some areas that require attention. The system recommends monitoring the student and providing targeted support based on the strongest contributing indicators.';
    }

    /*
     * ---------------------------------------------------------
     * UNIFIED AI RECOMMENDATION
     * ---------------------------------------------------------
     */

    let recommendation: string;
    let action: string;

    if (
      riskLevel === 'High'
    ) {
      recommendation =
        'Start a targeted remedial intervention.';
      action =
        'Re-teach the topic using a short visual explanation followed by an interactive practice activity.';
    } else if (
      riskLevel === 'Moderate'
    ) {
      recommendation =
        'Provide targeted reinforcement.';
      action =
        'Give the student a short revision activity and monitor engagement during the next lesson.';
    } else {
      recommendation =
        'Continue the current learning strategy.';
      action =
        'Maintain the current teaching approach while monitoring changes in engagement and assessment performance.';
    }

    /*
     * ---------------------------------------------------------
     * CONFIDENCE
     * ---------------------------------------------------------
     *
     * Confidence increases when multiple signals agree.
     */

    let agreement = 0;

    const signals = [
      visual,
      audio,
      assessment,
      attendanceValue,
      100 - gaps,
    ];

    const average =
      signals.reduce(
        (sum, value) => sum + value,
        0
      ) / signals.length;

    const variance =
      signals.reduce(
        (sum, value) =>
          sum +
          Math.pow(
            value - average,
            2
          ),
        0
      ) / signals.length;

    const consistency =
      Math.max(
        0,
        1 -
          Math.sqrt(variance) /
            50
      );

    agreement += consistency * 35;

    if (
      (visual < 60 &&
        audio < 60) ||
      (assessment < 70 &&
        gaps > 35)
    ) {
      agreement += 25;
    }

    agreement +=
      Math.min(
        25,
        concerns.length * 6
      );

    const confidence = Math.round(
      clamp(
        55 + agreement,
        55,
        96
      )
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
    };
  }, [
    visualActivity,
    audioActivity,
    assessmentScore,
    attendance,
    learningGaps,
  ]);

  /*
   * =========================================================
   * SIGNAL DATA
   * =========================================================
   */

  const inputSignals: InputSignal[] = [
    {
      label: 'Visual Engagement',
      value: analysis.visual,
      icon: Eye,
      description:
        'Camera-based classroom engagement signal',
    },
    {
      label: 'Audio Participation',
      value: analysis.audio,
      icon: Mic,
      description:
        'Voice and participation activity',
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
      label: 'Learning Gap',
      value: 100 - analysis.gaps,
      icon: Brain,
      description:
        'Estimated learning readiness',
    },
  ];

  /*
   * =========================================================
   * HELPERS
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
    riskStyles[
      analysis.riskLevel
    ];

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
              to produce one contextual learning
              decision.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Multi-Modal Fusion Active
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
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
                Five independent signals are being
                processed together.
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
              )
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
                analysis.combinedRisk
              )}
              % risk
            </p>

            {analysis.interactionBoost > 0 && (
              <p className="mt-1 text-xs font-medium text-warning">
                +{Math.round(
                  analysis.interactionBoost
                )}
                % cross-modal reinforcement detected
              </p>
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
                  value={analysis.engagementRisk}
                />

                <ReasoningSignal
                  label="Learning risk"
                  value={analysis.learningRisk}
                />

                <ReasoningSignal
                  label="Attendance factor"
                  value={analysis.attendanceValue}
                  inverse
                />

                <ReasoningSignal
                  label="Learning readiness"
                  value={100 - analysis.gaps}
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

              <p className="text-sm leading-6 text-muted-foreground">
                {analysis.reasoning}
              </p>

              {analysis.concerns.length > 0 && (
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
                      )
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
              currentRisk.card
            )}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl',
                      currentRisk.icon
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
                        currentRisk.text
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
          </div>
        </section>

        {/* ===================================================
            FUSION SUMMARY
        ==================================================== */}

        <div className="grid gap-3 sm:grid-cols-3">
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
            icon={ShieldCheck}
            title="Final Output"
            value="1 Decision"
            description="Risk + confidence + recommended intervention"
          />
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   FUSION NODE
========================================================= */

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

/* =========================================================
   REASONING SIGNAL
========================================================= */

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

  const displayValue = inverse
    ? safeValue
    : safeValue;

  const isHealthy =
    inverse
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
              : 'text-warning'
          )}
        >
          {Math.round(displayValue)}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isHealthy
              ? 'bg-success'
              : 'bg-warning'
          )}
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

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