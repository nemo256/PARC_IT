import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

const STATUTS = ['Actif', 'En maintenance', 'Hors service'];

export default function AssetForm({ asset, categories, users, onSave, onClose }) {
  const [form, setForm] = useState({
    nom: '', categoryId: '', department: DEPARTMENTS[0], userId: '',
    statut: 'Actif', dateAcquisition: new Date().toISOString().split('T')[0],
    marque: '', modele: '', serialNumber: '',
    cpu: '', ram: '', disque: '',
    os: '', osVersion: '', antivirus: '', antivirusVersion: '',
    adresseIP: '', adresseMAC: '', notes: '',
    applications: [],
  });
  const [appInput, setAppInput] = useState('');

  useEffect(() => {
    if (asset) {
      setForm({ ...asset, applications: asset.applications || [] });
    }
  }, [asset]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const addApp = () => {
    if (appInput.trim() && !form.applications.includes(appInput.trim())) {
      set('applications', [...form.applications, appInput.trim()]);
      setAppInput('');
    }
  };

  const removeApp = (app) => {
    set('applications', form.applications.filter(a => a !== app));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.categoryId || !form.department) return;
    onSave(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identification */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange mb-3">Identification</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Nom / Code équipement *</label>
            <input className="input-field" value={form.nom} onChange={e => set('nom', e.target.value)} required placeholder="PC-DIR-001" />
          </div>
          <div>
            <label className="label">Catégorie *</label>
            <select className="select-field" value={form.categoryId} onChange={e => set('categoryId', e.target.value)} required>
              <option value="">Sélectionner...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Statut</label>
            <select className="select-field" value={form.statut} onChange={e => set('statut', e.target.value)}>
              {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Marque</label>
            <input className="input-field" value={form.marque} onChange={e => set('marque', e.target.value)} placeholder="Dell, HP, Lenovo..." />
          </div>
          <div>
            <label className="label">Modèle</label>
            <input className="input-field" value={form.modele} onChange={e => set('modele', e.target.value)} placeholder="OptiPlex 7090" />
          </div>
          <div>
            <label className="label">N° Série</label>
            <input className="input-field" value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} placeholder="SN-XXXX" />
          </div>
          <div>
            <label className="label">Date d'acquisition</label>
            <input type="date" className="input-field" value={form.dateAcquisition} onChange={e => set('dateAcquisition', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Assignment */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange mb-3">Affectation</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Département *</label>
            <select className="select-field" value={form.department} onChange={e => set('department', e.target.value)} required>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Utilisateur responsable</label>
            <select className="select-field" value={form.userId || ''} onChange={e => set('userId', e.target.value || null)}>
              <option value="">Aucun</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.prenom} {u.nom} — {u.department}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange mb-3">Matériel</div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Processeur (CPU)</label>
            <input className="input-field" value={form.cpu} onChange={e => set('cpu', e.target.value)} placeholder="Intel Core i7..." />
          </div>
          <div>
            <label className="label">RAM</label>
            <input className="input-field" value={form.ram} onChange={e => set('ram', e.target.value)} placeholder="16 Go" />
          </div>
          <div>
            <label className="label">Stockage</label>
            <input className="input-field" value={form.disque} onChange={e => set('disque', e.target.value)} placeholder="512 Go SSD" />
          </div>
        </div>
      </section>

      {/* Software */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange mb-3">Logiciel</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Système d'exploitation</label>
            <input className="input-field" value={form.os} onChange={e => set('os', e.target.value)} placeholder="Windows 11 Pro" />
          </div>
          <div>
            <label className="label">Version OS</label>
            <input className="input-field" value={form.osVersion} onChange={e => set('osVersion', e.target.value)} placeholder="23H2" />
          </div>
          <div>
            <label className="label">Antivirus</label>
            <input className="input-field" value={form.antivirus} onChange={e => set('antivirus', e.target.value)} placeholder="Kaspersky Endpoint" />
          </div>
          <div>
            <label className="label">Version Antivirus</label>
            <input className="input-field" value={form.antivirusVersion} onChange={e => set('antivirusVersion', e.target.value)} placeholder="21.3" />
          </div>
        </div>

        {/* Applications */}
        <div className="mt-3">
          <label className="label">Applications installées</label>
          <div className="flex gap-2">
            <input
              className="input-field flex-1"
              value={appInput}
              onChange={e => setAppInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addApp())}
              placeholder="Ajouter une application..."
            />
            <button type="button" onClick={addApp} className="btn-primary px-3">
              <Plus size={14} />
            </button>
          </div>
          {form.applications.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.applications.map(app => (
                <span key={app} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/8 border border-white/10 rounded-full text-xs text-white/70">
                  {app}
                  <button type="button" onClick={() => removeApp(app)} className="text-white/40 hover:text-white/80">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Network */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange mb-3">Réseau</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Adresse IP</label>
            <input className="input-field font-mono" value={form.adresseIP} onChange={e => set('adresseIP', e.target.value)} placeholder="192.168.1.x" />
          </div>
          <div>
            <label className="label">Adresse MAC</label>
            <input className="input-field font-mono" value={form.adresseMAC} onChange={e => set('adresseMAC', e.target.value)} placeholder="00:1A:2B:3C:4D:5E" />
          </div>
        </div>
      </section>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          className="input-field min-h-[70px] resize-none"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Informations supplémentaires..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
        <button type="submit" className="btn-primary flex-1 justify-center">
          {asset ? 'Mettre à jour' : 'Créer l\'équipement'}
        </button>
      </div>
    </form>
  );
}
