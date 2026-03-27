import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Ticket, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const TICKET_STATUTS = ['Ouvert', 'En cours', 'Résolu', 'Fermé'];
const PRIORITES = ['Haute', 'Moyenne', 'Basse'];
const CATEGORIES_TICKET = ['Matériel', 'Logiciel', 'Réseau', 'Sécurité', 'Autre'];

function TicketForm({ ticket, assets, users, onSave, onClose }) {
  const [form, setForm] = useState(ticket || {
    titre: '', description: '', assetId: '', userId: '',
    technicienId: '', priorite: 'Moyenne', statut: 'Ouvert', categorie: 'Matériel',
  });
  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre) return;
    onSave(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Titre du ticket *</label>
        <input className="input-field" value={form.titre} onChange={e => set('titre', e.target.value)} required placeholder="Description courte du problème" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input-field min-h-[80px] resize-none" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Détails du problème..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Priorité</label>
          <select className="select-field" value={form.priorite} onChange={e => set('priorite', e.target.value)}>
            {PRIORITES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Statut</label>
          <select className="select-field" value={form.statut} onChange={e => set('statut', e.target.value)}>
            {TICKET_STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Catégorie</label>
          <select className="select-field" value={form.categorie} onChange={e => set('categorie', e.target.value)}>
            {CATEGORIES_TICKET.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Équipement concerné</label>
          <select className="select-field" value={form.assetId || ''} onChange={e => set('assetId', e.target.value || null)}>
            <option value="">Aucun</option>
            {assets.map(a => <option key={a.id} value={a.id}>{a.nom} — {a.department}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Demandeur</label>
          <select className="select-field" value={form.userId || ''} onChange={e => set('userId', e.target.value || null)}>
            <option value="">Aucun</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Technicien assigné</label>
          <select className="select-field" value={form.technicienId || ''} onChange={e => set('technicienId', e.target.value || null)}>
            <option value="">Non assigné</option>
            {users.filter(u => u.role === 'Technicien' || u.role === 'Admin').map(u => (
              <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
        <button type="submit" className="btn-primary flex-1 justify-center">
          {ticket ? 'Mettre à jour' : 'Créer le ticket'}
        </button>
      </div>
    </form>
  );
}

export default function Tickets({ tickets, assets, users, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch = !search || t.titre.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || t.statut === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [tickets, search, filterStatus]);

  const stats = useMemo(() => ({
    ouverts: tickets.filter(t => t.statut === 'Ouvert').length,
    enCours: tickets.filter(t => t.statut === 'En cours').length,
    resolus: tickets.filter(t => t.statut === 'Résolu').length,
    total: tickets.length,
  }), [tickets]);

  const handleSave = (form) => {
    if (editTicket) onUpdate(editTicket.id, form);
    else onAdd(form);
    setEditTicket(null);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Helpdesk</h1>
          <p className="text-white/40 text-sm mt-0.5">Gestion des tickets d'assistance</p>
        </div>
        <button onClick={() => { setEditTicket(null); setShowForm(true); }} className="btn-primary">
          <Plus size={15} /> Nouveau ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="card py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.ouverts}</div>
            <div className="text-white/40 text-xs">Ouverts</div>
          </div>
        </div>
        <div className="card py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={16} className="text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.enCours}</div>
            <div className="text-white/40 text-xs">En cours</div>
          </div>
        </div>
        <div className="card py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.resolus}</div>
            <div className="text-white/40 text-xs">Résolus</div>
          </div>
        </div>
        <div className="card py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-orange/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Ticket size={16} className="text-brand-orange" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-white/40 text-xs">Total</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input className="input-field pl-9" placeholder="Rechercher un ticket..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            {['', ...TICKET_STATUTS].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterStatus === s ? 'bg-brand-orange text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {s || 'Tous'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/8">
              <tr>
                <th className="table-head">Ticket</th>
                <th className="table-head">Catégorie</th>
                <th className="table-head">Équipement</th>
                <th className="table-head">Technicien</th>
                <th className="table-head">Priorité</th>
                <th className="table-head">Statut</th>
                <th className="table-head">Date</th>
                <th className="table-head w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-white/30 text-sm">Aucun ticket trouvé</td></tr>
              )}
              {filtered.map(ticket => {
                const asset = ticket.assetId ? assets.find(a => a.id === ticket.assetId) : null;
                const tech = ticket.technicienId ? users.find(u => u.id === ticket.technicienId) : null;
                return (
                  <tr key={ticket.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 rounded-full bg-brand-orange/40 flex-shrink-0" />
                        <div>
                          <div className="text-white text-sm font-medium">{ticket.titre}</div>
                          {ticket.description && <div className="text-white/40 text-xs truncate max-w-[200px]">{ticket.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell"><span className="text-white/60 text-sm">{ticket.categorie}</span></td>
                    <td className="table-cell"><span className="text-white/60 text-sm">{asset ? asset.nom : '—'}</span></td>
                    <td className="table-cell">
                      {tech ? (
                        <span className="text-white/70 text-sm">{tech.prenom} {tech.nom}</span>
                      ) : (
                        <span className="text-white/25 text-sm">Non assigné</span>
                      )}
                    </td>
                    <td className="table-cell"><PriorityBadge priority={ticket.priorite} /></td>
                    <td className="table-cell"><StatusBadge status={ticket.statut} /></td>
                    <td className="table-cell">
                      <span className="text-white/40 text-xs font-mono">
                        {new Date(ticket.dateCreation).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </span>
                    </td>
                    <td className="table-cell" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditTicket(ticket); setShowForm(true); }} className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-brand-orange/20 text-white/40 hover:text-brand-orange transition-all">
                          <Edit size={13} />
                        </button>
                        <button onClick={() => setDeleteId(ticket.id)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
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

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditTicket(null); }} title={editTicket ? 'Modifier le ticket' : 'Nouveau ticket'} size="md">
        <TicketForm ticket={editTicket} assets={assets} users={users} onSave={handleSave} onClose={() => { setShowForm(false); setEditTicket(null); }} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { onDelete(deleteId); setDeleteId(null); }}
        title="Supprimer le ticket ?"
        message="Ce ticket sera définitivement supprimé."
      />
    </div>
  );
}
