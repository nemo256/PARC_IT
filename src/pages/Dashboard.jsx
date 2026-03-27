import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Monitor, Shield, AlertTriangle, CheckCircle2,
  Package, Users, Ticket, TrendingUp, Server, Laptop
} from 'lucide-react';

const COLORS = ['#FF6600', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white text-sm font-semibold">{p.value} équipement{p.value > 1 ? 's' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ assets, users, categories, tickets }) {
  const stats = useMemo(() => {
    const active = assets.filter(a => a.statut === 'Actif').length;
    const maintenance = assets.filter(a => a.statut === 'En maintenance').length;
    const inactive = assets.filter(a => a.statut === 'Hors service').length;
    const openTickets = tickets.filter(t => t.statut === 'Ouvert').length;
    const withAv = assets.filter(a => a.antivirus && a.antivirus !== 'N/A' && a.antivirus !== 'Aucun').length;
    const avRate = assets.length > 0 ? Math.round((withAv / assets.length) * 100) : 0;
    return { active, maintenance, inactive, openTickets, avRate, withAv };
  }, [assets, tickets]);

  const departmentData = useMemo(() => {
    const map = {};
    assets.forEach(a => {
      map[a.department] = (map[a.department] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name: name.length > 12 ? name.substring(0, 12) + '…' : name, fullName: name, count }))
      .sort((a, b) => b.count - a.count);
  }, [assets]);

  const osData = useMemo(() => {
    const map = {};
    assets.forEach(a => {
      if (a.os && a.os !== 'N/A' && a.os !== 'Firmware 3.4') {
        const os = a.os.replace(' Pro', '').replace(' Home', '');
        map[os] = (map[os] || 0) + 1;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const avData = useMemo(() => {
    const withAv = assets.filter(a => a.antivirus && a.antivirus !== 'N/A' && a.antivirus !== 'Aucun').length;
    const withoutAv = assets.length - withAv;
    return [
      { name: 'Protégé', value: withAv },
      { name: 'Non protégé', value: withoutAv },
    ];
  }, [assets]);

  const categoryData = useMemo(() => {
    const map = {};
    assets.forEach(a => {
      const cat = categories.find(c => c.id === a.categoryId);
      const name = cat ? cat.name : 'Autre';
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [assets, categories]);

  const recentAssets = useMemo(() => {
    return [...assets]
      .sort((a, b) => new Date(b.dateAcquisition) - new Date(a.dateAcquisition))
      .slice(0, 5);
  }, [assets]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de Bord</h1>
          <p className="text-white/40 text-sm mt-0.5">Vue d'ensemble du parc informatique Sonatrach</p>
        </div>
        <div className="text-white/30 text-sm font-mono">
          {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Package}
          label="Total Équipements"
          value={assets.length}
          sub={`${stats.active} actifs`}
          color="orange"
        />
        <KpiCard
          icon={Users}
          label="Utilisateurs"
          value={users.length}
          sub={`${users.filter(u => u.actif).length} actifs`}
          color="blue"
        />
        <KpiCard
          icon={Ticket}
          label="Tickets Ouverts"
          value={stats.openTickets}
          sub={`${tickets.length} total`}
          color={stats.openTickets > 3 ? 'red' : 'green'}
        />
        <KpiCard
          icon={Shield}
          label="Taux Antivirus"
          value={`${stats.avRate}%`}
          sub={`${stats.withAv} / ${assets.length} machines`}
          color={stats.avRate >= 80 ? 'green' : 'red'}
        />
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.active}</div>
            <div className="text-white/40 text-xs">En service</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.maintenance}</div>
            <div className="text-white/40 text-xs">En maintenance</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Monitor size={20} className="text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.inactive}</div>
            <div className="text-white/40 text-xs">Hors service</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Chart */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-orange" />
            Équipements par Département
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" tick={{ fill: '#ffffff60', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#ffffff60', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#FF6600" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* OS Distribution */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Server size={16} className="text-brand-orange" />
            Distribution des OS
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={osData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                paddingAngle={3}
              >
                {osData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Antivirus Status */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield size={16} className="text-brand-orange" />
            Statut Antivirus
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={avData} cx="50%" cy="50%" outerRadius={65} dataKey="value" paddingAngle={3}>
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Laptop size={16} className="text-brand-orange" />
            Types d'Équipements
          </h3>
          <div className="space-y-2.5">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-xs truncate">{cat.name}</span>
                    <span className="text-white text-xs font-semibold ml-2">{cat.value}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(cat.value / assets.length) * 100}%`,
                        background: COLORS[i % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assets */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Package size={16} className="text-brand-orange" />
            Acquisitions Récentes
          </h3>
          <div className="space-y-2.5">
            {recentAssets.map(asset => {
              const cat = categories.find(c => c.id === asset.categoryId);
              return (
                <div key={asset.id} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                    style={{ background: cat?.color || '#FF6600' }}
                  >
                    {asset.nom.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">{asset.nom}</div>
                    <div className="text-white/40 text-[10px]">{asset.department}</div>
                  </div>
                  <div className="text-white/30 text-[10px] font-mono flex-shrink-0">
                    {new Date(asset.dateAcquisition).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  const colorMap = {
    orange: 'text-brand-orange bg-brand-orange/15',
    blue: 'text-blue-400 bg-blue-500/15',
    green: 'text-emerald-400 bg-emerald-500/15',
    red: 'text-red-400 bg-red-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
  };
  const [textColor, bgColor] = colorMap[color]?.split(' ') || colorMap.orange.split(' ');

  return (
    <div className="card hover:border-white/20 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          <p className="text-white/30 text-xs mt-0.5">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
          <Icon size={20} className={textColor} />
        </div>
      </div>
    </div>
  );
}
