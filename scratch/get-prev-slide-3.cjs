const { execSync } = require('child_process');
const fs = require('fs');

const buf = execSync('git show 5dbbf78:public/images/hero/hero-slide-3-desktop.jpg', { maxBuffer: 10 * 1024 * 1024 });
fs.writeFileSync('scratch/prev-slide-3.jpg', buf);

