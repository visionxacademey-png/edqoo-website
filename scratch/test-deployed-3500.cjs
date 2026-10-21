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
  console.log('--- Opening https://www.edqoo.com in fresh tab ---');
  const newTab = await createTab('http://localhost:9222/json/new?https://www.edqoo.com');
  console.log('Created tab:', newTab.id);

  const ws = new WebSocket(newTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.on('open', () => console.log('Connected to CDP'));
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

  // Wait 4 seconds for full load
  console.log('Waiting for deployed site to load...');
  await new Promise(r => setTimeout(r, 4000));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 300));

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
  console.log('Initial deployed state:', initial);

  // 1. Scroll to bottom
  console.log('Step 2: Scrolling to bottom of website...');
  await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 1000));
  console.log('At bottom, scrollY =', await evaluate('return window.scrollY'));

  // 2. Scroll back up to Y = 3500px (inside Explore Our Programs)
  console.log('Step 3: Scrolling back up to Y = 3500px...');
  await evaluate(`window.scrollTo({ top: 3500, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 1000));

  const beforeClick = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    const aside = sec ? sec.querySelector('aside') : null;
    const ar = aside ? aside.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      secTop: r ? Math.round(r.top) : null,
      secBottom: r ? Math.round(r.bottom) : null,
      asideTop: ar ? Math.round(ar.top) : null,
      asideVisible: ar ? (ar.top < window.innerHeight && ar.bottom > 0) : false
    };
  `);
  console.log('Before clicking Spoken English at Y=3500:', beforeClick);

  // Install tracer
  await evaluate(`
    window.__scrollLogs = [];
    window.addEventListener('scroll', () => {
      window.__scrollLogs.push({ time: Math.round(performance.now()), y: Math.round(window.scrollY) });
    }, { passive: true });
  `);

  // 3. Click Spoken English
  console.log('Step 4: Clicking Spoken English on deployed site...');
  const clickRes = await evaluate(`
    const asideButtons = Array.from(document.querySelectorAll('#programs aside button'));
    const spokenBtn = asideButtons.find(b => b.textContent.includes('Spoken English'));
    if (spokenBtn) {
      spokenBtn.click();
      return 'Clicked ' + spokenBtn.textContent.trim();
    }
    return 'Not found';
  `);
  console.log('Click result:', clickRes);

  // Monitor over 4 seconds
  for (let i = 1; i <= 8; i++) {
    await new Promise(r => setTimeout(r, 500));
    const status = await evaluate(`
      const sec = document.getElementById('programs');
      const r = sec ? sec.getBoundingClientRect() : null;
      return {
        time: ${i * 500} + 'ms',
        scrollY: Math.round(window.scrollY),
        docHeight: document.documentElement.scrollHeight,
        secTop: r ? Math.round(r.top) : null,
        secBottom: r ? Math.round(r.bottom) : null,
        scrollEventsCount: window.__scrollLogs.length
      };
    `);
    console.log(`Tick ${i * 500}ms:`, status);
  }

  const visibleSections = await evaluate(`
    const res = [];
    document.querySelectorAll('section').forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        res.push({
          id: s.id || null,
          title: s.querySelector('h2')?.textContent?.trim() || null,
          top: Math.round(r.top),
          bottom: Math.round(r.bottom)
        });
      }
    });
    return res;
  `);
  console.log('Visible sections in viewport:', visibleSections);

  const logs = await evaluate('return window.__scrollLogs;');
  console.log('Scroll events recorded:', logs.slice(0, 20));

  await closeTab(newTab.id);
  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
