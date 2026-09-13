import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, isDbConnected, ensureDbInitialized, mockStore, type MockUser } from '../db/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import type { Enquiry } from '../../src/types/index.js';

const router = Router();

// Helper to get client IP and device info
function getClientMeta(req: any) {
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1').toString();
  const userAgent = (req.headers['user-agent'] || 'Unknown Browser / Device').toString();
  return { ip, userAgent };
}

// POST /api/enquiries - Public / Authenticated submit enquiry (Step 1 or Full)
router.post('/', async (req, res) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const {
      id: customId,
      userId,
      name,
      email,
      phone,
      program,
      courseId,
      category,
      source,
      leadStatus,
      status,
      experienceLevel,
      learningMode,
      location,
      preferredContactMethod,
      preferredCallbackTime,
      message,
      gender,
      dateOfBirth,
      country,
      pincode,
      state,
      city,
      profession,
      highestQualification,
      yearOfGraduation,
      apaarAbcStatus,
      apaarId,
      ktuId,
      swayamChapter,
      collegeState,
      collegeName,
      universityName,
      rollNumber,
      highestAcademicLevel,
      academicArea,
      studyYear,
      organization,
      designation,
      yearsOfExperience,
      department,
      details
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const id = customId || `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const { ip, userAgent } = getClientMeta(req);
    const sessionId = `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    let assignedUserId = userId || `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newEnquiry: Enquiry = {
      id,
      userId: assignedUserId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      program: program || 'Tools and Upskills Track',
      courseId: courseId || '',
      category: category || 'Tools & Upskills',
      source: source || 'Tools & Upskills Enquire Now',
      leadStatus: (leadStatus as any) || 'Incomplete',
      experienceLevel: experienceLevel || 'Beginner',
      learningMode: learningMode || 'Online Live',
      location: location || '',
      preferredContactMethod: preferredContactMethod || 'WhatsApp',
      preferredCallbackTime: preferredCallbackTime || 'Flexible',
      message: message || '',
      status: (status as any) || (leadStatus === 'Completed' ? 'Submitted' : 'Incomplete'),
      notes: '',
      gender: gender || '',
      dateOfBirth: dateOfBirth || '',
      country: country || '',
      pincode: pincode || '',
      state: state || '',
      city: city || '',
      profession: profession || '',
      highestQualification: highestQualification || '',
      yearOfGraduation: yearOfGraduation || '',
      apaarAbcStatus: apaarAbcStatus || '',
      apaarId: apaarId || '',
      ktuId: ktuId || '',
      swayamChapter: swayamChapter || '',
      collegeState: collegeState || '',
      collegeName: collegeName || '',
      universityName: universityName || '',
      rollNumber: rollNumber || '',
      highestAcademicLevel: highestAcademicLevel || '',
      academicArea: academicArea || '',
      studyYear: studyYear || '',
      organization: organization || '',
      designation: designation || '',
      yearsOfExperience: yearsOfExperience || '',
      department: department || '',
      details: details || {},
      submittedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      // 1. Check if user already exists
      const userRes = await query('SELECT id, phone FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
      if (userRes.rows.length === 0) {
        const defaultHash = await bcrypt.hash('Student@123456', 10);
        const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';
        await query(
          `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
           ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone, name = EXCLUDED.name, last_login_at = NOW()`,
          [assignedUserId, name.trim(), normalizedEmail, defaultHash, phone.trim(), avatar, 'user']
        );
      } else {
        assignedUserId = userRes.rows[0].id;
        newEnquiry.userId = assignedUserId;
        await query('UPDATE users SET last_login_at = NOW(), phone = COALESCE(NULLIF($1, \'\'), phone), name = COALESCE(NULLIF($2, \'\'), name) WHERE id = $3', [phone.trim(), name.trim(), assignedUserId]);
      }

      // 2. Insert Session in user_sessions
      await query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW(), NOW() + INTERVAL '30 days')`,
        [sessionId, assignedUserId, normalizedEmail, sessionId, ip, userAgent]
      );

      // 3. Upsert Enquiry
      await query(
        `INSERT INTO enquiries (
          id, user_id, name, email, phone, program, course_id, category, source, lead_status,
          experience_level, learning_mode, location, preferred_contact_method, preferred_callback_time,
          message, status, notes, gender, date_of_birth, country, pincode, state, city, profession,
          highest_qualification, year_of_graduation, apaar_abc_status, apaar_id, ktu_id, swayam_chapter,
          college_state, college_name, university_name, roll_number, highest_academic_level,
          academic_area, study_year, organization, designation, years_of_experience, department,
          details, submitted_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          program = EXCLUDED.program,
          course_id = EXCLUDED.course_id,
          category = EXCLUDED.category,
          source = EXCLUDED.source,
          lead_status = EXCLUDED.lead_status,
          status = EXCLUDED.status,
          gender = EXCLUDED.gender,
          date_of_birth = EXCLUDED.date_of_birth,
          country = EXCLUDED.country,
          pincode = EXCLUDED.pincode,
          state = EXCLUDED.state,
          city = EXCLUDED.city,
          profession = EXCLUDED.profession,
          highest_qualification = EXCLUDED.highest_qualification,
          year_of_graduation = EXCLUDED.year_of_graduation,
          apaar_abc_status = EXCLUDED.apaar_abc_status,
          apaar_id = EXCLUDED.apaar_id,
          ktu_id = EXCLUDED.ktu_id,
          swayam_chapter = EXCLUDED.swayam_chapter,
          college_state = EXCLUDED.college_state,
          college_name = EXCLUDED.college_name,
          university_name = EXCLUDED.university_name,
          roll_number = EXCLUDED.roll_number,
          highest_academic_level = EXCLUDED.highest_academic_level,
          academic_area = EXCLUDED.academic_area,
          study_year = EXCLUDED.study_year,
          organization = EXCLUDED.organization,
          designation = EXCLUDED.designation,
          years_of_experience = EXCLUDED.years_of_experience,
          department = EXCLUDED.department,
          details = EXCLUDED.details,
          updated_at = NOW()`,
        [
          newEnquiry.id,
          newEnquiry.userId || null,
          newEnquiry.name,
          newEnquiry.email,
          newEnquiry.phone,
          newEnquiry.program,
          newEnquiry.courseId,
          newEnquiry.category,
          newEnquiry.source,
          newEnquiry.leadStatus,
          newEnquiry.experienceLevel,
          newEnquiry.learningMode,
          newEnquiry.location,
          newEnquiry.preferredContactMethod,
          newEnquiry.preferredCallbackTime,
          newEnquiry.message,
          newEnquiry.status,
          newEnquiry.notes,
          newEnquiry.gender,
          newEnquiry.dateOfBirth,
          newEnquiry.country,
          newEnquiry.pincode,
          newEnquiry.state,
          newEnquiry.city,
          newEnquiry.profession,
          newEnquiry.highestQualification,
          newEnquiry.yearOfGraduation,
          newEnquiry.apaarAbcStatus,
          newEnquiry.apaarId || null,
          newEnquiry.ktuId,
          newEnquiry.swayamChapter,
          newEnquiry.collegeState,
          newEnquiry.collegeName,
          newEnquiry.universityName,
          newEnquiry.rollNumber,
          newEnquiry.highestAcademicLevel,
          newEnquiry.academicArea,
          newEnquiry.studyYear,
          newEnquiry.organization,
          newEnquiry.designation,
          newEnquiry.yearsOfExperience,
          newEnquiry.department,
          JSON.stringify(newEnquiry.details || {})
        ]
      );
    } else {
      // Mock Store
      const existingUser = mockStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!existingUser) {
        const defaultHash = await bcrypt.hash('Student@123456', 10);
        const newUser: MockUser = {
          id: assignedUserId,
          name: name.trim(),
          email: normalizedEmail,
          password_hash: defaultHash,
          phone: phone.trim(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          role: 'user',
          is_active: true,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        };
        mockStore.users.unshift(newUser);
      } else {
        existingUser.last_login_at = new Date().toISOString();
        if (phone) existingUser.phone = phone.trim();
        assignedUserId = existingUser.id;
        newEnquiry.userId = assignedUserId;
      }

      mockStore.sessions.unshift({
        id: sessionId,
        user_id: assignedUserId,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
      });

      const existingIndex = mockStore.enquiries.findIndex(e => e.id === newEnquiry.id);
      if (existingIndex >= 0) {
        mockStore.enquiries[existingIndex] = { ...mockStore.enquiries[existingIndex], ...newEnquiry, updatedAt: new Date().toISOString() };
      } else {
        mockStore.enquiries.unshift(newEnquiry);
      }
    }

    return res.status(201).json({ success: true, enquiry: newEnquiry });
  } catch (err: any) {
    console.error('Error submitting enquiry:', err);
    return res.status(500).json({ error: err.message || 'Failed to submit enquiry.' });
  }
});

// Helper function to map DB row to Enquiry object
function formatEnquiryRow(row: any): Enquiry {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    program: row.program,
    courseId: row.course_id,
    category: row.category,
    source: row.source,
    leadStatus: row.lead_status || 'Incomplete',
    experienceLevel: row.experience_level,
    learningMode: row.learning_mode,
    location: row.location,
    preferredContactMethod: row.preferred_contact_method,
    preferredCallbackTime: row.preferred_callback_time,
    message: row.message,
    status: row.status,
    notes: row.notes,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    country: row.country,
    pincode: row.pincode,
    state: row.state,
    city: row.city,
    profession: row.profession,
    highestQualification: row.highest_qualification,
    yearOfGraduation: row.year_of_graduation,
    apaarAbcStatus: row.apaar_abc_status,
    apaarId: row.apaar_id || undefined,
    ktuId: row.ktu_id,
    swayamChapter: row.swayam_chapter,
    collegeState: row.college_state,
    collegeName: row.college_name,
    universityName: row.university_name,
    rollNumber: row.roll_number,
    highestAcademicLevel: row.highest_academic_level,
    academicArea: row.academic_area,
    studyYear: row.study_year,
    organization: row.organization,
    designation: row.designation,
    yearsOfExperience: row.years_of_experience,
    department: row.department,
    details: typeof row.details === 'string' ? JSON.parse(row.details || '{}') : (row.details || {}),
    lastContactedDate: row.last_contacted_date,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at
  };
}

// GET /api/enquiries - Admin: fetch all leads
router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const result = await query('SELECT * FROM enquiries ORDER BY submitted_at DESC');
      const formatted = result.rows.map(formatEnquiryRow);
      return res.json(formatted);
    } else {
      return res.json(mockStore.enquiries);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch enquiries.' });
  }
});

// Update handler for PUT and PATCH
const updateEnquiryHandler = async (req: any, res: any) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const { id } = req.params;
    const updates = req.body;

    if (isDbConnected()) {
      const result = await query(
        `UPDATE enquiries SET
          status = COALESCE($1, status),
          notes = COALESCE($2, notes),
          lead_status = COALESCE($3, lead_status),
          gender = COALESCE($4, gender),
          date_of_birth = COALESCE($5, date_of_birth),
          country = COALESCE($6, country),
          pincode = COALESCE($7, pincode),
          state = COALESCE($8, state),
          city = COALESCE($9, city),
          profession = COALESCE($10, profession),
          highest_qualification = COALESCE($11, highest_qualification),
          year_of_graduation = COALESCE($12, year_of_graduation),
          apaar_abc_status = COALESCE($13, apaar_abc_status),
          apaar_id = COALESCE($14, apaar_id),
          ktu_id = COALESCE($15, ktu_id),
          swayam_chapter = COALESCE($16, swayam_chapter),
          college_state = COALESCE($17, college_state),
          college_name = COALESCE($18, college_name),
          university_name = COALESCE($19, university_name),
          roll_number = COALESCE($20, roll_number),
          highest_academic_level = COALESCE($21, highest_academic_level),
          academic_area = COALESCE($22, academic_area),
          study_year = COALESCE($23, study_year),
          organization = COALESCE($24, organization),
          designation = COALESCE($25, designation),
          years_of_experience = COALESCE($26, years_of_experience),
          department = COALESCE($27, department),
          details = COALESCE($28, details),
          last_contacted_date = COALESCE($29, last_contacted_date),
          updated_at = NOW()
        WHERE id = $30
        RETURNING *`,
        [
          updates.status,
          updates.notes,
          updates.leadStatus,
          updates.gender,
          updates.dateOfBirth,
          updates.country,
          updates.pincode,
          updates.state,
          updates.city,
          updates.profession,
          updates.highestQualification,
          updates.yearOfGraduation,
          updates.apaarAbcStatus,
          updates.apaarId,
          updates.ktuId,
          updates.swayamChapter,
          updates.collegeState,
          updates.collegeName,
          updates.universityName,
          updates.rollNumber,
          updates.highestAcademicLevel,
          updates.academicArea,
          updates.studyYear,
          updates.organization,
          updates.designation,
          updates.yearsOfExperience,
          updates.department,
          updates.details ? JSON.stringify(updates.details) : null,
          updates.lastContactedDate,
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const formatted = formatEnquiryRow(result.rows[0]);
      return res.json({ success: true, enquiry: formatted });
    } else {
      const idx = mockStore.enquiries.findIndex(e => e.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const existing = mockStore.enquiries[idx];
      const updated = {
        ...existing,
        ...updates,
        status: updates.status || existing.status,
        leadStatus: updates.leadStatus || existing.leadStatus || 'Completed',
        notes: updates.notes !== undefined ? updates.notes : existing.notes,
        lastContactedDate: updates.lastContactedDate || existing.lastContactedDate,
        updatedAt: new Date().toISOString()
      };
      mockStore.enquiries[idx] = updated;

      return res.json({ success: true, enquiry: updated });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update enquiry.' });
  }
};

router.put('/:id', updateEnquiryHandler);
router.patch('/:id', updateEnquiryHandler);

export default router;
