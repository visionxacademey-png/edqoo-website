const WebSocket = require('ws');

async function run() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/39FC850E9DAE29BDF97B42201D1E2A30');
  let id = 1;
  const pending = new Map();

  ws.on('open', () => console.log('Connected to tab CDP'));
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

  console.log('--- Step 1: Reloading page to simulate fresh first-load session ---');
  // Clear sessionStorage and localStorage items related to sessions if any
  await evaluate(`
    sessionStorage.clear();
    localStorage.removeItem('edqoo_active_sessions');
  `);

  await send('Page.reload', { ignoreCache: true });
  // Wait 3 seconds for fresh reload and data fetching
  await new Promise(r => setTimeout(r, 3000));

  console.log('Fresh page loaded.');

  // Set up logger
  await evaluate(`
    window.__scrollEvents = [];
    window.addEventListener('scroll', () => {
      window.__scrollEvents.push({ time: performance.now(), y: window.scrollY });
    }, { passive: true });
  `);

  const initialInfo = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      scrollY: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      secTop: r ? r.top + window.scrollY : null,
      secHeight: r ? r.height : null
    };
  `);
  console.log('Initial page info:', initialInfo);

  // Step 2: Scroll down to the bottom of the website, below Explore Our Programs
  console.log('--- Step 2: Scrolling down to the bottom of the website ---');
  await evaluate(`
    // Scroll using smooth or multiple steps like a human or directly to bottom
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  `);
  await new Promise(r => setTimeout(r, 1000));
  const bottomScrollY = await evaluate('return window.scrollY');
  console.log('Scrolled to bottom, scrollY =', bottomScrollY);

  // Step 3: Scroll back upward to Explore Our Programs section
  console.log('--- Step 3: Scrolling back upward to Explore Our Programs ---');
  const targetY = Math.round(initialInfo.secTop + 60);
  await evaluate(`
    window.scrollTo({ top: ${targetY}, behavior: 'instant' });
  `);
  await new Promise(r => setTimeout(r, 1000));

  const beforeClick = await evaluate(`
    const sec = document.getElementById('programs');
    const r = sec.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      secTop: Math.round(r.top),
      secBottom: Math.round(r.bottom)
    };
  `);
  console.log('Before clicking category:', beforeClick);

  // Step 4: Click Spoken English
  console.log('--- Step 4: Clicking Spoken English ---');
  await evaluate(`window.__scrollEvents = [];`);
  
  const clickRes = await evaluate(`
    const asideButtons = Array.from(document.querySelectorAll('#programs aside button'));
    const mobilePills = Array.from(document.querySelectorAll('#programs .lg\\\\:hidden button'));
    const btn = asideButtons.find(b => b.textContent.includes('Spoken English')) ||
                mobilePills.find(b => b.textContent.includes('Spoken English'));
    if (btn) {
      btn.click();
      return 'Clicked ' + btn.textContent.trim();
    }
    return 'Not found';
  `);
  console.log('Click result:', clickRes);

  // Step 5: Check if page jumps toward bottom
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
        scrollEventsCount: window.__scrollEvents.length
      };
    `);
    console.log(`Tick ${i * 500}ms:`, status);
  }

  const scrollEvents = await evaluate('return window.__scrollEvents;');
  console.log('Scroll events after click:', scrollEvents);

  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
