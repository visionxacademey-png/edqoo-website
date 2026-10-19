const candidates = [
  {
    name: 'Fluency Builder Plan (Option 1)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Fluency Builder Plan (Option 2)',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Fluency Builder Plan (Option 3 - Headset on phone/call)',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Little Mirrors (Option 1 - Child learning with laptop)',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Little Mirrors (Option 2 - Young student with laptop)',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Little Mirrors (Option 3 - Child online education)',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Corporate English (Option 1 - Business meeting communication)',
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Corporate English (Option 2 - Professionals collaborating)',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Corporate English (Option 3 - Conference discussion)',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'IELTS Intensive (Option 1 - Student studying with laptop and notes)',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'IELTS Intensive (Option 2 - Study desk with laptop and books)',
    url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Executive Interview (Option 1 - Professional job interview)',
    url: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Executive Interview (Option 2 - Job interview handshake & coaching)',
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: '1-to-1 Communicative English Mastery',
    url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Default English Learning Fallback',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop'
  }
];

async function verifyAll() {
  console.log(`Verifying ${candidates.length} candidate image URLs...`);
  for (const item of candidates) {
    try {
      const res = await fetch(item.url, { method: 'HEAD' });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType?.startsWith('image/')) {
        console.log(`✅ [${res.status}] ${item.name}: VALID (${contentType})`);
      } else {
        console.log(`❌ [${res.status}] ${item.name}: FAIL (${contentType})`);
      }
    } catch (err: any) {
      console.log(`❌ ${item.name}: ERROR (${err.message})`);
    }
  }
}

verifyAll();
