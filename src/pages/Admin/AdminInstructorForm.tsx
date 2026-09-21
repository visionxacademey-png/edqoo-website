import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Mail
} from 'lucide-react';
import { instructorService } from '../../services/instructorService';
import type { Instructor } from '../../types';

export const AdminInstructorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: 'Edqoo Faculty',
    profileImage: '',
    shortBio: '',
    detailedBio: '',
    qualifications: '',
    experience: '5+ Years',
    expertise: '',
    certifications: '',
    courses: '',
    projects: '',
    linkedin: '',
    email: '',
    teachingExperience: '',
    industryExperience: ''
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const fetchInstructor = async () => {
        setLoading(true);
        try {
          const data = await instructorService.getInstructorById(id);
          if (data) {
            setFormData({
              name: data.name || '',
              designation: data.designation || data.role || '',
              organization: data.organization || '',
              profileImage: data.profileImage || data.image || '',
              shortBio: data.shortBio || '',
              detailedBio: data.detailedBio || '',
              qualifications: data.qualifications || '',
              experience: data.experience || '',
              expertise: (data.expertise || []).join(', '),
              certifications: (data.certifications || []).join(', '),
              courses: (data.courses || []).join('\n'),
              projects: (data.projects || []).join('\n'),
              linkedin: data.linkedin || '',
              email: data.email || '',
              teachingExperience: data.teachingExperience || '',
              industryExperience: data.industryExperience || ''
            });
          } else {
            showToast('Instructor profile not found', 'error');
          }
        } catch (err: any) {
          showToast(err.message || 'Failed to load instructor data', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchInstructor();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      showToast('Name and designation are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Instructor> = {
        name: formData.name.trim(),
        role: formData.designation.trim(),
        designation: formData.designation.trim(),
        organization: formData.organization.trim() || 'Edqoo Partner',
        image: formData.profileImage.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        profileImage: formData.profileImage.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        shortBio: formData.shortBio.trim(),
        detailedBio: formData.detailedBio.trim() || formData.shortBio.trim(),
        qualifications: formData.qualifications.trim(),
        experience: formData.experience.trim(),
        expertise: formData.expertise
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: formData.certifications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        courses: formData.courses
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        projects: formData.projects
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        linkedin: formData.linkedin.trim() || undefined,
        email: formData.email.trim() || undefined,
        teachingExperience: formData.teachingExperience.trim() || undefined,
        industryExperience: formData.industryExperience.trim() || undefined
      };

      if (isEditMode && id) {
        await instructorService.updateInstructor(id, payload);
        showToast('Instructor profile updated successfully.');
      } else {
        await instructorService.createInstructor(payload);
        showToast('New instructor profile created successfully.');
      }

      setTimeout(() => {
        navigate('/admin/instructors');
      }, 1000);
    } catch (err: any) {
      showToast(err.message || 'Failed to save instructor profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Loading Instructor Form...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
              : 'bg-red-950 text-red-300 border-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/instructors"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              {isEditMode ? 'Edit Instructor Profile' : 'Add New Instructor'}
            </h1>
            <p className="text-xs text-slate-400">
              {isEditMode
                ? 'Update faculty credentials, bio, and assigned courses.'
                : 'Create a new dynamic instructor profile for the website.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 pb-2 border-b border-slate-800">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            Basic Profile &amp; Role Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Evelyn Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Designation / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead AI & Machine Learning Faculty"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Organization / Company *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Edqoo & Tech Research Institute"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Years of Experience
              </label>
              <input
                type="text"
                placeholder="e.g. 12+ Years"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Profile Photo URL
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
              {formData.profileImage && (
                <img
                  src={formData.profileImage}
                  alt="Preview"
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Biographies & Qualifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 pb-2 border-b border-slate-800">
            <Award className="w-4 h-4 text-purple-400" />
            Qualifications &amp; Biography
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Educational Qualifications
            </label>
            <input
              type="text"
              placeholder="e.g. Ph.D. in Computer Science, M.S. in Data Engineering"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Short Professional Bio (for cards)
            </label>
            <textarea
              rows={2}
              placeholder="Brief 1-2 sentence introduction displayed on instructor cards..."
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Detailed Professional Bio (for detail page)
            </label>
            <textarea
              rows={4}
              placeholder="Complete professional summary, background, research areas, and career achievements..."
              value={formData.detailedBio}
              onChange={(e) => setFormData({ ...formData, detailedBio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Industry Experience Highlights
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 5+ years as Principal AI Architect at enterprise software labs."
                value={formData.industryExperience}
                onChange={(e) => setFormData({ ...formData, industryExperience: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Teaching &amp; Mentorship Background
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 7+ years leading post-graduate executive cohorts."
                value={formData.teachingExperience}
                onChange={(e) => setFormData({ ...formData, teachingExperience: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Skills, Courses & Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 pb-2 border-b border-slate-800">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Curriculum &amp; Technical Expertise
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Areas of Expertise (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Data Science, Machine Learning, Python, PyTorch"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Certifications (comma-separated)
              </label>
              <input
                type="text"
                placeholder="AWS Certified ML, TensorFlow Developer, Microsoft PL-300"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Courses / Programs Taught (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Advance Executive in Data Science and AI&#10;Advance Executive in AI and Machine Learning&#10;Advance Executive with Python"
              value={formData.courses}
              onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Key Projects / Research / Publications (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Automated Multi-Modal Medical Imaging Diagnostic Pipeline&#10;High-Throughput NLP Sentiment Engine&#10;Distributed Training Infrastructure"
              value={formData.projects}
              onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Section 4: Contact & Social Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 pb-2 border-b border-slate-800">
            <Mail className="w-4 h-4 text-purple-400" />
            Social &amp; Contact Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Faculty Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. evelyn.vance@edqoo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/admin/instructors"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors border border-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Profile...' : isEditMode ? 'Save Changes' : 'Create Instructor Profile'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
