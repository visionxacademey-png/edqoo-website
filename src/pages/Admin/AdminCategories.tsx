import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import { getCategoryIcon } from '../../utils/categoryIcons';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    parentSlug: '',
    title: '',
    subtitle: '',
    description: '',
    icon: 'layers',
    displayOrder: 1,
    isActive: true,
    isPartner: false,
    badge: 'Track',
    heroBadge: 'Comprehensive Industry Track',
    heroImage: '',
    seoTitle: '',
    seoDescription: '',
    highlights: '',
    curriculumPillars: ''
  });

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(err?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    const nextOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.displayOrder || 0)) + 1 : 1;
    setFormData({
      name: '',
      slug: '',
      parentId: '',
      parentSlug: '',
      title: '',
      subtitle: '',
      description: '',
      icon: 'brain',
      displayOrder: nextOrder,
      isActive: true,
      isPartner: false,
      badge: 'Track',
      heroBadge: 'Comprehensive Industry Track',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      seoTitle: '',
      seoDescription: '',
      highlights: '',
      curriculumPillars: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      parentId: cat.parentId || '',
      parentSlug: cat.parentSlug || '',
      title: cat.title || '',
      subtitle: cat.subtitle || '',
      description: cat.description || '',
      icon: cat.icon || 'layers',
      displayOrder: cat.displayOrder ?? 1,
      isActive: cat.isActive !== false,
      isPartner: !!cat.isPartner,
      badge: cat.badge || (cat.isPartner ? 'Partner Track' : 'Track'),
      heroBadge: cat.heroBadge || 'Comprehensive Industry Track',
      heroImage: cat.heroImage || '',
      seoTitle: cat.seoTitle || '',
      seoDescription: cat.seoDescription || '',
      highlights: Array.isArray(cat.highlights) ? cat.highlights.join('\n') : '',
      curriculumPillars: Array.isArray(cat.curriculumPillars)
        ? cat.curriculumPillars.map((p) => `${p.title}::${p.desc}`).join('\n')
        : ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('Category slug is required.');
      return;
    }

    const trimmedName = formData.name.trim();
    const targetSlug = formData.slug.trim();

    // Prevent duplicate category name
    const dupName = categories.find(
      (c) => c.id !== editingCategory?.id && c.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (dupName) {
      setFormError(`A category with the name "${dupName.name}" already exists.`);
      return;
    }

    // Prevent duplicate slug
    const dupSlug = categories.find(
      (c) => c.id !== editingCategory?.id && c.slug.trim().toLowerCase() === targetSlug.toLowerCase()
    );
    if (dupSlug) {
      setFormError(`A category with the slug "${dupSlug.slug}" already exists.`);
      return;
    }

    setFormSaving(true);
    setFormError(null);

    const highlightsArray = formData.highlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const curriculumPillarsArray = formData.curriculumPillars
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('::');
        return {
          title: parts[0]?.trim() || 'Core Module',
          desc: parts[1]?.trim() || ''
        };
      });

    const payload = {
      name: trimmedName,
      slug: targetSlug,
      parentId: formData.parentId || undefined,
      parentSlug: formData.parentSlug || undefined,
      title: formData.title.trim() || `${trimmedName} Courses & Certification`,
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim() || formData.subtitle.trim(),
      icon: formData.icon.trim(),
      displayOrder: Number(formData.displayOrder) || 1,
      isActive: formData.isActive,
      isPartner: formData.isPartner,
      badge: formData.badge.trim(),
      heroBadge: formData.heroBadge.trim(),
      heroImage: formData.heroImage.trim(),
      seoTitle: formData.seoTitle.trim(),
      seoDescription: formData.seoDescription.trim(),
      highlights: highlightsArray,
      curriculumPillars: curriculumPillarsArray
    };

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      console.error('Save category error:', err);
      setFormError(err?.message || 'Failed to save category');
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      await categoryService.updateCategory(cat.id, { isActive: !cat.isActive });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err?.message}`);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }
    try {
      await categoryService.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err: any) {
      alert(`Failed to delete category: ${err?.message}`);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    const orders = newCategories.map((cat, idx) => ({
      id: cat.id,
      displayOrder: idx + 1
    }));

    setCategories(newCategories.map((cat, idx) => ({ ...cat, displayOrder: idx + 1 })));

    try {
      await categoryService.reorderCategories(orders);
    } catch (err: any) {
      console.error('Reorder error:', err);
      loadCategories();
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#F1E8FA] text-[#6D22B5]">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
              Category &amp; Program Tracks
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Database-driven category management. Changes instantly reflect on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
            className="p-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reload from database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6D22B5]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#6D22B5] hover:bg-[#5C1C9A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#6D22B5]/20 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6D22B5]"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold px-2">
          Total: {categories.length}
        </span>
      </div>

      {/* Categories Table / List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#6D22B5] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading categories from database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs text-red-400 font-bold">{error}</p>
            <button
              onClick={loadCategories}
              className="px-3 py-1.5 bg-neutral-800 text-xs text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No categories found</p>
            <p className="text-xs text-slate-500">Create a new category to populate the website.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Slug &amp; Icon</th>
                  <th className="py-3 px-4">Courses</th>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{cat.displayOrder}</span>
                        <div className="flex flex-col gap-0.5 ml-1">
                          <button
                            onClick={() => moveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveOrder(idx, 'down')}
                            disabled={idx === filteredCategories.length - 1}
                            className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#F1E8FA] text-[#6D22B5] flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(cat.icon, 'w-4 h-4')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white block">{cat.name}</span>
                            {(cat.parentSlug || cat.parentId) && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-semibold border border-purple-700/60">
                                Subcategory of {categories.find((p) => p.id === cat.parentId || p.slug === cat.parentSlug)?.name || 'Spoken Tutorial'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {cat.subtitle || cat.description || 'No subtitle provided'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <code className="text-[#6D22B5] bg-purple-950/40 px-1.5 py-0.5 rounded text-[11px] font-mono">
                          {cat.slug}
                        </code>
                        <span className="text-[10px] text-slate-500 block">icon: {cat.icon || 'layers'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-neutral-800 rounded-md font-mono text-slate-300 font-bold text-[11px]">
                        {cat.courseCount ?? 0} courses
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {cat.isPartner ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800 text-[10px] font-bold">
                          
                          <span>Partner</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Standard</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          cat.isActive !== false
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950/60 text-red-400 border border-red-800'
                        }`}
                      >
                        {cat.isActive !== false ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 bg-neutral-800 hover:bg-[#6D22B5] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 bg-neutral-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#6D22B5]" />
                <h3 className="font-display font-bold text-white text-base">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Category Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Data Science and AI"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. data-science-and-ai"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">
                  Parent Category (Optional)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => {
                    const sel = categories.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      parentId: sel ? sel.id : '',
                      parentSlug: sel ? sel.slug : ''
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories
                    .filter(
                      (c) =>
                        !c.parentId &&
                        !c.parentSlug &&
                        (!editingCategory || (c.id !== editingCategory.id && c.slug !== editingCategory.slug))
                    )
                    .map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-500">
                  Select a parent category (e.g. Spoken Tutorial) to make this a nested subcategory. Leave as None for top-level tracks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Icon Identifier
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                  >
                    <option value="brain">Brain (Data Science)</option>
                    <option value="chart">Chart (Analytics)</option>
                    <option value="cpu">CPU (AI &amp; ML)</option>
                    <option value="wrench">Wrench (Tools &amp; Upskills)</option>
                    <option value="message-circle">Message Circle / Speech (English Mirror)</option>
                    <option value="messages-square">Messages Square (Conversation)</option>
                    <option value="shield">Shield (Cybersecurity)</option>
                    <option value="book-open">Book Open (Free Learning)</option>
                    <option value="code">Code (Programming)</option>
                    <option value="layers">Layers (General)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Track"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">
                  Subtitle / Brief Description
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short tagline explaining this category..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Hero Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroBadge}
                    onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                    placeholder="Comprehensive Industry Track"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Hero Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                  />
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">
                  Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Full-stack curriculum&#10;Hands-on lab assignments&#10;Mentor guidance"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5]"
                />
              </div>

              {/* Curriculum Pillars */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">
                  Curriculum Pillars (Title::Description format per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.curriculumPillars}
                  onChange={(e) => setFormData({ ...formData, curriculumPillars: e.target.value })}
                  placeholder="Python &amp; Foundations::Object-oriented programming and syntax&#10;Machine Learning::Supervised &amp; unsupervised modeling"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#6D22B5] font-mono text-[11px]"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6D22B5] focus:ring-[#6D22B5]"
                  />
                  <span>Active (Visible on Website)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.isPartner}
                    onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6D22B5] focus:ring-[#6D22B5]"
                  />
                  <span>Partner Program (e.g. English Mirror)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-5 py-2 bg-[#6D22B5] hover:bg-[#5C1C9A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#6D22B5]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{formSaving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
