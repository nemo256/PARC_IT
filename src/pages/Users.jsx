import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, User, Mail, Building2, ShieldCheck } from 'lucide-react';
import { DEPARTMENTS, ROLES } from '../data/mockData';
import { StatusBadge, RoleBadge } from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

function UserForm({ user, users, onSave, onClose }) {
  const [form, setForm] = useState(user || {
    nom: '', prenom: '', email: '', role: 'Technicien',
    department: DEPARTMENTS[0], actif: true,
  });
  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email) return;
    onSave(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Prénom *</label>
          <input className="input-field" value={form.prenom} onChange={e => set('prenom', e.target.value)} required placeholder="Prénom" />
        </div>
        <div>
          <label className="label">Nom *</label>
          <input className="input-field" value={form.nom} onChange={e => set('nom', e.target.value)} required placeholder="Nom de famille" />
        </div>
      </div>
      <div>
        <label className="label">Email *</label>
        <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="prenom.nom@sonatrach.dz" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Rôle</label>
          <select className="select-field" value={form.role} onChange={e => set('role', e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Département</label>
          <select className="select-field" value={form.department} onChange={e => set('department', e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set('actif', !form.actif)}
          className={`relative w-10 h-5 rounded-full transition-colors ${form.actif ? 'bg-brand-orange' : 'bg-white/20'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.actif ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-white/60 text-sm">Compte {form.actif ? 'actif' : 'inactif'}</span>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
        <button type="submit" className="btn-primary flex-1 justify-center">
          {user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
        </button>
      </div>
    </form>
  );
}

export default function Users({ users, assets, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const name = `${u.prenom} ${u.nom}`.toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = !filterRole || u.role === filterRole;
      const matchDept = !filterDept || u.department === filterDept;
      return matchSearch && matchRole && matchDept;
    });
  }, [users, search, filterRole, filterDept]);

  const assetCountByUser = useMemo(() => {
    const map = {};
    assets.forEach(a => { if (a.userId) map[a.userId] = (map[a.userId] || 0) + 1; });
    return map;
  }, [assets]);

  const stats = useMemo(() => ({
    total: users.length,
    actifs: users.filter(u => u.actif).length,
    admins: users.filter(u => u.role === 'Admin').length,
    techniciens: users.filter(u => u.role === 'Technicien').length,
  }), [users]);

  const handleSave = (form) => {
    if (editUser) onUpdate(editUser.id, form);
    else onAdd(form);
    setEditUser(null);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
          <p className="text-white/40 text-sm mt-0.5">Gestion des comptes Helpdesk</p>
        </div>
        <button onClick={() => { setEditUser(null); setShowForm(true); }} className="btn-primary">
          <Plus size={15} /> Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Actifs', value: stats.actifs, color: 'text-emerald-400' },
          { label: 'Admins', value: stats.admins, color: 'text-brand-orange' },
          { label: 'Techniciens', value: stats.techniciens, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="card py-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input className="input-field pl-9" placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select-field w-auto min-w-[140px]" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">Tous les rôles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="select-field w-auto min-w-[160px]" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">Tous départements</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-white/30 text-sm card">Aucun utilisateur trouvé</div>
        )}
        {filtered.map(user => (
          <div key={user.id} className="card hover:border-white/20 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange/30 to-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-orange font-bold text-sm">
                    {user.prenom[0]}{user.nom[0]}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{user.prenom} {user.nom}</div>
                  <div className={`text-xs mt-0.5 ${user.actif ? 'text-emerald-400' : 'text-red-400'}`}>
                    {user.actif ? '● Actif' : '● Inactif'}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditUser(user); setShowForm(true); }} className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-brand-orange/20 text-white/40 hover:text-brand-orange transition-all">
                  <Edit size={12} />
                </button>
                <button onClick={() => setDeleteId(user.id)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white/50">
                <Mail size={11} className="text-white/25" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Building2 size={11} className="text-white/25" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <ShieldCheck size={11} className="text-white/25" />
                <span>{assetCountByUser[user.id] || 0} équipement{(assetCountByUser[user.id] || 0) !== 1 ? 's' : ''} assigné{(assetCountByUser[user.id] || 0) !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/8">
              <RoleBadge role={user.role} />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditUser(null); }} title={editUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'} size="md">
        <UserForm user={editUser} users={users} onSave={handleSave} onClose={() => { setShowForm(false); setEditUser(null); }} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { onDelete(deleteId); setDeleteId(null); }}
        title="Supprimer l'utilisateur ?"
        message="Cet utilisateur sera supprimé. Les équipements qui lui sont assignés ne seront pas affectés."
      />
    </div>
  );
}
