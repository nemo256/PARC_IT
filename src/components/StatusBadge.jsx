import React from 'react';

const STATUS_CONFIG = {
  'Actif': { cls: 'badge-active', dot: 'bg-emerald-400' },
  'En maintenance': { cls: 'badge-warning', dot: 'bg-amber-400' },
  'Hors service': { cls: 'badge-inactive', dot: 'bg-red-400' },
  'Ouvert': { cls: 'badge-inactive', dot: 'bg-red-400' },
  'En cours': { cls: 'badge-warning', dot: 'bg-amber-400' },
  'Résolu': { cls: 'badge-active', dot: 'bg-emerald-400' },
  'Fermé': { cls: 'bg-white/10 text-white/50 border border-white/10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', dot: 'bg-white/40' },
};

const ROLE_CONFIG = {
  'Admin': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-orange/20 text-brand-orange border border-brand-orange/30',
  'Technicien': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'Manager': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30',
};

const PRIORITY_CONFIG = {
  'Haute': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30',
  'Moyenne': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Basse': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Actif'];
  return (
    <span className={config.cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}

export function RoleBadge({ role }) {
  return <span className={ROLE_CONFIG[role] || ROLE_CONFIG['Technicien']}>{role}</span>;
}

export function PriorityBadge({ priority }) {
  return <span className={PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Moyenne']}>{priority}</span>;
}
