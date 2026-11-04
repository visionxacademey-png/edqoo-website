const https = require('https');

function search(q) {
  return new Promise(resolve => {
    const postData = 'q=' + encodeURIComponent(q);
    const req = https.request('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const matches = [...data.matchAll(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/g)];
        const ids = [...new Set(matches.map(m => m[1]))];
        resolve(ids);
      });
    });
    req.on('error', (e) => resolve([]));
    req.write(postData);
    req.end();
  });
}

(async () => {
  const q1 = await search('site:unsplash.com/photos indian developer laptop');
  console.log('Indian developer:', q1.slice(0, 8));
  const q2 = await search('site:unsplash.com/photos artificial intelligence robot machine learning');
  console.log('AI/ML:', q2.slice(0, 8));
  const q3 = await search('site:unsplash.com/photos data science analytics dashboard');
  console.log('Analytics:', q3.slice(0, 8));
})();

