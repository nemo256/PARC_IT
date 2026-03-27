import React from 'react';
import {
  Monitor, Cpu, HardDrive, MemoryStick, Shield, Globe,
  Calendar, Tag, User, Building2, Hash, Network, FileText,
  Edit, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export default function AssetDetail({ asset, categories, users, onEdit, onDelete }) {
  if (!asset) return null;

  const category = categories.find(c => c.id === asset.categoryId);
  const user = asset.userId ? users.find(u => u.id === asset.userId) : null;
  const hasAv = asset.antivirus && asset.antivirus !== 'N/A' && asset.antivirus !== 'Aucun';

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ background: category?.color || '#FF6600' }}
          >
            {asset.nom.substring(0, 2)}
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{asset.nom}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/40 text-sm">{category?.name || '—'}</span>
              <span className="text-white/20">·</span>
              <StatusBadge status={asset.statut} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="btn-secondary px-3 py-2">
            <Edit size={14} />
          </button>
          <button onClick={onDelete} className="btn-danger px-3 py-2">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard icon={Hash} label="N° Série" value={asset.serialNumber || '—'} mono />
        <InfoCard icon={Tag} label="Marque / Modèle" value={asset.marque && asset.modele ? `${asset.marque} ${asset.modele}` : '—'} />
        <InfoCard icon={Building2} label="Département" value={asset.department} />
        <InfoCard icon={Calendar} label="Date d'acquisition" value={asset.dateAcquisition ? new Date(asset.dateAcquisition).toLocaleDateString('fr-DZ') : '—'} />
        {user && (
          <InfoCard icon={User} label="Responsable" value={`${user.prenom} ${user.nom}`} sub={user.email} />
        )}
        {!user && (
          <InfoCard icon={User} label="Responsable" value="Non assigné" dimmed />
        )}
      </div>

      {/* Hardware */}
      <Section title="Matériel" color="blue">
        <div className="grid grid-cols-3 gap-3">
          <InfoCard icon={Cpu} label="CPU" value={asset.cpu || '—'} small />
          <InfoCard icon={MemoryStick} label="RAM" value={asset.ram || '—'} small />
          <InfoCard icon={HardDrive} label="Stockage" value={asset.disque || '—'} small />
        </div>
      </Section>

      {/* Software */}
      <Section title="Logiciel" color="purple">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <InfoCard icon={Monitor} label="Système d'exploitation" value={asset.os || '—'} sub={asset.osVersion} small />
          <div className={`bg-white/5 border rounded-xl p-3 ${hasAv ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 ${hasAv ? 'text-emerald-400' : 'text-red-400'}`}>
                {hasAv ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              </div>
              <div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Antivirus</div>
                <div className={`text-sm font-medium ${hasAv ? 'text-emerald-300' : 'text-red-300'}`}>
                  {asset.antivirus || 'Aucun'}
                </div>
                {asset.antivirusVersion && asset.antivirusVersion !== 'N/A' && (
                  <div className="text-white/30 text-xs">v{asset.antivirusVersion}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Apps */}
        {asset.applications && asset.applications.length > 0 && (
          <div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Applications installées</div>
            <div className="flex flex-wrap gap-1.5">
              {asset.applications.map(app => (
                <span key={app} className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-full text-xs text-white/70">
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Network */}
      <Section title="Réseau" color="cyan">
        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={Globe} label="Adresse IP" value={asset.adresseIP || '—'} mono small />
          <InfoCard icon={Network} label="Adresse MAC" value={asset.adresseMAC || '—'} mono small />
        </div>
      </Section>

      {/* Notes */}
      {asset.notes && (
        <Section title="Notes" color="orange">
          <div className="flex items-start gap-2 text-white/60 text-sm">
            <FileText size={14} className="mt-0.5 flex-shrink-0 text-white/30" />
            <p>{asset.notes}</p>
          </div>
        </Section>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, sub, mono, small, dimmed }) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-xl p-3">
      <div className="flex items-start gap-2">
        <Icon size={13} className="text-white/30 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">{label}</div>
          <div className={`font-medium truncate ${small ? 'text-xs' : 'text-sm'} ${dimmed ? 'text-white/30' : 'text-white'} ${mono ? 'font-mono' : ''}`}>
            {value}
          </div>
          {sub && <div className="text-white/30 text-[10px] truncate">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  const colors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    orange: 'text-brand-orange',
  };
  return (
    <div>
      <div className={`text-[10px] font-semibold uppercase tracking-widest ${colors[color] || 'text-white/40'} mb-2`}>{title}</div>
      {children}
    </div>
  );
}
