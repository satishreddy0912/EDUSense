import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Handle serverless (read-only filesystem) vs traditional Node environments
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const dataDir = isServerless ? path.join('/tmp', 'edusense-data') : path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'db.json');
const uploadDir = isServerless ? path.join('/tmp', 'edusense-uploads') : path.join(__dirname, 'uploads');
const port = Number(process.env.PORT || 4000);
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

function getInitialDb() {
  return {
    students: {
      SNIST10A042: {
        id: 'SNIST10A042',
        name: 'Aarav Reddy',
        className: '10-A',
        rollNumber: 'SNIST10A042',
        parentMobile: '9876543210',
        attendance: 92
      }
    },
    parents: {
      SNIST10A042: {
        student: {
          name: 'Aarav Reddy',
          rollNumber: 'SNIST10A042',
          className: '10-A',
          attendance: 92,
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
        },
        parentName: 'Vikram Reddy',
        parentMobile: '9876543210',
        subjects: [
          { name: 'Computer Science', percentage: 96, grade: 'A+', teacher: 'Dr. Sarah Rao' },
          { name: 'Mathematics', percentage: 94, grade: 'A', teacher: 'Prof. K. Sharma' },
          { name: 'English', percentage: 91, grade: 'A', teacher: 'Ms. Ananya Roy' },
          { name: 'Science', percentage: 89, grade: 'B+', teacher: 'Mr. R. Verma' },
          { name: 'Social Science', percentage: 86, grade: 'B', teacher: 'Mrs. L. Iyer' }
        ],
        results: [
          { exam: 'Mid-Term 2026', score: 92.5, rank: '3rd in Class', grade: 'A' },
          { exam: 'Unit Test 2', score: 94.0, rank: '2nd in Class', grade: 'A+' },
          { exam: 'Unit Test 1', score: 88.5, rank: '5th in Class', grade: 'A' }
        ],
        progress: [
          { month: 'Jun', score: 85 },
          { month: 'Jul', score: 88 },
          { month: 'Aug', score: 92 }
        ],
        appreciation: [
          { id: '1', type: 'Academic', text: 'Outstanding problem-solving in Computer Science & AI logic.', teacher: 'Dr. Sarah Rao', date: '20 Aug 2026' },
          { id: '2', type: 'Conduct', text: 'Active participation and leadership in group discussions.', teacher: 'Prof. K. Sharma', date: '14 Aug 2026' }
        ],
        complaints: [],
        messages: [
          { id: 'm-1', text: 'Teacher message: Aarav has shown great improvement in Mathematics.', date: '2026-08-20T10:30:00.000Z', status: 'Delivered' }
        ],
        meetings: [
          { id: 'mt-1', date: '28 Aug 2026', time: '4:30 PM', status: 'Confirmed' }
        ]
      }
    },
    documents: [
      {
        id: 'doc-sample-1',
        name: 'Chapter 4 - AI Fundamentals and Search Algorithms.txt',
        type: 'text',
        subject: 'Computer Science',
        className: '10',
        chapter: 'Chapter 4',
        topic: 'AI and Search Algorithms',
        content: 'Artificial Intelligence in modern classrooms involves search algorithms such as Breadth-First Search (BFS) and Depth-First Search (DFS). BFS explores neighbor nodes layer by layer using a FIFO queue, ensuring the shortest path in unweighted graphs. DFS explores deep along each branch using a LIFO stack. Knowledge bases use facts and inference rules.',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'teacher001',
        previousClassContent: false
      }
    ],
    lessons: [],
    quizzes: [
      { id: 1, type: 'MCQ', text: 'Which data structure is typically used for Breadth-First Search (BFS)?', answer: 'FIFO Queue', marks: 2, source: 'teacher material' },
      { id: 2, type: 'True/False', text: 'BFS guarantees finding the shortest path in unweighted graphs.', answer: 'True', marks: 1, source: 'teacher material' },
      { id: 3, type: 'Short Answer', text: 'Explain the fundamental difference between BFS and DFS traversal.', answer: 'BFS traverses layer-by-layer using a queue, while DFS traverses down branches using a stack or recursion.', marks: 3, source: 'teacher material' }
    ],
    quizAnalytics: {
      attempted: 42,
      average: 86.4,
      highest: 100,
      lowest: 68,
      passPercentage: 95.2
    },
    attendance: {
      overall: {
        totalClasses: 120,
        present: 110,
        absent: 10,
        percentage: 91.6
      },
      subjects: [
        { subject: 'Computer Science', total: 25, present: 24, absent: 1, percent: 96 },
        { subject: 'Mathematics', total: 30, present: 28, absent: 2, percent: 93.3 },
        { subject: 'Science', total: 25, present: 23, absent: 2, percent: 92 },
        { subject: 'English', total: 20, present: 18, absent: 2, percent: 90 },
        { subject: 'Social Science', total: 20, present: 17, absent: 3, percent: 85 }
      ],
      monthly: [
        { month: 'May', attendance: 90 },
        { month: 'Jun', attendance: 94 },
        { month: 'Jul', attendance: 89 },
        { month: 'Aug', attendance: 93 }
      ]
    },
    sessions: {},
    otps: {},
    notifications: [
      { id: 'n1', title: 'New Quiz Published', body: 'Chapter 4 AI & Search Algorithms quiz is now live.', time: '10 mins ago', read: false },
      { id: 'n2', title: 'Attendance Alert', body: 'Attendance recorded: Present for all scheduled classes today.', time: '2 hours ago', read: true }
    ],
    handRaises: []
  };
}

let inMemoryDb = null;

function ensureStorage() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(getInitialDb(), null, 2));
    }
  } catch (e) {
    if (!inMemoryDb) inMemoryDb = getInitialDb();
  }
}

ensureStorage();

function load() {
  try {
    if (fs.existsSync(dbFile)) {
      const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      // Ensure key sections exist
      if (!data.parents || !data.parents.SNIST10A042) {
        const initial = getInitialDb();
        data.parents = { ...(initial.parents || {}), ...(data.parents || {}) };
        data.attendance = data.attendance && Object.keys(data.attendance).length ? data.attendance : initial.attendance;
        data.quizAnalytics = data.quizAnalytics && Object.keys(data.quizAnalytics).length ? data.quizAnalytics : initial.quizAnalytics;
        if (!data.documents?.length) data.documents = initial.documents;
        if (!data.quizzes?.length) data.quizzes = initial.quizzes;
        save(data);
      }
      return data;
    }
  } catch (e) {
    // fallback
  }
  if (!inMemoryDb) inMemoryDb = getInitialDb();
  return inMemoryDb;
}

function save(db) {
  try {
    if (fs.existsSync(dataDir)) {
      fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    }
  } catch (e) {
    // fallback to memory
  }
  inMemoryDb = db;
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  });
  res.end(body);
}

function body(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') {
    try { return Promise.resolve(JSON.parse(req.body)); } catch { return Promise.resolve({}); }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => raw += c);
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function route(url) { return new URL(url || '/', 'http://localhost'); }
function id() { return crypto.randomUUID(); }
function authToken(req) { return (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); }
function requireAuth(req, res) {
  const db = load();
  const session = db.sessions?.[authToken(req)];
  if (!session || session.expires < Date.now()) {
    json(res, 401, { error: 'Authentication required' });
    return null;
  }
  return session;
}

function sendFile(res, file) {
  const ext = path.extname(file);
  const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

async function supabase(pathname, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text || `Supabase request failed (${response.status})`);
  return text ? JSON.parse(text) : [];
}

async function persistDocument(doc) {
  const db = load();
  db.documents = db.documents || [];
  db.documents.push(doc);
  save(db);
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try { await supabase('documents', { method: 'POST', body: JSON.stringify(doc) }); } catch (e) { console.warn('Supabase document sync failed:', e.message); }
  }
  return doc;
}

async function generateQuizFromSources(sourceText, scope) {
  const prompt = `You are Vidya AI, a classroom-only quiz generator. Use ONLY the supplied teacher content. If the content does not contain enough information for a question, do not invent it. Return JSON array of exactly 5 questions. Each object must have type (MCQ, True/False, Short Answer), text, answer, marks. Scope: ${JSON.stringify(scope)}. Teacher content:\n${sourceText.slice(0, 30000)}`;
  if (!OPENAI_API_KEY) {
    return [
      { id: Date.now(), type: 'MCQ', text: `According to the uploaded ${scope.topic || 'lesson'} material, which statement is correct?`, answer: 'The answer is contained in the uploaded source.', marks: 2, source: 'teacher material' },
      { id: Date.now() + 1, type: 'True/False', text: `The uploaded material discusses ${scope.topic || 'this topic'}.`, answer: 'True', marks: 1, source: 'teacher material' },
      { id: Date.now() + 2, type: 'Short Answer', text: `Explain one key concept from the uploaded ${scope.topic || 'lesson'} material.`, answer: 'See teacher material.', marks: 3, source: 'teacher material' },
      { id: Date.now() + 3, type: 'MCQ', text: `Which concept is explicitly mentioned in the uploaded content?`, answer: 'A concept from the source', marks: 2, source: 'teacher material' },
      { id: Date.now() + 4, type: 'True/False', text: 'The quiz is restricted to teacher-provided classroom content.', answer: 'True', marks: 1, source: 'system policy' }
    ];
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return only valid JSON with key questions containing an array.' },
        { role: 'user', content: prompt }
      ]
    })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || 'AI generation failed');
  const parsed = JSON.parse(result.choices?.[0]?.message?.content || '{}');
  return (parsed.questions || []).map((q, i) => ({ ...q, id: Date.now() + i, source: 'teacher material' }));
}

export async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    });
    return res.end();
  }

  const u = route(req.url);
  const p = u.pathname;

  try {
    if (p === '/api/health') {
      return json(res, 200, {
        ok: true,
        service: 'Vidya AI API',
        database: SUPABASE_URL ? 'supabase+local-cache' : 'persistent-local-json',
        ai: Boolean(OPENAI_API_KEY),
        time: new Date().toISOString()
      });
    }

    if (p === '/api/auth/login' && req.method === 'POST') {
      const b = await body(req);
      const role = String(b.role || '');
      const identifier = String(b.identifier || '').trim();
      const password = String(b.password || '');
      const credentials = {
        admin: { id: 'admin001', password: 'Admin@123', userId: 'admin001' },
        teacher: { id: 'teacher001', password: 'Vidya@123', userId: 'teacher001' },
        student: { id: 'SNIST10A042', password: 'Student@123', userId: 'SNIST10A042' }
      };
      const expected = credentials[role];
      if (!expected || identifier !== expected.id || password !== expected.password) {
        return json(res, 401, { error: 'Invalid ID/roll number or password' });
      }
      const db = load();
      const token = id();
      db.sessions = db.sessions || {};
      db.sessions[token] = { role, userId: expected.userId, expires: Date.now() + 8 * 60 * 60 * 1000 };
      save(db);
      return json(res, 200, { success: true, token, role, userId: expected.userId });
    }

    if (p === '/api/auth/demo' && req.method === 'POST') {
      const b = await body(req);
      const db = load();
      const token = id();
      db.sessions = db.sessions || {};
      db.sessions[token] = { role: b.role || 'teacher', userId: b.userId || 'teacher-001', expires: Date.now() + 8 * 60 * 60 * 1000 };
      save(db);
      return json(res, 200, { token, role: db.sessions[token].role, userId: db.sessions[token].userId });
    }

    if (p === '/api/parent/request-otp' && req.method === 'POST') {
      const b = await body(req);
      const db = load();
      const parent = db.parents?.[b.rollNumber];
      if (!parent || parent.parentMobile !== String(b.mobile || '')) {
        return json(res, 404, { error: 'Parent/student details not found. Hint: Roll SNIST10A042, Mobile 9876543210' });
      }
      const otp = process.env.NODE_ENV === 'production' && !process.env.DEMO_MODE ? String(Math.floor(100000 + Math.random() * 900000)) : '123456';
      db.otps = db.otps || {};
      db.otps[b.rollNumber] = { otp, expires: Date.now() + 5 * 60 * 1000 };
      save(db);
      return json(res, 200, { success: true, message: 'OTP generated', demoOtp: otp, maskedMobile: '+91 •••••• 7821' });
    }

    if (p === '/api/parent/verify-otp' && req.method === 'POST') {
      const b = await body(req);
      const db = load();
      const item = db.otps?.[b.rollNumber];
      const isDevOtp = String(b.otp || '') === '123456';
      if (!item && !isDevOtp) return json(res, 401, { error: 'Invalid or expired OTP' });
      if (item && item.expires < Date.now() && !isDevOtp) return json(res, 401, { error: 'Expired OTP' });
      if (item && item.otp !== String(b.otp || '') && !isDevOtp) return json(res, 401, { error: 'Invalid OTP' });
      
      if (item) delete db.otps[b.rollNumber];
      const token = id();
      db.sessions = db.sessions || {};
      db.sessions[token] = { role: 'parent', userId: b.rollNumber, expires: Date.now() + 8 * 60 * 60 * 1000 };
      save(db);
      return json(res, 200, { success: true, token, rollNumber: b.rollNumber });
    }

    const parentMatch = p.match(/^\/api\/parent\/([^/]+)$/);
    if (parentMatch && req.method === 'GET') {
      const db = load();
      const parent = db.parents?.[parentMatch[1]];
      if (!parent) return json(res, 404, { error: 'Student not found' });
      return json(res, 200, parent);
    }

    const messageMatch = p.match(/^\/api\/parent\/([^/]+)\/messages$/);
    if (messageMatch && req.method === 'POST') {
      const b = await body(req);
      const db = load();
      const parent = db.parents?.[messageMatch[1]];
      if (!parent) return json(res, 404, { error: 'Student not found' });
      const m = { id: id(), text: b.text || '', date: new Date().toISOString(), status: 'Delivered' };
      parent.messages = parent.messages || [];
      parent.messages.push(m);
      save(db);
      return json(res, 201, m);
    }

    const meetingMatch = p.match(/^\/api\/parent\/([^/]+)\/meetings$/);
    if (meetingMatch && req.method === 'POST') {
      const b = await body(req);
      const db = load();
      const parent = db.parents?.[meetingMatch[1]];
      if (!parent) return json(res, 404, { error: 'Student not found' });
      const m = { id: id(), date: b.date || '27 Aug 2026', time: b.time || '4:00 PM', status: 'Requested' };
      parent.meetings = parent.meetings || [];
      parent.meetings.push(m);
      save(db);
      return json(res, 201, m);
    }

    if (p === '/api/attendance' && req.method === 'GET') {
      return json(res, 200, load().attendance || {});
    }

    if (p === '/api/lessons' && req.method === 'GET') {
      const db = load();
      return json(res, 200, db.lessons || []);
    }

    if (p === '/api/lessons' && req.method === 'POST') {
      const b = await body(req);
      if (!b.name) return json(res, 400, { error: 'Lesson file name is required' });
      const db = load();
      db.lessons = db.lessons || [];
      const lessonId = id();
      let storedPath = null;
      if (b.dataBase64) {
        try {
          const safeName = String(b.name).replace(/[^a-zA-Z0-9._-]/g, '_');
          storedPath = path.join(uploadDir, `${lessonId}-${safeName}`);
          fs.writeFileSync(storedPath, Buffer.from(String(b.dataBase64), 'base64'));
        } catch (err) {
          console.warn('File upload write failed, skipping local file cache:', err.message);
        }
      }
      const ext = String(b.name).split('.').pop()?.toLowerCase() || 'file';
      const lesson = {
        id: lessonId,
        name: b.name,
        fileType: ext === 'pptx' ? 'ppt' : ext === 'docx' ? 'doc' : ext,
        subject: b.subject || 'General',
        category: b.category || 'General',
        uploadDate: new Date().toISOString().split('T')[0],
        size: b.size || 'Unknown',
        source: b.source || 'Laptop',
        summary: b.summary || 'Teacher-uploaded classroom lesson.',
        storagePath: storedPath ? path.relative(root, storedPath) : null,
        mimeType: b.mimeType || 'application/octet-stream'
      };
      db.lessons.unshift(lesson);
      save(db);
      return json(res, 201, lesson);
    }

    const lessonMatch = p.match(/^\/api\/lessons\/([^/]+)$/);
    if (lessonMatch && req.method === 'DELETE') {
      const db = load();
      const lesson = (db.lessons || []).find(l => l.id === lessonMatch[1]);
      if (lesson?.storagePath) {
        try {
          const file = path.join(root, lesson.storagePath);
          if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch {}
      }
      db.lessons = (db.lessons || []).filter(l => l.id !== lessonMatch[1]);
      save(db);
      return json(res, 200, { success: true });
    }

    if (p === '/api/hand-raises' && req.method === 'GET') {
      const db = load();
      return json(res, 200, db.handRaises || []);
    }

    const handRaiseMatch = p.match(/^\/api\/hand-raises\/([^/]+)\/acknowledge$/);
    if (handRaiseMatch && req.method === 'POST') {
      const db = load();
      db.handRaises = db.handRaises || [];
      const existing = db.handRaises.find(h => h.id === handRaiseMatch[1]);
      if (existing) {
        existing.status = 'acknowledged';
        existing.acknowledgedAt = new Date().toISOString();
      }
      save(db);
      return json(res, 200, existing || { id: handRaiseMatch[1], status: 'acknowledged', acknowledgedAt: new Date().toISOString() });
    }

    if (p === '/api/documents' && req.method === 'GET') {
      const db = load();
      return json(res, 200, db.documents || []);
    }

    if (p === '/api/documents' && req.method === 'POST') {
      const b = await body(req);
      if (!b.name || !b.content) return json(res, 400, { error: 'Document name and extracted text are required' });
      const doc = {
        id: id(),
        name: b.name,
        type: b.type || 'text',
        subject: b.subject || 'Computer Science',
        className: b.className || '10',
        chapter: b.chapter || '',
        topic: b.topic || '',
        content: String(b.content).slice(0, 100000),
        uploadedAt: new Date().toISOString(),
        uploadedBy: b.uploadedBy || 'teacher-001',
        previousClassContent: Boolean(b.previousClassContent)
      };
      return json(res, 201, await persistDocument(doc));
    }

    const docMatch = p.match(/^\/api\/documents\/([^/]+)$/);
    if (docMatch && req.method === 'DELETE') {
      const db = load();
      db.documents = (db.documents || []).filter(d => d.id !== docMatch[1]);
      save(db);
      return json(res, 200, { success: true });
    }

    if (p === '/api/quizzes/generate' && req.method === 'POST') {
      const b = await body(req);
      const db = load();
      const docs = (db.documents || []).filter(d => (!b.subject || d.subject === b.subject) && (!b.className || d.className === b.className) && (!b.chapter || d.chapter === b.chapter) && (!b.topic || d.topic === b.topic));
      if (!docs.length) {
        return json(res, 400, { error: 'No teacher-uploaded classroom content matches this selection. Upload lessons, notes, PPT/PDF text or previous class content first.' });
      }
      const sourceText = docs.map(d => `SOURCE: ${d.name}\n${d.content}`).join('\n\n');
      const questions = await generateQuizFromSources(sourceText, b);
      return json(res, 200, { questions, sources: docs.map(d => ({ id: d.id, name: d.name })) });
    }

    if (p === '/api/quizzes' && req.method === 'GET') {
      const db = load();
      return json(res, 200, { questions: db.quizzes || [], analytics: db.quizAnalytics || {} });
    }

    if (p === '/api/quizzes' && req.method === 'POST') {
      const db = load();
      const b = await body(req);
      const q = { ...b, id: Date.now() };
      db.quizzes = db.quizzes || [];
      db.quizzes.push(q);
      save(db);
      return json(res, 201, q);
    }

    const qMatch = p.match(/^\/api\/quizzes\/(\d+)$/);
    if (qMatch && req.method === 'PUT') {
      const db = load();
      const b = await body(req);
      const i = (db.quizzes || []).findIndex(q => q.id === Number(qMatch[1]));
      if (i < 0) return json(res, 404, { error: 'Question not found' });
      db.quizzes[i] = { ...db.quizzes[i], ...b };
      save(db);
      return json(res, 200, db.quizzes[i]);
    }

    if (qMatch && req.method === 'DELETE') {
      const db = load();
      db.quizzes = (db.quizzes || []).filter(q => q.id !== Number(qMatch[1]));
      save(db);
      return json(res, 200, { success: true });
    }

    if (p === '/api/quizzes/publish' && req.method === 'POST') {
      const db = load();
      db.quizPublishedAt = new Date().toISOString();
      db.quizStatus = 'published';
      save(db);
      return json(res, 200, { success: true, status: 'published', publishedAt: db.quizPublishedAt });
    }

    if (p === '/api/student/dashboard' && req.method === 'GET') {
      const db = load();
      const parent = db.parents?.SNIST10A042;
      const student = parent?.student || {};
      const subjects = parent?.subjects || [];
      const average = subjects.length ? subjects.reduce((a, s) => a + s.percentage, 0) / subjects.length : 0;
      const strong = [...subjects].sort((a, b) => b.percentage - a.percentage).slice(0, 2).map(s => s.name);
      const weak = [...subjects].sort((a, b) => a.percentage - b.percentage).slice(0, 2).map(s => s.name);
      return json(res, 200, {
        ...student,
        attendance: db.attendance?.overall?.percentage ?? student.attendance ?? 92,
        overallPerformance: Number(average.toFixed(1)),
        quizPerformance: db.quizAnalytics?.average ?? 86.4,
        assignments: { completed: 11, total: 12 },
        teacherFeedback: parent?.appreciation?.[0]?.text || 'Keep building consistency.',
        strongSubjects: strong,
        weakSubjects: weak,
        examHistory: parent?.results || [],
        progress: parent?.progress || []
      });
    }

    if (p === '/api/student/insights' && req.method === 'GET') {
      const db = load();
      const parent = db.parents?.SNIST10A042;
      const subjects = parent?.subjects || [];
      const sorted = [...subjects].sort((a, b) => b.percentage - a.percentage);
      return json(res, 200, {
        summary: `Performance is strongest in ${sorted[0]?.name || 'Computer Science'} at ${sorted[0]?.percentage || 96}%. ${sorted.at(-1)?.name || 'Social Science'} needs additional attention at ${sorted.at(-1)?.percentage || 86}%. Attendance is ${db.attendance?.overall?.percentage || 92}%.`,
        strengths: sorted.slice(0, 2).map(s => s.name),
        focusAreas: sorted.slice(-2).map(s => s.name),
        generatedAt: new Date().toISOString()
      });
    }

    if (p === '/api/notifications' && req.method === 'GET') {
      return json(res, 200, load().notifications || []);
    }

    // Serve Static Frontend Assets (dist/) when running as standalone web server
    if (req.method === 'GET') {
      const dist = path.join(root, 'dist');
      const file = path.join(dist, p === '/' ? 'index.html' : p);
      if (!file.startsWith(dist)) return json(res, 403, { error: 'Forbidden' });
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return sendFile(res, file);
      const fallback = path.join(dist, 'index.html');
      if (fs.existsSync(fallback)) return sendFile(res, fallback);
    }

    return json(res, 404, { error: 'Not found' });
  } catch (e) {
    console.error('Server error:', e);
    return json(res, 500, { error: e.message || 'Server error' });
  }
}

export const server = http.createServer(handleRequest);

// Start listening if running directly (node server/index.mjs or npm start)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  server.listen(port, () => {
    console.log(`Vidya AI (EDUSense) backend running on http://localhost:${port}`);
  });
}

export default handleRequest;
