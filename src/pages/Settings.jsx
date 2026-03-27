import React, { useState } from 'react';
import { RotateCcw, Download, Upload, Database, Shield, Bell, Globe, Palette, ChevronRight, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';
import { DEPARTMENTS } from '../data/mockData';

export default function Settings({ assets, users, categories, tickets, onReset }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const exportData = () => {
    const data = { assets, users, categories, tickets, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parc-it-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    assets: assets.length,
    users: users.length,
    categories: categories.length,
    tickets: tickets.length,
    activeAssets: assets.filter(a => a.statut === 'Actif').length,
    activeUsers: users.filter(u => u.actif).length,
    openTickets: tickets.filter(t => t.statut === 'Ouvert').length,
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-white/40 text-sm mt-0.5">Configuration du système PARC IT</p>
      </div>

      {/* System Info */}
      <section>
        <SectionHeader icon={Database} label="Base de données" />
        <div className="card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Équipements', value: stats.assets, sub: `${stats.activeAssets} actifs` },
              { label: 'Utilisateurs', value: stats.users, sub: `${stats.activeUsers} actifs` },
              { label: 'Catégories', value: stats.categories, sub: 'configurées' },
              { label: 'Tickets', value: stats.tickets, sub: `${stats.openTickets} ouverts` },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="text-white/50 text-sm">{s.label}</div>
                <div className="text-right">
                  <div className="text-white font-bold">{s.value}</div>
                  <div className="text-white/30 text-xs">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 flex gap-3">
            <button onClick={exportData} className="btn-secondary flex-1 justify-center">
              <Download size={14} />
              Exporter les données (JSON)
            </button>
            <button onClick={() => setShowImport(true)} className="btn-secondary flex-1 justify-center">
              <Upload size={14} />
              Importer des données
            </button>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section>
        <SectionHeader icon={Globe} label="Départements configurés" />
        <div className="card">
          <div className="grid grid-cols-3 gap-2">
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white/60 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-orange rounded-full flex-shrink-0" />
                {dept}
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-3">Les départements sont fixes et définis selon la structure organisationnelle de Sonatrach.</p>
        </div>
      </section>

      {/* App Info */}
      <section>
        <SectionHeader icon={Shield} label="À propos de l'application" />
        <div className="card space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/8">
            <span className="text-white/50 text-sm">Application</span>
            <span className="text-white text-sm font-medium">PARC IT</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/8">
            <span className="text-white/50 text-sm">Version</span>
            <span className="text-white text-sm font-mono">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/8">
            <span className="text-white/50 text-sm">Organisation</span>
            <span className="text-white text-sm font-medium">Sonatrach</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/8">
            <span className="text-white/50 text-sm">Technologie</span>
            <span className="text-white text-sm">React + Vite + Tailwind CSS</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white/50 text-sm">Stockage</span>
            <span className="text-white text-sm">LocalStorage (navigateur)</span>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <SectionHeader icon={AlertTriangle} label="Zone dangereuse" danger />
        <div className="card border-red-500/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-white font-semibold text-sm">Réinitialiser toutes les données</div>
              <div className="text-white/40 text-xs mt-1">Restaure les données d'exemple. Toutes les modifications seront perdues.</div>
            </div>
            <button onClick={() => setShowResetConfirm(true)} className="btn-danger ml-4 flex-shrink-0">
              <RotateCcw size={14} />
              Réinitialiser
            </button>
          </div>
        </div>
      </section>

      {/* Reset Confirm */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Confirmation" size="sm">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <div className="text-white font-semibold text-base mb-1">Réinitialiser toutes les données ?</div>
            <div className="text-white/50 text-sm">Cette action supprimera toutes vos données et restaurera les données d'exemple. Cette action est irréversible.</div>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={() => setShowResetConfirm(false)} className="btn-secondary flex-1 justify-center">Annuler</button>
            <button onClick={() => { onReset(); setShowResetConfirm(false); }} className="btn-danger flex-1 justify-center">Réinitialiser</button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Importer des données" size="sm">
        <div className="space-y-4">
          <p className="text-white/60 text-sm">L'import de données depuis un fichier JSON sera disponible dans une prochaine version.</p>
          <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-4 text-sm text-brand-orange/80">
            Pour l'instant, utilisez la fonction d'export pour sauvegarder vos données, et la réinitialisation pour revenir aux données d'exemple.
          </div>
          <button onClick={() => setShowImport(false)} className="btn-primary w-full justify-center">Fermer</button>
        </div>
      </Modal>
    </div>
  );
}

function SectionHeader({ icon: Icon, label, danger }) {
  return (
    <div className={`flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest ${danger ? 'text-red-400' : 'text-white/40'}`}>
      <Icon size={13} />
      {label}
    </div>
  );
}
