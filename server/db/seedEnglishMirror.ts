import { Pool } from '@neondatabase/serverless';
import { courses } from '../../src/data/courses.js';

export async function seedEnglishMirrorCourses(pool: Pool | null, mockStore: any): Promise<void> {
  const englishMirrorCourses = courses.filter((c) => c.category === 'English Mirror' || c.category === 'Spoken Tutorial');

  if (pool) {
    try {
      for (const course of englishMirrorCourses) {
        const checkRes = await pool.query('SELECT id FROM courses WHERE id = $1 OR slug = $2', [course.id, course.slug]);
        if (checkRes.rows.length === 0) {
          await pool.query(
            `INSERT INTO courses (
              id, slug, title, category, categories, short_description, description,
              image, price, original_price, duration, live_hours, lessons, level,
              rating, students, status, featured, skills, curriculum, modules,
              technology_stack, projects, career_readiness, outcome, features,
              requirements, who_is_it_for, seo_title, seo_description, seo_keywords,
              created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5::jsonb, $6, $7,
              $8, $9, $10, $11, $12, $13, $14,
              $15, $16, $17, $18, $19::jsonb, $20::jsonb, $21::jsonb,
              $22::jsonb, $23::jsonb, $24::jsonb, $25, $26::jsonb,
              $27::jsonb, $28::jsonb, $29, $30, $31::jsonb,
              NOW(), NOW()
            )`,
            [
              course.id,
              course.slug,
              course.title,
              course.category,
              JSON.stringify(course.categories || [course.category]),
              course.shortDescription || '',
              course.description || '',
              course.image || '/englishclass.png',
              course.price,
              course.originalPrice || 0,
              course.duration,
              course.liveHours || null,
              course.lessons,
              course.level,
              course.rating,
              course.students,
              course.status || 'available',
              course.featured ?? true,
              JSON.stringify(course.skills || []),
              JSON.stringify(course.curriculum || []),
              JSON.stringify(course.modules || []),
              JSON.stringify(course.technologyStack || []),
              JSON.stringify(course.projects || []),
              JSON.stringify(course.careerReadiness || []),
              course.outcome || '',
              JSON.stringify(course.features || []),
              JSON.stringify(course.requirements || []),
              JSON.stringify(course.whoIsItFor || []),
              course.seoTitle || null,
              course.seoDescription || null,
              JSON.stringify(course.seoKeywords || [])
            ]
          );
          console.log(`✅ [DB SEED] Seeded English Mirror course: ${course.title} (${course.slug})`);
        }
      }
    } catch (err: any) {
      console.warn('⚠️ [DB SEED] Notice on seeding English Mirror courses:', err.message);
    }
  }

  // Also ensure mockStore.courses has them
  if (mockStore && Array.isArray(mockStore.courses)) {
    for (const course of englishMirrorCourses) {
      const exists = mockStore.courses.some((c: any) => c.id === course.id || c.slug === course.slug);
      if (!exists) {
        mockStore.courses.push({
          ...course,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }
  }
}
