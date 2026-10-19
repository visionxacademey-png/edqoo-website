async function checkPort() {
  for (const port of [5173, 5174, 5175, 5000, 5001]) {
    try {
      const res = await fetch(`http://localhost:${port}/`, { method: 'HEAD' });
      console.log(`Port ${port}: OPEN (${res.status})`);
    } catch {
      console.log(`Port ${port}: CLOSED`);
    }
  }
}

checkPort();
