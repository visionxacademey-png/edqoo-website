import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { leadershipService } from '../../services/leadershipService';
import type { LeadershipCouncilMember } from '../../types';

export const AdminLeadershipForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    profileImage: '',
    designation: '',
    organization: '',
    qualification: '',
    experience: '',
    expertise: [] as string[],
    shortBio: '',
    detailedBio: '',
    leadershipExperience: '',
    achievementsText: '',
    publicationsText: '',
    linkedin: '',
    website: '',
    email: '',
    displayOrder: 0
  });

  const [expertiseInput, setExpertiseInput] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditing && id) {
      leadershipService.getMemberById(id).then((member) => {
        if (member) {
          setFormData({
            name: member.name || '',
            profileImage: member.profileImage || '',
            designation: member.designation || '',
            organization: member.organization || '',
            qualification: member.qualification || '',
            experience: member.experience || '',
            expertise: member.expertise || [],
            shortBio: member.shortBio || '',
            detailedBio: member.detailedBio || '',
            leadershipExperience: member.leadershipExperience || '',
            achievementsText: (member.achievements || []).join('\n'),
            publicationsText: (member.publications || []).join('\n'),
            linkedin: member.linkedin || '',
            website: member.website || '',
            email: member.email || '',
            displayOrder: member.displayOrder || 0
          });
        } else {
          showToast('Council member not found.', 'error');
        }
        setLoading(false);
      }).catch((err) => {
        showToast(err.message || 'Failed to load member.', 'error');
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image size exceeds 4MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddExpertise = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();

    const val = expertiseInput.trim();
    if (!val) return;

    if (!formData.expertise.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, val]
      }));
    }
    setExpertiseInput('');
  };

  const handleRemoveExpertise = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((s) => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.designation.trim() || !formData.organization.trim() || !formData.shortBio.trim()) {
      showToast('Name, Designation, Organization, and Short Bio are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<LeadershipCouncilMember> = {
        name: formData.name.trim(),
        profileImage: formData.profileImage.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        designation: formData.designation.trim(),
        organization: formData.organization.trim(),
        qualification: formData.qualification.trim() || undefined,
        experience: formData.experience.trim() || undefined,
        expertise: formData.expertise,
        shortBio: formData.shortBio.trim(),
        detailedBio: formData.detailedBio.trim() || undefined,
        leadershipExperience: formData.leadershipExperience.trim() || undefined,
        achievements: formData.achievementsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        publications: formData.publicationsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        linkedin: formData.linkedin.trim() || undefined,
        website: formData.website.trim() || undefined,
        email: formData.email.trim() || undefined,
        displayOrder: Number(formData.displayOrder) || 0
      };

      if (isEditing && id) {
        await leadershipService.updateMember(id, payload);
        showToast('Leadership member updated successfully!');
      } else {
        await leadershipService.createMember(payload);
        showToast('Leadership member created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/leadership');
      }, 1200);
    } catch (err: any) {
      showToast(err.message || 'Failed to save council member.', 'error');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <span className="text-xs text-slate-400 font-semibold">Loading Member Information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
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

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/leadership"
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              {isEditing ? `Edit Council Member: ${formData.name}` : 'Add New Leadership Council Member'}
            </h1>
            <p className="text-xs text-slate-400">
              Configure profile portrait, credentials, academic roles, and career biography.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image & Essential Details */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Profile Portrait & Primary Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            {/* Image Preview & Upload */}
            <div className="sm:col-span-4 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <img
                src={formData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                alt="Profile Preview"
                className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-600/40 shadow-md"
              />
              <div className="w-full space-y-2">
                <label className="px-3 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/50 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                </label>
                <input
                  type="url"
                  placeholder="Or paste image URL..."
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* Core Fields */}
            <div className="sm:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Designation / Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dean of Academics / Chief AI Advisor"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Organization / Institution <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Institute of Technology / Tech Corp"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Educational Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ph.D. in Computer Science, M.Tech (IIT)"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18+ Years in AI Research & Academic Leadership"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Lower numbers appear first on the website (e.g. 1, 2, 3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Areas of Expertise
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add expertise tag (e.g. Machine Learning, Academic Curriculum, Cloud Computing)..."
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              onKeyDown={handleAddExpertise}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
            />
            <button
              type="button"
              onClick={handleAddExpertise}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {formData.expertise.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-950 text-purple-300 border border-slate-800 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveExpertise(skill)}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Biographies */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Biographies & Executive Leadership Profile
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Short Professional Bio (Displayed on cards) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Brief 2-3 sentence overview of their position and strategic contributions..."
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Detailed Biography / Professional Summary (Displayed in modal)
            </label>
            <textarea
              rows={4}
              placeholder="Comprehensive summary of career milestones, research, and advisory roles..."
              value={formData.detailedBio}
              onChange={(e) => setFormData({ ...formData, detailedBio: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Leadership & Governance Experience
            </label>
            <textarea
              rows={3}
              placeholder="Details on board memberships, dean positions, academic councils, or industry advisory committees..."
              value={formData.leadershipExperience}
              onChange={(e) => setFormData({ ...formData, leadershipExperience: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Industry Contributions & Achievements (1 per line)
              </label>
              <textarea
                rows={4}
                placeholder="Fellow of National AI Initiative&#10;Keynote Speaker at IEEE Conference&#10;Author of 30+ peer-reviewed papers"
                value={formData.achievementsText}
                onChange={(e) => setFormData({ ...formData, achievementsText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Publications & Research Papers (1 per line)
              </label>
              <textarea
                rows={4}
                placeholder="Neural Network Optimizations in Edge Computing (2024)&#10;Scalable Machine Learning for Healthcare (2023)"
                value={formData.publicationsText}
                onChange={(e) => setFormData({ ...formData, publicationsText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Contact & Professional Links */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Professional & Social Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">LinkedIn Profile URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Personal / Academic Website</label>
              <input
                type="url"
                placeholder="https://faculty.institution.edu/~name"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Official Contact Email</label>
              <input
                type="email"
                placeholder="council.member@institution.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/admin/leadership"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Council Member...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Council Member'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
