import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Monitor, Laptop, Printer, Router, Server, Network, Tablet, Phone, Tag, Package } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const ICON_OPTIONS = [
  { name: 'Monitor', Icon: Monitor },
  { name: 'Laptop', Icon: Laptop },
  { name: 'Printer', Icon: Printer },
  { name: 'Router', Icon: Router },
  { name: 'Server', Icon: Server },
  { name: 'Network', Icon: Network },
  { name: 'Tablet', Icon: Tablet },
  { name: 'Phone', Icon: Phone },
  { name: 'Tag', Icon: Tag },
  { name: 'Package', Icon: Package },
];

const COLOR_PRESETS = [
  '#FF6600', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#EF4444', '#F97316',
];

function getIcon(name) {
  const found = ICON_OPTIONS.find(o => o.name === name);
  return found ? found.Icon : Package;
}

function CategoryForm({ category, onSave, onClose }) {
  const [form, setForm] = useState(category || { name: '', icon: 'Monitor', color: '#FF6600' });
  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onSave(form);
    onClose();
  };

  const SelectedIcon = getIcon(form.icon);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Nom de la catégorie *</label>
        <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="ex: Desktop, Laptop..." />
      </div>

      {/* Icon picker */}
      <div>
        <label className="label">Icône</label>
        <div className="grid grid-cols-5 gap-2">
          {ICON_OPTIONS.map(({ name, Icon }) => (
            <button
              type="button"
              key={name}
              onClick={() => set('icon', name)}
              className={`h-10 rounded-lg flex items-center justify-center transition-all ${
                form.icon === name
                  ? 'bg-brand-orange text-white ring-2 ring-brand-orange ring-offset-2 ring-offset-[#111]'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="label">Couleur</label>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {COLOR_PRESETS.map(c => (
              <button
                type="button"
                key={c}
                onClick={() => set('color', c)}
                className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111] scale-110' : 'hover:scale-110'}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <input
            type="color"
            value={form.color}
            onChange={e => set('color', e.target.value)}
            className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
            title="Couleur personnalisée"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: form.color + '25', border: `1px solid ${form.color}40` }}>
          <SelectedIcon size={22} style={{ color: form.color }} />
        </div>
        <div>
          <div className="text-white font-semibold">{form.name || 'Nom de la catégorie'}</div>
          <div className="text-white/40 text-xs">Aperçu de la catégorie</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
        <button type="submit" className="btn-primary flex-1 justify-center">
          {category ? 'Mettre à jour' : 'Créer la catégorie'}
        </button>
      </div>
    </form>
  );
}

export default function Categories({ categories, assets, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const assetCountByCat = useMemo(() => {
    const map = {};
    assets.forEach(a => { map[a.categoryId] = (map[a.categoryId] || 0) + 1; });
    return map;
  }, [assets]);

  const handleSave = (form) => {
    if (editCat) onUpdate(editCat.id, form);
    else onAdd(form);
    setEditCat(null);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Catégories</h1>
          <p className="text-white/40 text-sm mt-0.5">{categories.length} catégorie{categories.length !== 1 ? 's' : ''} configurée{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditCat(null); setShowForm(true); }} className="btn-primary">
          <Plus size={15} /> Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(cat => {
          const Icon = getIcon(cat.icon);
          const count = assetCountByCat[cat.id] || 0;
          return (
            <div key={cat.id} className="card hover:border-white/20 transition-all group relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 -translate-y-4 translate-x-4" style={{ background: cat.color }} />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: cat.color + '20', border: `1px solid ${cat.color}35` }}
                >
                  <Icon size={22} style={{ color: cat.color }} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditCat(cat); setShowForm(true); }}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-brand-orange/20 text-white/40 hover:text-brand-orange transition-all"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="text-white font-semibold text-base">{cat.name}</div>
              <div className="text-white/40 text-sm mt-1">
                {count} équipement{count !== 1 ? 's' : ''}
              </div>

              <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: assets.length > 0 ? `${(count / assets.length) * 100}%` : '0%',
                    background: cat.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditCat(null); }}
        title={editCat ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        size="sm"
      >
        <CategoryForm category={editCat} onSave={handleSave} onClose={() => { setShowForm(false); setEditCat(null); }} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { onDelete(deleteId); setDeleteId(null); }}
        title="Supprimer la catégorie ?"
        message="Les équipements associés ne seront pas supprimés mais n'auront plus de catégorie assignée."
      />
    </div>
  );
}
