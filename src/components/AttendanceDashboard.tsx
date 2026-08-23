import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, CheckCircle2, Users, XCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

type SubjectAttendance = { subject:string; total:number; present:number; absent:number; percent:number };
type MonthlyAttendance = { month:string; attendance:number };
type AttendanceData = { overall:{totalClasses:number;present:number;absent:number;percentage:number}; subjects:SubjectAttendance[]; monthly:MonthlyAttendance[] };

const defaultSubjects:SubjectAttendance[]=[
 {subject:"Mathematics",total:24,present:22,absent:2,percent:92},{subject:"Science",total:24,present:21,absent:3,percent:88},{subject:"English",total:20,present:17,absent:3,percent:85},{subject:"Social",total:20,present:18,absent:2,percent:90},{subject:"Computer Science",total:20,present:19,absent:1,percent:95}
];
const defaultMonthly:MonthlyAttendance[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month,i)=>({month,attendance:[88,90,87,92,89,91,93,90,94,92,95,94][i]}));
const defaultData:AttendanceData={overall:{totalClasses:120,present:108,absent:12,percentage:90},subjects:defaultSubjects,monthly:defaultMonthly};

export default function AttendanceDashboard(){
 const [data,setData]=useState<AttendanceData>(defaultData);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let mounted=true;api.attendance().then((result)=>{if(mounted&&result)setData(result as AttendanceData);}).catch(()=>{}).finally(()=>{if(mounted)setLoading(false)});return()=>{mounted=false}},[]);
 const subjectRows:SubjectAttendance[]=data.subjects?.length?data.subjects:defaultSubjects;
 const monthRows:MonthlyAttendance[]=data.monthly?.length?data.monthly:defaultMonthly;
 const overall=data.overall||defaultData.overall;
 const pieData=[{name:"Present",value:overall.present},{name:"Absent",value:overall.absent}];
 const below=overall.percentage<75;
 return <div className="space-y-6">
  <header><div className="flex items-center gap-3"><div className="rounded-2xl bg-accent/15 p-3"><CalendarDays className="h-7 w-7 text-accent"/></div><div><h1 className="text-3xl font-bold">Attendance Analytics</h1><p className="text-muted-foreground">Live classroom attendance overview with alerts and trends.</p></div></div></header>
  {loading&&<div className="text-sm text-muted-foreground">Loading latest attendance data...</div>}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
   {label:"Total Classes",value:String(overall.totalClasses),Icon:Users},{label:"Classes Present",value:String(overall.present),Icon:CheckCircle2},{label:"Classes Absent",value:String(overall.absent),Icon:XCircle},{label:"Attendance",value:`${overall.percentage}%`,Icon:CalendarDays}
  ].map(({label,value,Icon}:{label:string;value:string;Icon:typeof Users})=><motion.div key={label} whileHover={{y:-3}}><Card className="glass"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><div className="rounded-xl bg-primary/10 p-2"><Icon className="h-6 w-6 text-primary"/></div></div></CardContent></Card></motion.div>)}</div>
  <Card className="glass"><CardHeader><CardTitle>Subject Wise Attendance</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-3">Subject</th><th className="p-3">Conducted</th><th className="p-3">Present</th><th className="p-3">Absent</th><th className="p-3">Attendance %</th></tr></thead><tbody>{subjectRows.map((s:SubjectAttendance)=><tr key={s.subject} className="border-b border-border/50"><td className="p-3 font-medium">{s.subject}</td><td className="p-3">{s.total}</td><td className="p-3">{s.present}</td><td className="p-3">{s.absent}</td><td className="p-3"><div className="flex items-center gap-3"><span>{s.percent}%</span><Progress value={s.percent} className="w-24"/></div></td></tr>)}</tbody></table></div></CardContent></Card>
  <div className="grid gap-6 lg:grid-cols-2">
   <Card className="glass"><CardHeader><CardTitle>Monthly Attendance Trend</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthRows}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/><XAxis dataKey="month"/><YAxis domain={[70,100]} tickFormatter={(v)=>`${v}%`}/><Tooltip formatter={(v)=>[`${v}%`,"Attendance"]}/><Line type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" strokeWidth={3} dot/></LineChart></ResponsiveContainer></div></CardContent></Card>
   <Card className="glass"><CardHeader><CardTitle>Attendance Distribution</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" outerRadius={95} label>{pieData.map((entry:{name:string;value:number},index:number)=><Cell key={entry.name} fill={index===0?"hsl(var(--primary))":"hsl(var(--destructive))"}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></CardContent></Card>
  </div>
  <Card className="glass"><CardHeader><CardTitle>Attendance Alerts</CardTitle></CardHeader><CardContent><motion.div whileHover={{scale:1.01}} className={below?"flex flex-col gap-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center":"flex flex-col gap-4 rounded-2xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center"}><AlertTriangle className={below?"h-7 w-7 shrink-0 text-destructive":"h-7 w-7 shrink-0 text-warning"}/><div><p className="font-semibold">{below?"Attendance Below Required Level":"Attendance is Above Required Level"}</p><p className="text-sm text-muted-foreground">{below?`Current attendance is ${overall.percentage}%. The required minimum is 75%.`:"The system will automatically flag attendance when it drops below 75%."}</p></div><Badge className="sm:ml-auto" variant={below?"destructive":"secondary"}>{below?"Action Required":"Monitoring"}</Badge></motion.div></CardContent></Card>
  <Card className="glass"><CardHeader><CardTitle>Subject Attendance Comparison</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={subjectRows}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/><XAxis dataKey="subject" tick={{fontSize:10}}/><YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`}/><Tooltip formatter={(v)=>[`${v}%`,"Attendance"]}/><Bar dataKey="percent" fill="hsl(var(--accent))" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></CardContent></Card>
  <Card className="glass"><CardHeader><CardTitle>Monthly Attendance</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-3">Month</th><th className="p-3">Attendance</th><th className="p-3">Status</th></tr></thead><tbody>{monthRows.map((month:MonthlyAttendance)=><tr key={month.month} className="border-b border-border/50"><td className="p-3 font-medium">{month.month}</td><td className="p-3">{month.attendance}%</td><td className="p-3"><Badge variant={month.attendance<75?"destructive":"secondary"}>{month.attendance<75?"Below 75%":"Good"}</Badge></td></tr>)}</tbody></table></div></CardContent></Card>
 </div>
}
