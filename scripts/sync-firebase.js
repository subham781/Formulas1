const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(sa),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const db = admin.database();

const EXAM_MAP = {
  'SSC_CGL': 'SSC_CGL',
  'SSC_MTS': 'SSC_MTS',
  'SSC_CPO': 'SSC_CPO',
  'SSC_CHSL': 'SSC_CHSL',
  'SSC_GD': 'SSC_GD',
  'NDA': 'NDA',
  'CDS': 'CDS',
  'Navy': 'Navy',
  'Army': 'Army',
  'Air_Force': 'Air_Force',
};

function findPapers(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) findPapers(full, list);
    else if (name.endsWith('.json') && !name.includes('firebase')) list.push(full);
  }
  return list;
}

function detectLevel(title) {
  if (!title) return 'Hard';
  const t = String(title).toLowerCase();
  if (t.includes('easy')) return 'Easy';
  if (t.includes('medium')) return 'Medium';
  if (t.includes('hard')) return 'Hard';
  return 'Hard';
}

async function main() {
  const root = process.cwd();
  const files = findPapers(root);
  let count = 0;

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 3) continue;

    const examFolder = parts[0];
    const exam = EXAM_MAP[examFolder];
    if (!exam) continue;

    const fileName = parts[parts.length - 1];
    const match = fileName.match(/mock[_-]?(\d+)/i);
    if (!match) continue;

    const num = match[1].padStart(2, '0');
    const mockKey = `mock_${num}`;

    let paper;
    try {
      paper = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      console.log('Skip invalid JSON:', rel);
      continue;
    }

    const qCount = (paper.questions && paper.questions.length) || paper.totalQuestions || 0;
    if (qCount < 10) {
      console.log('Skip incomplete paper:', rel, 'questions=', qCount);
      continue;
    }

    const title =
      paper.title ||
      `${exam} Full Length Mock Test ${num} (Hard Level)`;
    const level = paper.level || detectLevel(title);
    const duration = paper.durationMinutes || paper.duration || 60;
    const marks = paper.marksPerQuestion || paper.marks || 2;
    const negativeMarks =
      paper.negativeMarks !== undefined && paper.negativeMarks !== null
        ? paper.negativeMarks
        : 0.5;
    const questions = paper.totalQuestions || qCount;

    const rawUrl =
      `https://raw.githubusercontent.com/subham781/Formulas1/refs/heads/main/${rel}`;

    // Full Firebase meta — same style as before
    const meta = {
      title: title,
      level: level,
      duration: duration,
      time: duration,
      marks: marks,
      marksPerQuestion: marks,
      negativeMarks: negativeMarks,
      questions: questions,
      totalQuestions: questions,
      jsonUrl: rawUrl,
      exam: paper.exam || exam,
      testType: paper.testType || 'fullLength',
      testId: paper.testId || `${exam.toLowerCase()}_full_length_mock_${num}`,
    };

    const fbPath = `${exam}/fullLength/testSeries/${mockKey}`;
    await db.ref(fbPath).set(meta);
    console.log('Synced', fbPath);
    console.log('  title:', meta.title);
    console.log('  questions:', meta.questions, '| duration:', meta.duration, '| level:', meta.level);
    console.log('  jsonUrl:', meta.jsonUrl);
    count++;
  }

  console.log('Done. Synced', count, 'papers');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
