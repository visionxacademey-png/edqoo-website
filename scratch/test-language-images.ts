import https from 'https';

const candidateImages = [
  // 1. Malayalam - Indian/Asian student/learner with laptop & headphones engaged in online learning
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',

  // 2. Kannada - person learning with notes and tutor/video
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',

  // 3. Telugu - student speaking with mentor/teacher online
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=800&auto=format&fit=crop',

  // 4. Tamil - active conversational language practice with laptop/notes
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
];

async function checkUrl(url: string): Promise<{ url: string; status: number; contentType: string }> {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode || 0,
        contentType: res.headers['content-type'] || ''
      });
    }).on('error', () => {
      resolve({ url, status: 0, contentType: 'error' });
    });
  });
}

async function run() {
  console.log('Testing Unsplash candidate photos...');
  for (const url of candidateImages) {
    const res = await checkUrl(url);
    console.log(`[${res.status}] ${res.contentType} -> ${url}`);
  }
}

run();
