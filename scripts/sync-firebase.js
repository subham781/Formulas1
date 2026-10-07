const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function mustEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    console.error('MISSING SECRET:', name);
    console.error('GitHub → Settings → Secrets → Actions me add karo:', name);
    process.exit(1);
  }
  return v;
}

let sa;
try {
  sa = JSON.parse(mustEnv('FIREBASE_SERVICE_ACCOUNT'));
} catch (e) {
  console.error('FIREBASE_SERVICE_ACCOUNT invalid JSON. Poori service account file paste karo.');
  console.error(e.message);
  process.exit(1);
}

const databaseURL = mustEnv('FIREBASE_DATABASE_URL').replace(/\/$/, '');
console.log('Database URL:', databaseURL);
console.log('Service account email:', sa.client_email || '(missing)');

admin.initializeApp({
  credential: admin.credential.cert(sa),
  databaseURL,
});
const db = admin.database();

const EXAM_MAP = {
  SSC_CGL: 'SSC_CGL',
  SSC_MTS: 'SSC_MTS',
  SSC_CPO: 'SSC_CPO',
  SSC_CHSL: 'SSC_CHSL',
  SSC_GD: 'SSC_GD',
  NDA: 'NDA',
  CDS: 'CDS',
  Navy: 'Navy',
  Army: 'Army',
  Air_Force: 'Air_Force',
};

function findPapers(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'scripts') continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) findPapers(full, list);
    else if (name.endsWith('.json') && !name.includes('firebase')) list.push(full);
  }
  return list;
}

async function main() {
  const root = process.cwd();
  const files = findPapers(root);
  console.log('Found json files:', files.length);
  let count = 0;

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 3) continue;

    const exam = EXAM_MAP[parts[0]];
    if (!exam) continue;

    const fileName = parts[parts.length - 1];
    const match = fileName.match(/mock[_-]?(\d+)/i);
    if (!match) continue;

    const n = parseInt(match[1], 10);
    const testKey = `Test ${n}`;

    let paper;
    try {
      paper = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      console.log('Skip invalid JSON:', rel);
      continue;
    }

    const qCount =
      (paper.questions && paper.questions.length) || paper.totalQuestions || 0;
    if (qCount < 10) {
      console.log('Skip incomplete:', rel, 'q=', qCount);
      continue;
    }

    const title =
      paper.title ||
      `${exam} Full Length Mock Test ${String(n).padStart(2, '0')} (Hard Level)`;
    const duration = paper.durationMinutes || paper.duration || 60;
    const marks = paper.marksPerQuestion || paper.marks || 2;
    const negativeMarks =
      paper.negativeMarks !== undefined && paper.negativeMarks !== null
        ? paper.negativeMarks
        : 0.5;
    const questions = paper.totalQuestions || qCount;
    const jsonUrl =
      `https://raw.githubusercontent.com/subham781/Formulas1/refs/heads/main/${rel}`;

    // EXACT format user uses
    const meta = {
      duration,
      jsonUrl,
      marks,
      negativeMarks,
      questions,
      title,
    };

    // Path: Air_Force/fullLength/testSeries/Test 2
    const fbPath = `${exam}/fullLength/testSeries/${testKey}`;
    try {
      await db.ref(fbPath).set(meta);
      console.log('OK', fbPath);
      console.log(JSON.stringify(meta, null, 2));
      count++;
    } catch (e) {
      console.error('FAIL write', fbPath, e.message);
      throw e;
    }
  }

  console.log('Done. Synced', count, 'papers');
  if (count === 0) {
    console.error('No complete papers found under Exam/Full_Length/*.json');
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error('FATAL:', e.message || e);
  process.exit(1);
});
