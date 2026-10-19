import https from 'https';

const urls = [
  {
    name: 'Executive Interview Preparation Track',
    url: 'https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  },
  {
    name: 'Fluency Builder Plan',
    url: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  }
];

urls.forEach(({ name, url }) => {
  https.get(url, (res) => {
    console.log(`${name}: HTTP ${res.statusCode} ${res.headers['content-type']}`);
  }).on('error', (e) => {
    console.error(`${name}: Error ${e.message}`);
  });
});
