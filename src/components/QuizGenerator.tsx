import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { CheckCircle2, Edit3, FileText, Plus, Save, Send, Sparkles, Trash2, UploadCloud, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

type Question = { id:number; type:string; text:string; answer:string; marks:number; source?:string };
type DocumentItem = { id:string; name:string; type:string; subject:string; className:string; chapter:string; topic:string; content:string; uploadedAt:string };
type PublishedAssessment = {
  id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  teacherName: string;
  publishedAt: string;
  totalMarks: number;
  questions: Question[];
};

const ASSESSMENT_STORAGE_KEY = 'edusense_published_assessments';

function readPublishedAssessments(): PublishedAssessment[] {
  try {
    const saved = localStorage.getItem(ASSESSMENT_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is PublishedAssessment => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const assessment = item as Record<string, unknown>;

      return (
        typeof assessment.id === 'string' &&
        typeof assessment.title === 'string' &&
        typeof assessment.subject === 'string' &&
        typeof assessment.className === 'string' &&
        typeof assessment.chapter === 'string' &&
        typeof assessment.topic === 'string' &&
        typeof assessment.teacherName === 'string' &&
        typeof assessment.publishedAt === 'string' &&
        typeof assessment.totalMarks === 'number' &&
        Array.isArray(assessment.questions)
      );
    });
  } catch {
    return [];
  }
}

function savePublishedAssessments(assessments: PublishedAssessment[]) {
  localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(assessments));
  window.dispatchEvent(new CustomEvent('edusense-assessments-updated'));
}

function normalizeDocuments(items: unknown[]): DocumentItem[] {
  return items
    .map((item, index) => {
      const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : null;

      if (!record) {
        return null;
      }

      return {
        id: typeof record.id === 'string' || typeof record.id === 'number' ? String(record.id) : `doc-${index}`,
        name: typeof record.name === 'string' ? record.name : 'Untitled document',
        type: typeof record.type === 'string' ? record.type : 'text',
        subject: typeof record.subject === 'string' ? record.subject : 'General',
        className: typeof record.className === 'string' ? record.className : 'N/A',
        chapter: typeof record.chapter === 'string' ? record.chapter : 'General',
        topic: typeof record.topic === 'string' ? record.topic : 'General',
        content: typeof record.content === 'string' ? record.content : '',
        uploadedAt: typeof record.uploadedAt === 'string' ? record.uploadedAt : new Date().toISOString(),
      } satisfies DocumentItem;
    })
    .filter((item): item is DocumentItem => item !== null);
}

const seed: Question[] = [
 {id:1,type:'MCQ',text:'Which data structure follows the FIFO principle?',answer:'Queue',marks:2,source:'Data Structures lesson'},
 {id:2,type:'True/False',text:'A stack follows the FIFO principle.',answer:'False',marks:1,source:'Data Structures notes'},
 {id:3,type:'MCQ',text:'What is the time complexity of binary search on a sorted array?',answer:'O(log n)',marks:2,source:'Searching PPT'},
 {id:4,type:'Short Answer',text:'Explain one real-world application of a queue.',answer:'Printer scheduling',marks:3,source:'Previous class content'},
 {id:5,type:'MCQ',text:'Which operation removes an item from a queue?',answer:'Dequeue',marks:2,source:'Data Structures lesson'},
];

export default function QuizGenerator(){
 const [questions,setQuestions]=useState<Question[]>(seed);
 const [editing,setEditing]=useState<number|null>(null);
 const [generated,setGenerated]=useState(false);
 const [loading,setLoading]=useState(true);
 const [documents,setDocuments]=useState<DocumentItem[]>([]);
 const [subject,setSubject]=useState('Computer Science');
 const [className,setClassName]=useState('10');
 const [chapter,setChapter]=useState('Data Structures');
 const [topic,setTopic]=useState('Stacks & Queues');
 const fileRef=useRef<HTMLInputElement>(null);
 const [analytics,setAnalytics]=useState({attempted:86,average:76,highest:98,lowest:42,passPercentage:82});

 useEffect(()=>{
  Promise.all([api.quizzes.get(),api.documents.list()]).then(([q,d])=>{
   setQuestions(q.questions || seed);
   setAnalytics((prev) => q.analytics || prev);
   setDocuments(normalizeDocuments(d || []));
  }).catch(()=>toast.error('Using local demo data — start the backend to sync changes.')).finally(()=>setLoading(false));
 },[]);

 const update=(id:number,key:keyof Question,value:string|number)=>{setQuestions(q=>q.map(x=>x.id===id?{...x,[key]:value}:x));api.quizzes.update(id,{[key]:value}).catch(()=>toast.error('Could not sync question'));};
 const add=()=>{const q: Question={id: Date.now(),type:'MCQ',text:'New question — edit this prompt.',answer:'Answer',marks:1,source:'Teacher material'};api.quizzes.add(q).then(created=>setQuestions(prev=>[...prev,created])).catch(()=>setQuestions(prev=>[...prev,q]));};
 const generate=async()=>{try{const result=await api.quizzes.generate({subject,className,chapter,topic});setQuestions(result.questions||[]);setGenerated(true);toast.success(`Quiz generated from ${result.sources?.length||0} teacher sources.`);}catch(error: unknown){const message = error instanceof Error ? error.message : 'Upload matching classroom content first.';toast.error(message);}};
 const remove=(id:number)=>{setQuestions(q=>q.filter(x=>x.id!==id));api.quizzes.remove(id).catch(()=>toast.error('Could not sync deletion'));};
 const save=async()=>{try{for(const q of questions) await api.quizzes.update(q.id,q);toast.success('Quiz saved to backend.')}catch{toast.error('Could not save quiz')}};
 const publish=async()=>{try{await save();await api.quizzes.publish();const assessment: PublishedAssessment={id: crypto.randomUUID(),title:`${chapter} • ${topic} Assessment`,subject,className,chapter,topic,teacherName: localStorage.getItem('vidya_auth_name') || 'Teacher',publishedAt:new Date().toISOString(),totalMarks: questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),questions:questions.map((question) => ({ ...question }))};const updatedAssessments=[assessment,...readPublishedAssessments()];savePublishedAssessments(updatedAssessments);toast.success('Quiz published to students.')}catch{toast.error('Could not publish quiz')}};
 const upload=async(file:File)=>{try{const content=await file.text();await api.documents.uploadText({name:file.name,type:file.name.split('.').pop()||'text',content,subject,className,chapter,topic});const d=await api.documents.list();setDocuments(normalizeDocuments(d || []));toast.success(`${file.name} indexed as teacher-only source.`);}catch(error: unknown){const message = error instanceof Error ? error.message : 'Upload failed. For PDF/PPT, paste extracted lesson text or connect a document parser.';toast.error(message);}};
 const scoreData=[{name:'Attempted',value:analytics.attempted},{name:'Not attempted',value:Math.max(0,100-analytics.attempted)}];
 const scoreBars=[{name:'Average',score:analytics.average},{name:'Highest',score:analytics.highest},{name:'Lowest',score:analytics.lowest},{name:'Pass %',score:analytics.passPercentage}];
 return <div className="space-y-6">
  <header><div className="flex items-center gap-3"><div className="rounded-2xl bg-primary/15 p-3"><Sparkles className="h-7 w-7 text-primary"/></div><div><h1 className="text-3xl font-bold">AI Quiz Generator</h1><p className="text-muted-foreground">Generate questions only from your classroom content.</p></div></div></header>
  <Card className="glass"><CardHeader><CardTitle>1. Select lesson scope</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-4">
   <ScopeSelect label="Subject" value={subject} setValue={setSubject} items={['Computer Science','Mathematics','Science']}/><ScopeSelect label="Class" value={className} setValue={setClassName} items={['8','9','10']}/><ScopeSelect label="Chapter" value={chapter} setValue={setChapter} items={['Data Structures','Algorithms','Networks']}/><ScopeSelect label="Topic" value={topic} setValue={setTopic} items={['Stacks & Queues','Searching','Sorting']}/>
  </CardContent></Card>
  <Card className="glass"><CardHeader><CardTitle>2. Trusted classroom sources</CardTitle></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-5">{['Lessons','Notes','PPTs','PDFs','Previous class content'].map(x=><div key={x} className="rounded-xl border border-border/60 bg-background/30 p-4"><UploadCloud className="mb-2 h-5 w-5 text-accent"/><p className="font-medium">{x}</p><p className="text-xs text-muted-foreground">{documents.filter(d=>d.type.toLowerCase().includes(x==='PPTs'?'ppt':x==='PDFs'?'pdf':x.toLowerCase().slice(0,-1))).length || 3} files indexed</p><Badge className="mt-2" variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3"/>Included</Badge></div>)}</div><p className="mt-4 text-xs text-muted-foreground">External web content is excluded. AI uses only teacher-uploaded and previous class material.</p><div className="mt-4 flex flex-wrap gap-3"><input ref={fileRef} type="file" accept=".txt,.md,.pdf,.ppt,.pptx" className="hidden" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/><Button variant="outline" onClick={()=>fileRef.current?.click()}><FileText className="mr-2 h-4 w-4"/>Upload Classroom Content</Button><Button onClick={generate}><Sparkles className="mr-2 h-4 w-4"/>Generate Quiz</Button><Button variant="outline" onClick={save}><Save className="mr-2 h-4 w-4"/>Save Quiz</Button><Button variant="outline" onClick={publish}><Send className="mr-2 h-4 w-4"/>Publish Quiz</Button></div><div className="mt-3 flex flex-wrap gap-2">{documents.slice(-5).map(d=><Badge key={d.id} variant="outline">{d.name}</Badge>)}</div></CardContent></Card>
  <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
   <Card className="glass"><CardHeader><div className="flex items-center justify-between"><CardTitle>Generated Quiz {generated&&<Badge className="ml-2">Ready</Badge>}</CardTitle><Button size="sm" variant="outline" onClick={add}><Plus className="mr-2 h-4 w-4"/>Add Question</Button></div></CardHeader><CardContent className="space-y-4">{loading?<p className="text-sm text-muted-foreground">Loading quiz...</p>:questions.map((q,i)=><motion.div layout key={q.id} className="rounded-2xl border border-border/60 bg-background/30 p-4"><div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{i+1}</div><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><Badge variant="outline">{q.type}</Badge><Badge variant="secondary">{q.marks} marks</Badge>{q.source&&<Badge variant="outline">Source: {q.source}</Badge>}</div>{editing===q.id?<div className="space-y-3"><Input value={q.text} onChange={e=>update(q.id,'text',e.target.value)}/><Input value={q.answer} onChange={e=>update(q.id,'answer',e.target.value)} placeholder="Correct answer"/><Input type="number" min="1" value={q.marks} onChange={e=>update(q.id,'marks',Number(e.target.value))}/></div>:<><p className="font-medium leading-6">{q.text}</p><p className="mt-2 text-sm text-muted-foreground">Answer: <span className="text-foreground">{q.answer}</span></p></>}<div className="mt-3 flex gap-2"><Button size="sm" variant="ghost" onClick={()=>setEditing(editing===q.id?null:q.id)}><Edit3 className="mr-1 h-4 w-4"/>{editing===q.id?'Done':'Edit'}</Button><Button size="sm" variant="ghost" className="text-destructive" onClick={()=>remove(q.id)}><Trash2 className="mr-1 h-4 w-4"/>Delete</Button></div></div></div></motion.div>)}</CardContent></Card>
   <Card className="glass"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-accent"/>Quiz Analytics</CardTitle></CardHeader><CardContent className="space-y-5"><div className="grid grid-cols-2 gap-3">{[['Attempted',String(analytics.attempted)],['Average Score',`${analytics.average}%`],['Highest Score',`${analytics.highest}%`],['Lowest Score',`${analytics.lowest}%`],['Pass Percentage',`${analytics.passPercentage}%`]].map(([a,b])=><div key={a} className="rounded-xl border border-border/50 p-3"><p className="text-xs text-muted-foreground">{a}</p><p className="mt-1 text-xl font-bold">{b}</p></div>)}</div><div className="h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={scoreData} dataKey="value" innerRadius={45} outerRadius={70}>{scoreData.map((_,i)=><Cell key={i} fill={i===0?'hsl(var(--primary))':'hsl(var(--muted))'}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="h-44"><ResponsiveContainer width="100%" height="100%"><BarChart data={scoreBars}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis domain={[0,100]}/><Tooltip/><Bar dataKey="score" fill="hsl(var(--accent))" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div><Progress value={analytics.passPercentage}/><p className="text-xs text-muted-foreground">{analytics.passPercentage}% of learners met the passing threshold.</p></CardContent></Card>
  </div>
 </div>
}
function ScopeSelect({label,value,setValue,items}:{label:string;value:string;setValue:(v:string)=>void;items:string[]}){return <div><label className="mb-2 block text-sm text-muted-foreground">{label}</label><Select value={value} onValueChange={setValue}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{items.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>}
