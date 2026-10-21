const WebSocket = require('ws');
const http = require('http');

function createTab(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: 'PUT' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

function closeTab(id) {
  return new Promise((resolve) => {
    http.get(`http://localhost:9222/json/close/${id}`, () => resolve()).on('error', () => resolve());
  });
}

async function run() {
  console.log('================================================================');
  console.log('RUNNING FULL EXPLORE PROGRAMS SCROLL AUDIT TESTS (LOCAL SERVER)');
  console.log('================================================================');

  const newTab = await createTab('http://localhost:9222/json/new?http://localhost:5173');
  const ws = new WebSocket(newTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.on('open', () => {});
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await new Promise(r => ws.on('open', r));

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression: `(() => { ${expression} })()`,
      returnByValue: true,
      awaitPromise: false
    });
    return res.result?.result?.value;
  };

  // Wait 3s for initial page load
  console.log('Waiting for initial page load on http://localhost:5173...');
  await new Promise(r => setTimeout(r, 3000));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 400));

  // TEST 1 — FIRST VISIT EXACT REPRODUCTION:
  console.log('\n--- TEST 1: FIRST VISIT EXACT REPRODUCTION ---');
  // 1. Initial info
  const initial = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      secTop: r ? Math.round(r.top + window.scrollY) : null,
      secHeight: r ? Math.round(r.height) : null
    };
  `);
  console.log('Initial state:', initial);

  // 2. Scroll to bottom
  console.log('Step 2: Scrolling down to bottom...');
  await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 800));
  const atBottomY = await evaluate('return window.scrollY');
  console.log('At bottom of website, scrollY =', atBottomY);

  // 3. Scroll back up to Explore Our Programs
  console.log('Step 3: Scrolling back up to Explore Our Programs...');
  const targetBackUpY = Math.round(initial.secTop + 80);
  await evaluate(`window.scrollTo({ top: ${targetBackUpY}, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 800));
  const beforeClick = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return { scrollY: window.scrollY, secTop: r ? Math.round(r.top) : null, secBottom: r ? Math.round(r.bottom) : null };
  `);
  console.log('At section before category click:', beforeClick);

  // 4. Click Spoken English
  console.log('Step 4: Clicking Spoken English...');
  const clickRes = await evaluate(`
    const asideButtons = Array.from(document.querySelectorAll('#programs aside button'));
    const btn = asideButtons.find(b => b.textContent.includes('Spoken English'));
    if (btn) {
      btn.click();
      return 'Clicked ' + btn.textContent.trim();
    }
    return 'Not found';
  `);
  console.log('Click result:', clickRes);

  // Monitor over 2.5 seconds
  for (let i = 1; i <= 5; i++) {
    await new Promise(r => setTimeout(r, 500));
    const status = await evaluate(`
      const sec = document.getElementById('programs');
      const r = sec ? sec.getBoundingClientRect() : null;
      return {
        time: ${i * 500} + 'ms',
        scrollY: Math.round(window.scrollY),
        secTop: r ? Math.round(r.top) : null,
        secBottom: r ? Math.round(r.bottom) : null
      };
    `);
    console.log(`Tick ${i * 500}ms:`, status);
  }

  const test1Visible = await evaluate(`
    const res = [];
    document.querySelectorAll('section').forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        res.push(s.id || s.querySelector('h2')?.textContent?.trim() || 'section');
      }
    });
    return res;
  `);
  console.log('Visible sections after Spoken English click:', test1Visible);
  const test1Passed = test1Visible.includes('programs');
  console.log('TEST 1 PASSED (Programs section remains visible in viewport):', test1Passed);

  // TEST 2 — OTHER CATEGORIES:
  console.log('\n--- TEST 2: SWITCHING OTHER CATEGORIES ---');
  for (const catName of ['Python', 'Data Science and AI', 'All Categories']) {
    console.log(`Clicking category: ${catName}...`);
    await evaluate(`
      const asideButtons = Array.from(document.querySelectorAll('#programs aside button'));
      const btn = asideButtons.find(b => b.textContent.includes('${catName}'));
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));
    const status = await evaluate(`
      const sec = document.getElementById('programs');
      const r = sec ? sec.getBoundingClientRect() : null;
      return {
        scrollY: Math.round(window.scrollY),
        secTop: r ? Math.round(r.top) : null,
        secBottom: r ? Math.round(r.bottom) : null
      };
    `);
    console.log(`After ${catName}:`, status);
  }

  // TEST 3 — DELAYED OPERATIONS:
  console.log('\n--- TEST 3: DELAYED OPERATIONS CHECK ---');
  console.log('Waiting 5 seconds to ensure no background timer or callback moves the page...');
  const beforeWaitY = await evaluate('return Math.round(window.scrollY)');
  await new Promise(r => setTimeout(r, 5000));
  const afterWaitY = await evaluate('return Math.round(window.scrollY)');
  console.log(`Scroll position before wait: ${beforeWaitY}, after 5s wait: ${afterWaitY}`);
  const test3Passed = Math.abs(afterWaitY - beforeWaitY) <= 1;
  console.log('TEST 3 PASSED (Zero delayed scroll operations):', test3Passed);

  // TEST 5 — MOBILE VIEWPORT:
  console.log('\n--- TEST 5: MOBILE VIEWPORT TEST (390x844) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));

  // Reset to top
  await evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 500));

  // Scroll to bottom on mobile
  await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 800));
  console.log('At mobile bottom, scrollY =', await evaluate('return Math.round(window.scrollY)'));

  // Scroll back up to Explore Our Programs on mobile
  const mobileSec = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return { secTop: r ? Math.round(r.top + window.scrollY) : null };
  `);
  await evaluate(`window.scrollTo({ top: ${mobileSec.secTop + 60}, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 800));

  console.log('Clicking Spoken English pill on mobile...');
  const mobileClickRes = await evaluate(`
    const pillButtons = Array.from(document.querySelectorAll('#programs button'));
    const btn = pillButtons.find(b => b.textContent.includes('Spoken English'));
    if (btn) {
      btn.click();
      return 'Clicked ' + btn.textContent.trim();
    }
    return 'Not found';
  `);
  console.log('Mobile click result:', mobileClickRes);
  await new Promise(r => setTimeout(r, 1000));

  const mobileStatus = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      scrollY: Math.round(window.scrollY),
      secTop: r ? Math.round(r.top) : null,
      secBottom: r ? Math.round(r.bottom) : null
    };
  `);
  console.log('Mobile status after click:', mobileStatus);
  const mobilePassed = mobileStatus.secTop < 844 && mobileStatus.secBottom > 0;
  console.log('TEST 5 PASSED (Mobile Explore Programs remains in view):', mobilePassed);

  await closeTab(newTab.id);
  ws.close();
  console.log('\n================================================================');
  console.log('ALL TESTS COMPLETED');
  console.log('================================================================');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
