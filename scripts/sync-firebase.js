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

    const paper = JSON.parse(fs.readFileSync(file, 'utf8'));
    const rawUrl =
      `https://raw.githubusercontent.com/subham781/Formulas1/refs/heads/main/${rel}`;

    const meta = {
      title: paper.title || `${exam} Full Length Mock ${num}`,
      duration: paper.durationMinutes || 60,
      marks: paper.marksPerQuestion || 2,
      negativeMarks: paper.negativeMarks ?? 0.5,
      questions: paper.totalQuestions || (paper.questions || []).length,
      jsonUrl: rawUrl,
    };

    const fbPath = `${exam}/fullLength/testSeries/${mockKey}`;
    await db.ref(fbPath).set(meta);
    console.log('Synced', fbPath, '->', rawUrl);
    count++;
  }

  console.log('Done. Synced', count, 'papers');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
