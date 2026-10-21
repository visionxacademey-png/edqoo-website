const WebSocket = require('ws');

async function run() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/39FC850E9DAE29BDF97B42201D1E2A30');
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

  // Reset to All Categories and scroll to top
  await evaluate(`
    const allBtn = Array.from(document.querySelectorAll('#programs aside button')).find(b => b.textContent.includes('All Categories'));
    if (allBtn) allBtn.click();
    window.scrollTo({ top: 0, behavior: 'instant' });
  `);
  await new Promise(r => setTimeout(r, 400));

  const sec = await evaluate(`
    const s = document.getElementById('programs');
    const r = s.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
  `);
  console.log('Section top:', sec.top, 'height:', sec.height);

  // Test various scroll back up positions:
  // e.g. 1500px down inside section, 3000px down inside section
  for (const downOffset of [1200, 2000, 3500]) {
    console.log(`\n=================== Testing scroll back up to offset ${downOffset}px ===================`);
    
    // 1. Scroll to bottom of website
    await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
    await new Promise(r => setTimeout(r, 300));
    console.log('Scrolled to bottom, scrollY =', await evaluate('return window.scrollY'));

    // 2. Scroll back up to sec.top + downOffset
    const backUpY = Math.round(sec.top + downOffset);
    await evaluate(`window.scrollTo({ top: ${backUpY}, behavior: 'instant' });`);
    await new Promise(r => setTimeout(r, 400));

    const before = await evaluate(`
      const s = document.getElementById('programs');
      const r = s.getBoundingClientRect();
      const aside = s.querySelector('aside');
      const ar = aside ? aside.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        secTop: Math.round(r.top),
        secBottom: Math.round(r.bottom),
        asideTop: ar ? Math.round(ar.top) : null
      };
    `);
    console.log('Before click:', before);

    // 3. Click Spoken English
    await evaluate(`
      const btn = Array.from(document.querySelectorAll('#programs aside button')).find(b => b.textContent.includes('Spoken English'));
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 500));

    const after = await evaluate(`
      const s = document.getElementById('programs');
      const r = s.getBoundingClientRect();
      const aside = s.querySelector('aside');
      const ar = aside ? aside.getBoundingClientRect() : null;
      // Also check what section is in the viewport
      const visible = [];
      document.querySelectorAll('section').forEach(secEl => {
        const sr = secEl.getBoundingClientRect();
        if (sr.bottom > 0 && sr.top < window.innerHeight) {
          visible.push(secEl.id || secEl.querySelector('h2')?.textContent?.trim() || 'section');
        }
      });
      return {
        scrollY: window.scrollY,
        secTop: Math.round(r.top),
        secBottom: Math.round(r.bottom),
        secHeight: Math.round(r.height),
        visible
      };
    `);
    console.log('After click:', after);

    // Reset back to All Categories
    await evaluate(`
      const allBtn = Array.from(document.querySelectorAll('#programs aside button')).find(b => b.textContent.includes('All Categories'));
      if (allBtn) allBtn.click();
    `);
    await new Promise(r => setTimeout(r, 400));
  }

  ws.close();
  process.exit(0);
}

run().catch(console.error);
