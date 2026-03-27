import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import AssetForm from '../components/AssetForm';
import AssetDetail from '../components/AssetDetail';

const STATUTS = ['Tous', 'Actif', 'En maintenance', 'Hors service'];

export default function Inventory({ assets, categories, users, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [showForm, setShowForm] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [viewAsset, setViewAsset] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const matchSearch = !search || a.nom.toLowerCase().includes(search.toLowerCase()) ||
        a.marque?.toLowerCase().includes(search.toLowerCase()) ||
        a.serialNumber?.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCat || a.categoryId === filterCat;
      const matchDept = !filterDept || a.department === filterDept;
      const matchStatus = filterStatus === 'Tous' || a.statut === filterStatus;
      return matchSearch && matchCat && matchDept && matchStatus;
    });
  }, [assets, search, filterCat, filterDept, filterStatus]);

  const handleSave = (form) => {
    if (editAsset) {
      onUpdate(editAsset.id, form);
    } else {
      onAdd(form);
    }
    setEditAsset(null);
    setShowForm(false);
  };

  const openEdit = (asset) => {
    setEditAsset(asset);
    setViewAsset(null);
    setShowForm(true);
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventaire</h1>
          <p className="text-white/40 text-sm mt-0.5">{filtered.length} équipement{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditAsset(null); setShowForm(true); }} className="btn-primary">
          <Plus size={15} />
          Nouvel équipement
        </button>
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher par nom, marque, N° série..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select-field w-auto min-w-[140px]" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">Toutes catégories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="select-field w-auto min-w-[160px]" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">Tous départements</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            {STATUTS.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterStatus === s ? 'bg-brand-orange text-white shadow-sm' : 'text-white/40 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/8">
              <tr>
                <th className="table-head">Équipement</th>
                <th className="table-head">Catégorie</th>
                <th className="table-head">Département</th>
                <th className="table-head">Responsable</th>
                <th className="table-head">OS / AV</th>
                <th className="table-head">Statut</th>
                <th className="table-head w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-white/30 text-sm">
                    Aucun équipement trouvé
                  </td>
                </tr>
              )}
              {filtered.map(asset => {
                const cat = categories.find(c => c.id === asset.categoryId);
                const user = asset.userId ? users.find(u => u.id === asset.userId) : null;
                const hasAv = asset.antivirus && asset.antivirus !== 'N/A' && asset.antivirus !== 'Aucun';
                return (
                  <tr key={asset.id} className="table-row" onClick={() => setViewAsset(asset)}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: cat?.color || '#FF6600' }}
                        >
                          {asset.nom.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{asset.nom}</div>
                          {asset.marque && <div className="text-white/40 text-xs">{asset.marque} {asset.modele}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-white/60 text-sm">{cat?.name || '—'}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-white/60 text-sm">{asset.department}</span>
                    </td>
                    <td className="table-cell">
                      {user ? (
                        <span className="text-white/70 text-sm">{user.prenom} {user.nom}</span>
                      ) : (
                        <span className="text-white/25 text-sm">—</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="text-xs">
                        <div className="text-white/60">{asset.os || '—'}</div>
                        <div className={`text-[10px] mt-0.5 ${hasAv ? 'text-emerald-400' : 'text-red-400'}`}>
                          {hasAv ? '✓ ' + asset.antivirus : '✗ Sans AV'}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={asset.statut} />
                    </td>
                    <td className="table-cell" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setViewAsset(asset)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all"
                          title="Voir"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(asset)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-brand-orange/20 text-white/40 hover:text-brand-orange transition-all"
                          title="Modifier"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(asset.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditAsset(null); }}
        title={editAsset ? `Modifier — ${editAsset.nom}` : 'Nouvel équipement'}
        size="xl"
      >
        <AssetForm
          asset={editAsset}
          categories={categories}
          users={users}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditAsset(null); }}
        />
      </Modal>

      {/* Asset Detail Modal */}
      <Modal
        isOpen={!!viewAsset}
        onClose={() => setViewAsset(null)}
        title="Détail de l'équipement"
        size="lg"
      >
        {viewAsset && (
          <AssetDetail
            asset={viewAsset}
            categories={categories}
            users={users}
            onEdit={() => { openEdit(viewAsset); setViewAsset(null); }}
            onDelete={() => { setDeleteId(viewAsset.id); setViewAsset(null); }}
          />
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { onDelete(deleteId); setDeleteId(null); }}
        title="Supprimer l'équipement ?"
        message="Cette action est irréversible. L'équipement sera définitivement supprimé de l'inventaire."
      />
    </div>
  );
}
