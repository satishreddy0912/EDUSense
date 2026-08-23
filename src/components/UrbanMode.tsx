import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Eye,
  MessageSquare,
  MousePointerClick,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Brain,
  FileText,
  Activity,
  Map,
  Hand,
  Users,
  Trophy,
  Clock,
  Bell,
  Volume2,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useI18n } from '@/i18n';
import {
  urbanEngagement,
  lessonData,
  firstScores,
  secondScores,
  liveClassData,
  studentInteractions,
  handRaises,
  doubts as initialDoubts,
  classroomHeatmap,
  attentionAnalysis,
  aiSuggestions,
} from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const levelColors: Record<string, string> = {
  High: 'text-success bg-success/15',
  Medium: 'text-warning bg-warning/15',
  Low: 'text-destructive bg-destructive/15',
};

const trendIcons: Record<string, LucideIcon> = {
  Focus: Eye,
  Participation: MessageSquare,
  Response: MousePointerClick,
  Question: HelpCircle,
};

const heatmapColors: Record<string, string> = {
  green: 'bg-success/60 border-success/40',
  yellow: 'bg-warning/60 border-warning/40',
  red: 'bg-destructive/60 border-destructive/40',
  purple: 'hsl(var(--chart-5) / 0.6) border-chart-5/40',
};

const heatmapLabels: Record<string, { en: string; te: string; hi: string; ta: string; kn: string }> = {
  green: { en: 'Engaged', te: 'నిమగ్నత', hi: 'जुड़ा हुआ', ta: 'ஈடுபாடு', kn: 'ನಿರತ' },
  yellow: { en: 'Neutral', te: 'తటస్థ', hi: 'तटस्थ', ta: 'நடுநிலை', kn: 'ತಟಸ್ಥ' },
  red: { en: 'Confused', te: 'గందరగోల', hi: 'उलझन', ta: 'குழப்பம்', kn: 'ಗೊಂದಲ' },
  purple: { en: 'Needs Attention', te: 'శ్రద్ధ అవసరం', hi: 'ध्यान दें', ta: 'கவனம் தேவை', kn: 'ಗಮನ ಬೇಕು' },
};

const doubtStatusColors: Record<string, string> = {
  pending: 'text-warning bg-warning/15',
  answered: 'text-primary bg-primary/15',
  resolved: 'text-success bg-success/15',
};

type UrbanTab = 'live' | 'interactions' | 'handraise' | 'doubts' | 'heatmap' | 'attention' | 'assistant';

export default function UrbanMode() {
  const { t, tr } = useI18n();
  const [tab, setTab] = useState<UrbanTab>('live');
  const [liveData, setLiveData] = useState(liveClassData);
  const [doubts, setDoubts] = useState(initialDoubts);
  const [acknowledgedHands, setAcknowledgedHands] = useState<string[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    if (tab !== 'live') return;
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        activeStudents: Math.max(28, Math.min(38, prev.activeStudents + Math.floor(Math.random() * 3) - 1)),
        questionCount: prev.questionCount + (Math.random() > 0.6 ? 1 : 0),
        engagementScore: Math.max(60, Math.min(95, prev.engagementScore + Math.floor(Math.random() * 5) - 2)),
        participationScore: Math.max(55, Math.min(92, prev.participationScore + Math.floor(Math.random() * 5) - 2)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [tab]);

  const liveLesson = tr(lessonData.title);

  const participationData = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((week, i) => ({
    week,
    participation: 50 + i * 4 + Math.round(Math.random() * 6),
    responses: 40 + i * 5 + Math.round(Math.random() * 8),
  }));

  const heatmapData = lessonData.concepts.map((c) => ({
    name: tr(c.name),
    score: secondScores[c.id],
    first: firstScores[c.id],
  }));

  const attentionData = [
    { name: tr({ en: 'Eye Contact', te: 'కంటి సంబంధం', hi: 'आई कांटैक्ट', ta: 'கண் தொடர்பு', kn: 'ಕಣ್ಣಿನ ಸಂಪರ್ಕ' }), value: attentionAnalysis.eyeContact },
    { name: tr({ en: 'Participation', te: 'పాల్గొనడం', hi: 'भागीदारी', ta: 'பங்கேற்பு', kn: 'ಭಾಗವಹಿಸುವಿಕೆ' }), value: attentionAnalysis.participation },
    { name: tr({ en: 'Speaking', te: 'మాట్లాడటం', hi: 'बोलना', ta: 'பேசுதல்', kn: 'ಮಾತನಾಡುವುದು' }), value: attentionAnalysis.speakingActivity },
    { name: tr({ en: 'Note Taking', te: 'నోట్ తీసుకోవడం', hi: 'नोट लेना', ta: 'குறிப்பு எடுத்தல்', kn: 'ಟಿಪ್ಪಣಿ ಮಾಡುವುದು' }), value: attentionAnalysis.noteTaking },
    { name: tr({ en: 'Question Asking', te: 'ప్రశ్న అడగడం', hi: 'प्रश्न पूछना', ta: 'கேள்வி கேட்பது', kn: 'ಪ್ರಶ್ನೆ ಕೇಳುವುದು' }), value: attentionAnalysis.questionAsking },
  ];

  const attentionRadial = [
    { name: 'Attention', value: attentionAnalysis.attentionScore, fill: 'hsl(var(--primary))' },
  ];

  const sortedInteractions = [...studentInteractions].sort((a, b) => b.score - a.score);

  const updateDoubtStatus = (id: string, status: 'pending' | 'answered' | 'resolved') => {
    setDoubts((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const acknowledgeHand = async (id: string, name: string) => {
    if (acknowledgedHands.includes(id)) return;
    try {
      await api.handRaises.acknowledge(id);
    } catch {
      // Keep the classroom UI responsive even if the backend is temporarily unavailable.
    }
    setAcknowledgedHands((prev) => [...prev, id]);
    toast.success(`${name} has been acknowledged.`);
  };

  const urbanTabs: { id: UrbanTab; label: { en: string; te: string; hi: string; ta: string; kn: string }; icon: LucideIcon }[] = [
    { id: 'live', label: { en: 'Live Dashboard', te: 'లైవ్ డ్యాష్‌బోర్డ్', hi: 'लाइव डैशबोर्ड', ta: 'நேரடி டாஷ்போர்டு', kn: 'ನೇರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' }, icon: Radio },
    { id: 'interactions', label: { en: 'Interactions', te: 'ఇంటరాక్షన్స్', hi: 'इंटरैक्शन', ta: 'தொடர்புகள்', kn: 'ಸಂವಾದಗಳು' }, icon: Users },
    { id: 'handraise', label: { en: 'Hand Raise', te: 'చేయెత్తు', hi: 'हाथ उठाना', ta: 'கை தூக்குதல்', kn: 'ಕೈ ಎತ್ತುವುದು' }, icon: Hand },
    { id: 'doubts', label: { en: 'Doubts', te: 'సందేహాలు', hi: 'संदेह', ta: 'ஐயங்கள்', kn: 'ಅನುಮಾನಗಳು' }, icon: HelpCircle },
    { id: 'heatmap', label: { en: 'Heatmap', te: 'హీట్‌మ్యాప్', hi: 'हीटमैप', ta: 'வெப்ப வரைபடம்', kn: 'ಹೀಟ್‌ಮ್ಯಾಪ್' }, icon: Map },
    { id: 'attention', label: { en: 'AI Attention', te: 'AI ఏకాగ్రత', hi: 'AI ध्यान', ta: 'AI கவனம்', kn: 'AI ಗಮನ' }, icon: Brain },
    { id: 'assistant', label: { en: 'AI Assistant', te: 'AI సహాయక', hi: 'AI सहायक', ta: 'AI உதவியாளர்', kn: 'AI ಸಹಾಯಕ' }, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-accent">{t('nav.urban')}</span>
          <span className="flex items-center gap-1 text-success"><ShieldCheck className="h-3.5 w-3.5" />Privacy-safe · Class-level only</span>
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Smart Classroom Intelligence</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        {urbanTabs.map((tabItem) => {
          const Icon = tabItem.icon;
          const active = tab === tabItem.id;
          return (
            <button key={tabItem.id} onClick={() => setTab(tabItem.id)} className={cn('flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition', active ? 'bg-primary text-primary-foreground glow-primary' : 'glass text-muted-foreground hover:text-foreground')}>
              <Icon className="h-4 w-4" />
              {tr(tabItem.label)}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          {/* ─── Live Dashboard ─── */}
          {tab === 'live' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="glass p-5">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /><span className="text-xs">Total Present</span></div>
                  <div className="font-display text-3xl font-bold">{liveData.totalPresent}</div>
                  <div className="mt-1 flex gap-3 text-xs"><span className="text-success">Active: {liveData.activeStudents}</span><span className="text-destructive">Inactive: {liveData.inactiveStudents}</span></div>
                </Card>
                <Card className="glass p-5">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground"><HelpCircle className="h-4 w-4" /><span className="text-xs">Questions Asked</span></div>
                  <div className="font-display text-3xl font-bold text-primary">{liveData.questionCount}</div>
                </Card>
                <Card className="glass p-5">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground"><Activity className="h-4 w-4 text-success" /><span className="text-xs">Engagement Score</span></div>
                  <div className="flex items-end gap-2"><span className="font-display text-3xl font-bold text-gradient-accent">{liveData.engagementScore}%</span><span className="mb-1 flex items-center gap-1 text-xs text-success"><Radio className="h-3 w-3 animate-pulse" />Live</span></div>
                </Card>
              </div>

              {/* Engagement analytics */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="glass p-6">
                  <h3 className="mb-4 font-semibold">Engagement Analytics</h3>
                  <div className="space-y-4">
                    {urbanEngagement.map((m, i) => {
                      const Icon = trendIcons[tr(m.name).split(' ')[0]] ?? Eye;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40"><Icon className="h-5 w-5 text-accent" /></div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-sm font-medium">{tr(m.name)}</span>
                              <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', levelColors[m.level])}>{m.level}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={cn('h-full rounded-full', m.level === 'High' ? 'bg-success' : m.level === 'Medium' ? 'bg-warning' : 'bg-destructive')} />
                            </div>
                          </div>
                          <span className="w-10 text-right text-sm font-bold">{m.value}%</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="glass p-6">
                  <h3 className="mb-4 font-semibold">Participation & Response Trends</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={participationData}>
                      <defs>
                        <linearGradient id="partGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                        <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="participation" stroke="hsl(var(--primary))" fill="url(#partGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="responses" stroke="hsl(var(--accent))" fill="url(#respGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Learning gap heatmap mini */}
              <Card className="glass p-6">
                <div className="mb-4 flex items-center gap-2"><Map className="h-5 w-5 text-primary" /><h3 className="font-semibold">Learning Gap Overview</h3></div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {heatmapData.map((d, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className={cn('rounded-xl border p-4 text-center', d.score >= 75 ? 'border-success/30 bg-success/10' : d.score >= 50 ? 'border-warning/30 bg-warning/10' : 'border-destructive/30 bg-destructive/10')}>
                      <div className="mb-1 text-xs text-muted-foreground">{d.name}</div>
                      <div className={cn('font-display text-2xl font-bold', d.score >= 75 ? 'text-success' : d.score >= 50 ? 'text-warning' : 'text-destructive')}>{d.score}%</div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ─── Interactions ─── */}
          {tab === 'interactions' && (
            <div className="space-y-6">
              <Card className="glass p-6">
                <div className="mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-warning" /><h3 className="font-semibold">Student Interaction Leaderboard</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Rank</th>
                        <th className="pb-3 pr-4 font-medium">Student</th>
                        <th className="pb-3 pr-4 font-medium">Questions</th>
                        <th className="pb-3 pr-4 font-medium">Answers</th>
                        <th className="pb-3 pr-4 font-medium">Chats</th>
                        <th className="pb-3 pr-4 font-medium">Discussion</th>
                        <th className="pb-3 pr-4 font-medium">Participation</th>
                        <th className="pb-3 font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedInteractions.map((s, i) => (
                        <tr key={s.id} className="border-b border-border/30 last:border-0">
                          <td className="py-3 pr-4"><span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', i === 0 ? 'bg-warning/20 text-warning' : i === 1 ? 'bg-muted/40 text-muted-foreground' : i === 2 ? 'bg-accent/20 text-accent' : 'text-muted-foreground')}>{i + 1}</span></td>
                          <td className="py-3 pr-4 font-medium">{tr(s.name)}</td>
                          <td className="py-3 pr-4">{s.questions}</td>
                          <td className="py-3 pr-4">{s.answers}</td>
                          <td className="py-3 pr-4">{s.chats}</td>
                          <td className="py-3 pr-4">{s.discussion}</td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 overflow-hidden rounded-full bg-muted/40"><div className={cn('h-full rounded-full', s.participation >= 75 ? 'bg-success' : s.participation >= 50 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${s.participation}%` }} /></div>
                              <span className="text-xs">{s.participation}%</span>
                            </div>
                          </td>
                          <td className="py-3"><span className={cn('font-bold', s.score >= 75 ? 'text-success' : s.score >= 50 ? 'text-warning' : 'text-destructive')}>{s.score}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ─── Hand Raise ─── */}
          {tab === 'handraise' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="glass p-5 text-center"><Hand className="mx-auto mb-2 h-6 w-6 text-warning" /><div className="text-xs text-muted-foreground">Hands Raised</div><div className="font-display text-2xl font-bold">{handRaises.length}</div></Card>
                <Card className="glass p-5 text-center"><Clock className="mx-auto mb-2 h-6 w-6 text-primary" /><div className="text-xs text-muted-foreground">Avg Wait Time</div><div className="font-display text-2xl font-bold">2.3 min</div></Card>
                <Card className="glass p-5 text-center"><Bell className="mx-auto mb-2 h-6 w-6 text-accent" /><div className="text-xs text-muted-foreground">Notifications</div><div className="font-display text-2xl font-bold">On</div></Card>
              </div>
              <Card className="glass p-6">
                <h3 className="mb-4 font-semibold">Hand Raise Priority Queue</h3>
                <div className="space-y-3">
                  {handRaises.map((hr, i) => (
                    <motion.div key={hr.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20 text-sm font-bold text-warning">{hr.priority}</span>
                      <Hand className="h-5 w-5 text-warning animate-pulse" />
                      <div className="flex-1">
                        <div className="font-medium">{tr(hr.name)}</div>
                        <div className="text-xs text-muted-foreground">Raised at {hr.time} · Waiting {hr.duration}</div>
                      </div>
                      <Button size="sm" variant="outline"><Bell className="mr-1.5 h-3.5 w-3.5" />Notify</Button>
                      <Button size="sm" onClick={() => acknowledgeHand(hr.id, tr(hr.name))} disabled={acknowledgedHands.includes(hr.id)}>{acknowledgedHands.includes(hr.id) ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <Volume2 className="mr-1.5 h-3.5 w-3.5" />}{acknowledgedHands.includes(hr.id) ? 'Acknowledged' : 'Acknowledge'}</Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ─── Doubts ─── */}
          {tab === 'doubts' && (
            <div className="space-y-6">
              <Card className="glass p-6">
                <div className="mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /><h3 className="font-semibold">Doubt Management Panel</h3></div>
                <div className="space-y-3">
                  {doubts.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tr(d.student)}</span>
                          <span className="text-xs text-muted-foreground">· {d.time}</span>
                        </div>
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', doubtStatusColors[d.status])}>{d.status}</span>
                      </div>
                      <p className="mb-2 text-sm">{tr(d.question)}</p>
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Topic: {tr(d.topic)}</span>
                        <span>Difficulty: <span className={cn('font-medium', d.difficulty === 'Hard' ? 'text-destructive' : d.difficulty === 'Medium' ? 'text-warning' : 'text-success')}>{d.difficulty}</span></span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateDoubtStatus(d.id, 'answered')} disabled={d.status === 'answered' || d.status === 'resolved'}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Mark Answered</Button>
                        <Button size="sm" variant="ghost" onClick={() => updateDoubtStatus(d.id, 'resolved')} disabled={d.status === 'resolved'}><CircleDot className="mr-1.5 h-3.5 w-3.5" />Mark Resolved</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ─── Classroom Heatmap ─── */}
          {tab === 'heatmap' && (
            <div className="space-y-6">
              <Card className="glass p-6">
                <div className="mb-4 flex items-center gap-2"><Map className="h-5 w-5 text-primary" /><h3 className="font-semibold">Real-Time Classroom Heatmap</h3></div>
                {/* Classroom layout */}
                <div className="mx-auto max-w-2xl">
                  {/* Teacher position */}
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-xl bg-primary/20 px-6 py-2 text-sm font-medium text-primary">Teacher</div>
                  </div>
                  {/* Seats grid */}
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${classroomHeatmap[0]?.length ?? 5}, 1fr)` }}>
                    {classroomHeatmap.flat().map((cell, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className={cn('flex aspect-square items-center justify-center rounded-lg border text-xs font-medium', heatmapColors[cell])}>
                        {i + 1}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
              {/* Legend */}
              <Card className="glass p-6">
                <h3 className="mb-3 font-semibold">Legend</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(heatmapLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={cn('h-6 w-6 rounded-lg border', heatmapColors[key])} />
                      <span className="text-sm">{tr(label)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ─── AI Attention Analysis ─── */}
          {tab === 'attention' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="glass p-5 text-center"><Eye className="mx-auto mb-2 h-6 w-6 text-primary" /><div className="text-xs text-muted-foreground">Attention Score</div><div className="font-display text-3xl font-bold text-gradient">{attentionAnalysis.attentionScore}%</div></Card>
                <Card className="glass p-5 text-center"><Activity className="mx-auto mb-2 h-6 w-6 text-accent" /><div className="text-xs text-muted-foreground">Engagement Score</div><div className="font-display text-3xl font-bold text-gradient-accent">{attentionAnalysis.engagementScore}%</div></Card>
                <Card className="glass p-5 text-center"><Brain className="mx-auto mb-2 h-6 w-6 text-success" /><div className="text-xs text-muted-foreground">Learning Score</div><div className="font-display text-3xl font-bold text-success">{attentionAnalysis.learningScore}%</div></Card>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="glass p-6">
                  <h3 className="mb-4 font-semibold">Attention Metrics Breakdown</h3>
                  <div className="space-y-4">
                    {attentionData.map((m, i) => (
                      <div key={i}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium">{m.name}</span>
                          <span className="text-sm font-bold">{m.value}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-muted/40">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className={cn('h-full rounded-full', m.value >= 75 ? 'bg-success' : m.value >= 50 ? 'bg-warning' : 'bg-destructive')} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="glass p-6">
                  <h3 className="mb-4 font-semibold">Overall Attention</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadialBarChart innerRadius="60%" outerRadius="100%" data={attentionRadial} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar dataKey="value" cornerRadius={12} background={{ fill: 'hsl(var(--muted))' }} />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-display text-4xl font-bold">{attentionAnalysis.attentionScore}%</text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          )}

          {/* ─── AI Teacher Assistant ─── */}
          {tab === 'assistant' && (
            <div className="space-y-6">
              <Card className="glass p-6">
                <div className="mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><h3 className="font-semibold">Real-Time AI Suggestions</h3><span className="ml-auto flex items-center gap-1 text-xs text-success"><Radio className="h-3 w-3 animate-pulse" />Live</span></div>
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm">{tr(suggestion)}</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline">Apply</Button>
                          <Button size="sm" variant="ghost">Dismiss</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="glass p-6">
                <div className="mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><h3 className="font-semibold">Class Summary Generator</h3></div>
                <div className="space-y-3 text-sm">
                  <SummaryRow label="Lesson Covered" value={liveLesson} />
                  <SummaryRow label="Topics Explained" value={String(lessonData.concepts.length)} />
                  <SummaryRow label="Concepts Understood" value={`${lessonData.concepts.filter((c) => secondScores[c.id] >= 75).length} / ${lessonData.concepts.length}`} tone="success" />
                  <SummaryRow label="Requiring Review" value={`${lessonData.concepts.filter((c) => secondScores[c.id] < 75).length} / ${lessonData.concepts.length}`} tone="warning" />
                  <SummaryRow label="Recommended Action" value={tr({ en: 'Group practice on unlike denominators', te: 'విభిన్న హారాలపై సమూహ అభ్యాసం', hi: 'भिन्न हर पर समूह अभ्यास', ta: 'வெவ்வேறு பகுதிகளில் குழு பயிற்சி', kn: 'ವಿಭಿನ್ನ ಛೇದಗಳಲ್ಲಿ ಗುಂಪು ಅಭ್ಯಾಸ' })} />
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-semibold', tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-foreground')}>{value}</span>
    </div>
  );
}
