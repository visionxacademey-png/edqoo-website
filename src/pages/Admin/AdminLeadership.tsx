import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Globe
} from 'lucide-react';
import { leadershipService } from '../../services/leadershipService';
import type { LeadershipCouncilMember } from '../../types';

export const AdminLeadership: React.FC = () => {
  const [members, setMembers] = useState<LeadershipCouncilMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await leadershipService.getMembers();
      setMembers(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load leadership members.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleDeleteMember = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove council member "${name}"? This action cannot be undone.`)) return;

    try {
      const res = await leadershipService.deleteMember(id);
      if (res.success) {
        showToast(`Council member "${name}" removed successfully.`);
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete council member.', 'error');
    }
  };

  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      member.name.toLowerCase().includes(term) ||
      (member.designation && member.designation.toLowerCase().includes(term)) ||
      (member.organization && member.organization.toLowerCase().includes(term)) ||
      (member.qualification && member.qualification.toLowerCase().includes(term)) ||
      (member.expertise && member.expertise.some((e) => e.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
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

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Leadership Council Management
              </h1>
              <p className="text-xs text-slate-400">
                Manage members, designations, organizations, academic bios, and profile links.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadMembers}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/leadership/new"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Council Member</span>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search council member name, designation, organization, expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-600"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Members Directory */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Loading Leadership Council...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Leadership Council members found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add verified executive leaders and academic advisory board members using the button below.
            </p>
            <Link
              to="/admin/leadership/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Council Member</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Member</th>
                  <th className="px-4 py-3.5">Designation & Org</th>
                  <th className="px-4 py-3.5">Expertise</th>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Links</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((member) => {
                  const photo =
                    member.profileImage ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';

                  return (
                    <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={photo}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{member.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{member.shortBio}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-purple-300">{member.designation}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{member.organization}</span>
                        </div>
                        {member.qualification && (
                          <div className="text-[10px] text-slate-500 mt-0.5">{member.qualification}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {member.expertise && member.expertise.slice(0, 3).map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-medium"
                            >
                              {exp}
                            </span>
                          ))}
                          {member.expertise && member.expertise.length > 3 && (
                            <span className="text-[10px] text-purple-400 font-bold">+{member.expertise.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-mono font-bold">
                          {member.displayOrder ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-slate-800 hover:bg-purple-900/50 text-slate-400 hover:text-purple-300 transition-colors"
                              title="LinkedIn"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {member.website && (
                            <a
                              href={member.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-slate-800 hover:bg-purple-900/50 text-slate-400 hover:text-purple-300 transition-colors"
                              title="Website"
                            >
                              <Globe className="w-3 h-3" />
                            </a>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="p-1 rounded bg-slate-800 hover:bg-purple-900/50 text-slate-400 hover:text-purple-300 transition-colors"
                              title="Email"
                            >
                              <Mail className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/leadership/edit/${member.id}`}
                            className="px-2.5 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg transition-colors"
                            title="Delete council member"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
