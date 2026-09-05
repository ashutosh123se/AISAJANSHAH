/**
 * Quick local admin API smoke test (DEV_AUTH / no Firebase).
 * Run: node test-admin-local.js
 */
const http = require('http');

const TOKEN = 'dev-token-local-admin-001';
const STUDENT_TOKEN = 'dev-token-local-student-001';

function request(method, path, body, token = TOKEN) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = data ? JSON.parse(data) : null;
          } catch {
            json = data;
          }
          resolve({ status: res.statusCode, body: json });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const email = `smoke_${Date.now()}@example.com`;
  const checks = [];

  const stats = await request('GET', '/api/admin/stats');
  checks.push(['stats', stats.status === 200 && typeof stats.body.totalStudents === 'number']);

  const list = await request('GET', '/api/admin/students');
  checks.push(['list students', list.status === 200 && Array.isArray(list.body)]);

  const created = await request('POST', '/api/admin/students', {
    name: 'Smoke Test',
    email,
    phone: '+910000000000',
    workshop: 'Memory Workshop',
    password: 'TempPass123!',
    sendEmail: true,
  });
  checks.push(['create student', created.status === 201 && created.body.uid]);

  const logs = await request('GET', '/api/admin/email-logs');
  checks.push(['email logs', logs.status === 200 && Array.isArray(logs.body)]);

  const bulk = await request('POST', '/api/admin/bulk-upload', {
    students: [
      { name: 'Bulk A', email: `bulk_a_${Date.now()}@example.com`, workshop: 'Bulk Upload' },
      { name: 'Bulk B', email: `bulk_b_${Date.now()}@example.com` },
    ],
  });
  checks.push(['bulk upload', bulk.status === 200 && bulk.body.successful >= 1]);

  if (created.body?.uid) {
    const del = await request('DELETE', `/api/admin/students/${created.body.uid}`);
    checks.push(['delete student', del.status === 200]);
  }

  const forbidden = await request('GET', '/api/admin/stats', null, STUDENT_TOKEN);
  checks.push(['student forbidden', forbidden.status === 403]);

  let failed = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
    if (!ok) failed++;
  }
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
