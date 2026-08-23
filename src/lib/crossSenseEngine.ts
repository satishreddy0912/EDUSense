export type CrossSenseInput = {
  visualActivity: number;
  audioActivity: number;
  assessmentScore: number;
  attendance: number;
  learningGaps: number;
};

export type CrossSenseResult = {
  engagementScore: number;
  learningRisk: number;
  confidence: number;
  status: 'low' | 'moderate' | 'high';
  reasoning: string;
  recommendation: string[];
  signals: {
    visual: 'positive' | 'neutral' | 'negative';
    audio: 'positive' | 'neutral' | 'negative';
    learning: 'positive' | 'neutral' | 'negative';
    attendance: 'positive' | 'neutral' | 'negative';
  };
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

export function analyzeCrossSense(
  input: CrossSenseInput
): CrossSenseResult {
  const visual = clamp(input.visualActivity);
  const audio = clamp(input.audioActivity);
  const assessment = clamp(input.assessmentScore);
  const attendance = clamp(input.attendance);
  const gaps = Math.max(0, input.learningGaps);

  /*
   * Engagement is intentionally based mainly on the
   * real-time classroom signals.
   */
  const engagementScore = Math.round(
    visual * 0.55 +
      audio * 0.45
  );

  /*
   * Learning risk combines:
   * - low engagement
   * - assessment performance
   * - learning gaps
   * - attendance context
   */
  const engagementRisk = 100 - engagementScore;
  const assessmentRisk = 100 - assessment;

  const gapRisk = clamp(gaps * 12);

  /*
   * Healthy attendance should reduce the risk slightly
   * because low attendance can otherwise explain poor
   * academic performance.
   */
  const attendanceRisk =
    attendance < 75
      ? 20
      : attendance < 85
        ? 10
        : 0;

  const learningRisk = Math.round(
    clamp(
      engagementRisk * 0.40 +
        assessmentRisk * 0.40 +
        gapRisk * 0.15 +
        attendanceRisk * 0.05
    )
  );

  let status: CrossSenseResult['status'];

  if (learningRisk >= 65) {
    status = 'high';
  } else if (learningRisk >= 40) {
    status = 'moderate';
  } else {
    status = 'low';
  }

  /*
   * Confidence increases when multiple signals
   * point in the same direction.
   */
  const lowEngagement =
    visual < 60 && audio < 60;

  const weakLearning =
    assessment < 70 || gaps >= 3;

  let confidence = 62;

  if (lowEngagement) confidence += 10;
  if (weakLearning) confidence += 10;

  if (
    lowEngagement &&
    assessment < 70
  ) {
    confidence += 8;
  }

  if (
    visual < 50 &&
    audio < 50 &&
    assessment < 65
  ) {
    confidence += 7;
  }

  confidence = Math.round(clamp(confidence));

  const visualSignal =
    visual < 50
      ? 'negative'
      : visual < 70
        ? 'neutral'
        : 'positive';

  const audioSignal =
    audio < 50
      ? 'negative'
      : audio < 70
        ? 'neutral'
        : 'positive';

  const learningSignal =
    assessment < 60
      ? 'negative'
      : assessment < 75
        ? 'neutral'
        : 'positive';

  const attendanceSignal =
    attendance < 75
      ? 'negative'
      : attendance < 85
        ? 'neutral'
        : 'positive';

  let reasoning = '';

  if (status === 'high') {
    if (
      attendance >= 85 &&
      engagementScore < 60 &&
      assessment < 70
    ) {
      reasoning =
        'Students are present in class, but real-time classroom activity and assessment performance are both below the expected level. The combined signals suggest possible difficulty with the current topic rather than an attendance problem.';
    } else if (
      engagementScore < 60 &&
      assessment >= 70
    ) {
      reasoning =
        'Classroom activity is currently low even though recent academic performance is acceptable. The system recommends checking student participation before assuming a learning gap.';
    } else if (assessment < 60) {
      reasoning =
        'Recent assessment performance is low and is accompanied by classroom activity signals that indicate reduced engagement. The combined evidence suggests that additional instructional support may be required.';
    } else {
      reasoning =
        'Multiple classroom and learning signals indicate an elevated learning risk. The teacher should review the current topic and provide targeted support.';
    }
  } else if (status === 'moderate') {
    reasoning =
      'Some signals indicate reduced engagement or learning performance, but the evidence is not strong enough to classify the situation as a high-risk learning issue. Continued monitoring is recommended.';
  } else {
    reasoning =
      'Classroom activity and learning performance are currently within a healthy range. No immediate learning intervention is required.';
  }

  const recommendation: string[] = [];

  if (learningRisk >= 65) {
    recommendation.push(
      'Re-teach the current concept using visual or hands-on examples.'
    );

    recommendation.push(
      'Run a short 5-question formative assessment.'
    );

    if (engagementScore < 55) {
      recommendation.push(
        'Use a quick interactive activity to increase classroom participation.'
      );
    }

    if (assessment < 65) {
      recommendation.push(
        'Provide targeted practice questions based on the weakest concepts.'
      );
    }
  } else if (learningRisk >= 40) {
    recommendation.push(
      'Continue monitoring classroom engagement during the next activity.'
    );

    recommendation.push(
      'Use a quick formative question to verify student understanding.'
    );
  } else {
    recommendation.push(
      'Continue the current lesson strategy.'
    );

    recommendation.push(
      'Use periodic formative questions to maintain engagement.'
    );
  }

  return {
    engagementScore,
    learningRisk,
    confidence,
    status,
    reasoning,
    recommendation,
    signals: {
      visual: visualSignal,
      audio: audioSignal,
      learning: learningSignal,
      attendance: attendanceSignal,
    },
  };
}