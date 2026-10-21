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
  console.log('--- Creating fresh browser tab ---');
  const newTab = await createTab('http://localhost:9222/json/new?http://localhost:5173');
  console.log('Created tab:', newTab.id, newTab.webSocketDebuggerUrl);

  const ws = new WebSocket(newTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.on('open', () => console.log('Connected to new tab CDP'));
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

  // Wait 2.5s for initial page load
  console.log('Waiting for initial page load...');
  await new Promise(r => setTimeout(r, 2500));

  // Install tracer to catch all scroll operations
  await evaluate(`
    window.__scrollEvents = [];
    window.addEventListener('scroll', () => {
      window.__scrollEvents.push({ time: performance.now(), y: window.scrollY });
    }, { passive: true });

    window.__callTraces = [];
    const origScrollTo = window.scrollTo;
    const origScroll = window.scroll;
    const origScrollIntoView = Element.prototype.scrollIntoView;

    window.scrollTo = function(...args) {
      window.__callTraces.push({ type: 'scrollTo', args, y: window.scrollY, stack: new Error().stack });
      return origScrollTo.apply(this, args);
    };
    window.scroll = function(...args) {
      window.__callTraces.push({ type: 'scroll', args, y: window.scrollY, stack: new Error().stack });
      return origScroll.apply(this, args);
    };
    Element.prototype.scrollIntoView = function(...args) {
      window.__callTraces.push({ type: 'scrollIntoView', target: this.tagName + '.' + this.className, y: window.scrollY, stack: new Error().stack });
      return origScrollIntoView.apply(this, args);
    };
  `);

  const initialInfo = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      secTop: r ? r.top + window.scrollY : null,
      secHeight: r ? r.height : null
    };
  `);
  console.log('Initial page info:', initialInfo);

  // Step 2: Scroll down to the bottom of the website, below Explore Our Programs
  console.log('--- Step 2: Scrolling down to the bottom of the website ---');
  await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 800));

  const bottomY = await evaluate('return window.scrollY');
  console.log('At bottom of website, scrollY =', bottomY);

  // Step 3: Scroll back upward to Explore Our Programs section
  console.log('--- Step 3: Scrolling back upward to Explore Our Programs ---');
  // Scroll to section header
  const targetY = Math.round(initialInfo.secTop + 60);
  await evaluate(`window.scrollTo({ top: ${targetY}, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 800));

  const atPrograms = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      secTop: r ? r.top : null,
      secBottom: r ? r.bottom : null,
      secHeight: r ? r.height : null
    };
  `);
  console.log('At Explore Our Programs after scrolling up:', atPrograms);

  // Step 4: Click Spoken English
  console.log('--- Step 4: Clicking Spoken English ---');
  await evaluate(`window.__callTraces = []; window.__scrollEvents = [];`);
  
  const clickResult = await evaluate(`
    const asideButtons = Array.from(document.querySelectorAll('#programs aside button'));
    const spokenBtn = asideButtons.find(b => b.textContent.includes('Spoken English'));
    if (spokenBtn) {
      spokenBtn.click();
      return 'Clicked ' + spokenBtn.textContent.trim();
    }
    return 'Not found';
  `);
  console.log('Click result:', clickResult);

  // Monitor over 3 seconds
  for (let i = 1; i <= 6; i++) {
    await new Promise(r => setTimeout(r, 500));
    const status = await evaluate(`
      const sec = document.getElementById('programs');
      const r = sec ? sec.getBoundingClientRect() : null;
      return {
        time: ${i * 500} + 'ms',
        scrollY: window.scrollY,
        secTop: r ? Math.round(r.top) : null,
        secBottom: r ? Math.round(r.bottom) : null,
        callTracesCount: window.__callTraces.length,
        scrollEventsCount: window.__scrollEvents.length
      };
    `);
    console.log(`Tick ${i*500}ms:`, status);
  }

  const traces = await evaluate(`return window.__callTraces;`);
  console.log('All call traces:', JSON.stringify(traces, null, 2));

  // Close tab
  await getJson(`http://localhost:9222/json/close/${newTab.id}`);
  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
