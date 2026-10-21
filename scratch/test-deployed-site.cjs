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

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data ? JSON.parse(data) : {}));
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- Opening https://www.edqoo.com in fresh tab ---');
  const newTab = await createTab('http://localhost:9222/json/new?https://www.edqoo.com');
  console.log('Created tab:', newTab.id);

  const ws = new WebSocket(newTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.on('open', () => console.log('Connected to deployed tab CDP'));
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

  // Set window size to desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 400));

  // Install tracer
  await evaluate(`
    window.__scrollLogs = [];
    window.__callTraces = [];
    window.addEventListener('scroll', () => {
      window.__scrollLogs.push({ time: performance.now(), y: window.scrollY });
    }, { passive: true });

    const origScrollTo = window.scrollTo;
    const origScrollIntoView = Element.prototype.scrollIntoView;
    window.scrollTo = function(...args) {
      window.__callTraces.push({ type: 'scrollTo', args, y: window.scrollY, stack: new Error().stack });
      return origScrollTo.apply(this, args);
    };
    Element.prototype.scrollIntoView = function(...args) {
      window.__callTraces.push({ type: 'scrollIntoView', target: this.tagName + '.' + this.className, y: window.scrollY, stack: new Error().stack });
      return origScrollIntoView.apply(this, args);
    };
  `);

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
  console.log('Deployed site initial:', initial);

  // Step 2: Scroll to bottom of website
  console.log('Step 2: Scrolling to bottom of website...');
  await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 1200));
  const bottomY = await evaluate('return window.scrollY');
  console.log('At bottom, scrollY =', bottomY);

  // Step 3: Scroll back up to Explore Our Programs
  console.log('Step 3: Scrolling back up to Explore Our Programs...');
  // Human scroll back up to Explore Our Programs
  const targetY = Math.round(initial.secTop + 80);
  await evaluate(`window.scrollTo({ top: ${targetY}, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 1200));

  const atSection = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      secTop: r ? Math.round(r.top) : null,
      secBottom: r ? Math.round(r.bottom) : null
    };
  `);
  console.log('At section before clicking category:', atSection);

  // Step 4: Click Spoken English
  console.log('Step 4: Clicking Spoken English on deployed site...');
  await evaluate(`window.__scrollLogs = []; window.__callTraces = [];`);

  const clickRes = await evaluate(`
    const asideButtons = Array.from(document.querySelectorAll('#programs aside button'));
    const mobileButtons = Array.from(document.querySelectorAll('#programs button'));
    const spokenBtn = asideButtons.find(b => b.textContent.includes('Spoken English')) ||
                      mobileButtons.find(b => b.textContent.includes('Spoken English'));
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
        scrollY: window.scrollY,
        secTop: r ? Math.round(r.top) : null,
        secBottom: r ? Math.round(r.bottom) : null,
        scrollCount: window.__scrollLogs.length,
        tracesCount: window.__callTraces.length
      };
    `);
    console.log(`Tick ${i * 500}ms:`, status);
  }

  const logs = await evaluate('return { scrollLogs: window.__scrollLogs, callTraces: window.__callTraces };');
  console.log('Scroll Logs:', JSON.stringify(logs.scrollLogs, null, 2));
  console.log('Call Traces:', JSON.stringify(logs.callTraces, null, 2));

  // Check what section is in view
  const visible = await evaluate(`
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
  console.log('Visible sections after click:', visible);

  await getJson(`http://localhost:9222/json/close/${newTab.id}`);
  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
