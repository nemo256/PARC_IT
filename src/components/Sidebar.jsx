import React from 'react';
import {
  LayoutDashboard, Package, Users, Tag, Settings,
  Ticket, ChevronRight, Cpu
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventaire', icon: Package },
  { id: 'tickets', label: 'Helpdesk', icon: Ticket },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'categories', label: 'Catégories', icon: Tag },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export default function Sidebar({ currentPage, onNavigate, assetCount, userCount }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-black border-r border-white/8 flex flex-col z-50">
      {/* Logo area */}
      <div className="px-6 py-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center flex-shrink-0">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base tracking-tight leading-none">PARC IT</div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">Sonatrach</div>
          </div>
        </div>
      </div>

      {/* Logo Sonatrach */}
      <div className="px-6 py-4 border-b border-white/8">
        <div className="w-full h-10 flex items-center justify-center opacity-60 hover:opacity-90 transition-opacity">
          <img
            src="/sonatrach.png"
            alt="Sonatrach"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span className="text-white/60 text-xs font-semibold tracking-wider">SONATRACH</span>
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats mini */}
      <div className="px-6 py-3 border-b border-white/8">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-brand-orange font-bold text-lg leading-none">{assetCount}</div>
            <div className="text-white/40 text-[10px] mt-1">Équipements</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-brand-orange font-bold text-lg leading-none">{userCount}</div>
            <div className="text-white/40 text-[10px] mt-1">Utilisateurs</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-3 mb-2">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                  : 'text-white/55 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-white/70" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/8">
        <div className="text-[10px] text-white/25 text-center">
          PARC IT v1.0 — © 2024 Sonatrach
        </div>
      </div>
    </aside>
  );
}
