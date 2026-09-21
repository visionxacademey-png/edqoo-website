import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { LeadershipCouncilMember } from '../../src/types/index.js';

const router = Router();

function safeJsonParse<T>(val: any, fallback: T): T {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

function formatLeadershipRow(row: any): LeadershipCouncilMember {
  return {
    id: row.id,
    name: row.name || '',
    profileImage: row.profile_image || row.profileImage || '',
    designation: row.designation || '',
    organization: row.organization || '',
    qualification: row.qualification || undefined,
    experience: row.experience || undefined,
    expertise: safeJsonParse<string[]>(row.expertise, []),
    shortBio: row.short_bio || row.shortBio || '',
    detailedBio: row.detailed_bio || row.detailedBio || undefined,
    leadershipExperience: row.leadership_experience || row.leadershipExperience || undefined,
    achievements: safeJsonParse<string[]>(row.achievements, []),
    publications: safeJsonParse<string[]>(row.publications, []),
    linkedin: row.linkedin || undefined,
    website: row.website || undefined,
    email: row.email || undefined,
    displayOrder: row.display_order || row.displayOrder || 0,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined
  };
}

/**
 * GET /api/leadership
 * Public endpoint to fetch all Leadership Council members
 */
router.get('/', async (_req, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const result = await query('SELECT * FROM leadership_members ORDER BY display_order ASC, created_at ASC');
      return res.json(result.rows.map(formatLeadershipRow));
    }
    return res.json(mockStore.leadershipMembers);
  } catch (error: any) {
    console.error('Error fetching leadership members:', error);
    return res.json(mockStore.leadershipMembers || []);
  }
});

/**
 * GET /api/leadership/:id
 * Public endpoint to fetch single member by ID
 */
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const result = await query('SELECT * FROM leadership_members WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        const fallback = mockStore.leadershipMembers.find((m: any) => m.id === id);
        if (fallback) return res.json(fallback);
        return res.status(404).json({ error: 'Council member not found' });
      }
      return res.json(formatLeadershipRow(result.rows[0]));
    }

    const member = mockStore.leadershipMembers.find((m: any) => m.id === id);
    if (!member) {
      return res.status(404).json({ error: 'Council member not found' });
    }
    return res.json(member);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve council member' });
  }
});

/**
 * POST /api/leadership
 * Admin protected endpoint to add new council member
 */
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const data = req.body;

    if (!data.name || !data.designation || !data.organization || !data.shortBio) {
      return res.status(400).json({ error: 'Name, designation, organization, and short biography are required.' });
    }

    const newId = data.id || `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newMember: LeadershipCouncilMember = {
      id: newId,
      name: data.name.trim(),
      profileImage: data.profileImage || data.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      designation: data.designation.trim(),
      organization: data.organization.trim(),
      qualification: data.qualification ? data.qualification.trim() : undefined,
      experience: data.experience ? data.experience.trim() : undefined,
      expertise: Array.isArray(data.expertise) ? data.expertise : (typeof data.expertise === 'string' ? data.expertise.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      shortBio: data.shortBio.trim(),
      detailedBio: data.detailedBio ? data.detailedBio.trim() : undefined,
      leadershipExperience: data.leadershipExperience ? data.leadershipExperience.trim() : undefined,
      achievements: Array.isArray(data.achievements) ? data.achievements : (typeof data.achievements === 'string' ? data.achievements.split('\n').map((s: string) => s.trim()).filter(Boolean) : []),
      publications: Array.isArray(data.publications) ? data.publications : (typeof data.publications === 'string' ? data.publications.split('\n').map((s: string) => s.trim()).filter(Boolean) : []),
      linkedin: data.linkedin ? data.linkedin.trim() : undefined,
      website: data.website ? data.website.trim() : undefined,
      email: data.email ? data.email.trim() : undefined,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await query(
        `INSERT INTO leadership_members (
          id, name, profile_image, designation, organization, qualification,
          experience, expertise, short_bio, detailed_bio, leadership_experience,
          achievements, publications, linkedin, website, email, display_order,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())`,
        [
          newMember.id,
          newMember.name,
          newMember.profileImage,
          newMember.designation,
          newMember.organization,
          newMember.qualification || null,
          newMember.experience || null,
          JSON.stringify(newMember.expertise),
          newMember.shortBio,
          newMember.detailedBio || null,
          newMember.leadershipExperience || null,
          JSON.stringify(newMember.achievements || []),
          JSON.stringify(newMember.publications || []),
          newMember.linkedin || null,
          newMember.website || null,
          newMember.email || null,
          newMember.displayOrder
        ]
      );
    } else {
      mockStore.leadershipMembers.push(newMember);
    }

    return res.status(201).json({ success: true, member: newMember });
  } catch (error: any) {
    console.error('Error creating leadership member:', error);
    return res.status(500).json({ error: error.message || 'Failed to create leadership council member.' });
  }
});

/**
 * PUT /api/leadership/:id
 * Admin protected endpoint to update council member
 */
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await ensureDbInitialized().catch(() => {});

    const expertise = Array.isArray(data.expertise) ? data.expertise : (typeof data.expertise === 'string' ? data.expertise.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
    const achievements = Array.isArray(data.achievements) ? data.achievements : (typeof data.achievements === 'string' ? data.achievements.split('\n').map((s: string) => s.trim()).filter(Boolean) : []);
    const publications = Array.isArray(data.publications) ? data.publications : (typeof data.publications === 'string' ? data.publications.split('\n').map((s: string) => s.trim()).filter(Boolean) : []);

    if (isDbConnected()) {
      const result = await query(
        `UPDATE leadership_members
         SET name = COALESCE($1, name),
             profile_image = COALESCE($2, profile_image),
             designation = COALESCE($3, designation),
             organization = COALESCE($4, organization),
             qualification = COALESCE($5, qualification),
             experience = COALESCE($6, experience),
             expertise = COALESCE($7, expertise),
             short_bio = COALESCE($8, short_bio),
             detailed_bio = COALESCE($9, detailed_bio),
             leadership_experience = COALESCE($10, leadership_experience),
             achievements = COALESCE($11, achievements),
             publications = COALESCE($12, publications),
             linkedin = COALESCE($13, linkedin),
             website = COALESCE($14, website),
             email = COALESCE($15, email),
             display_order = COALESCE($16, display_order),
             updated_at = NOW()
         WHERE id = $17
         RETURNING *`,
        [
          data.name,
          data.profileImage || data.image,
          data.designation,
          data.organization,
          data.qualification,
          data.experience,
          JSON.stringify(expertise),
          data.shortBio,
          data.detailedBio,
          data.leadershipExperience,
          JSON.stringify(achievements),
          JSON.stringify(publications),
          data.linkedin,
          data.website,
          data.email,
          data.displayOrder,
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Council member not found' });
      }

      return res.json({ success: true, member: formatLeadershipRow(result.rows[0]) });
    }

    const index = mockStore.leadershipMembers.findIndex((m: any) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Council member not found' });
    }

    const current = mockStore.leadershipMembers[index];
    const updated: LeadershipCouncilMember = {
      ...current,
      name: data.name ?? current.name,
      profileImage: data.profileImage || data.image || current.profileImage,
      designation: data.designation ?? current.designation,
      organization: data.organization ?? current.organization,
      qualification: data.qualification ?? current.qualification,
      experience: data.experience ?? current.experience,
      expertise: expertise.length > 0 ? expertise : current.expertise,
      shortBio: data.shortBio ?? current.shortBio,
      detailedBio: data.detailedBio ?? current.detailedBio,
      leadershipExperience: data.leadershipExperience ?? current.leadershipExperience,
      achievements: achievements.length > 0 ? achievements : current.achievements,
      publications: publications.length > 0 ? publications : current.publications,
      linkedin: data.linkedin ?? current.linkedin,
      website: data.website ?? current.website,
      email: data.email ?? current.email,
      displayOrder: data.displayOrder ?? current.displayOrder,
      updatedAt: new Date().toISOString()
    };

    mockStore.leadershipMembers[index] = updated;
    return res.json({ success: true, member: updated });
  } catch (error: any) {
    console.error(`Error updating leadership member ${id}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to update member.' });
  }
});

/**
 * DELETE /api/leadership/:id
 * Admin protected endpoint to delete member
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      await query('DELETE FROM leadership_members WHERE id = $1', [id]);
    } else {
      mockStore.leadershipMembers = mockStore.leadershipMembers.filter((m: any) => m.id !== id);
    }
    return res.json({ success: true, message: 'Council member deleted.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete council member.' });
  }
});

export default router;
