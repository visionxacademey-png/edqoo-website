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

  const nav = await evaluate(`
    const asideButtons = Array.from(document.querySelectorAll('#programs aside button')).map(b => b.textContent.trim());
    const mobilePills = Array.from(document.querySelectorAll('#programs .lg\\\\:hidden button')).map(b => b.textContent.trim());
    const hasAside = !!document.querySelector('#programs aside');
    const isAsideHidden = document.querySelector('#programs aside') ? getComputedStyle(document.querySelector('#programs aside')).display : null;
    return {
      windowWidth: window.innerWidth,
      hasAside,
      isAsideHidden,
      asideButtons,
      mobilePills
    };
  `);
  console.log('Category buttons info:', nav);

  ws.close();
  process.exit(0);
}

run().catch(console.error);
