const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database setup
const DB_PATH = path.join(__dirname, 'parc_it.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT,
    role TEXT,
    department TEXT,
    actif INTEGER DEFAULT 1,
    dateCreation TEXT
  );

  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    categoryId TEXT,
    department TEXT,
    userId TEXT,
    statut TEXT,
    dateAcquisition TEXT,
    cpu TEXT,
    ram TEXT,
    disque TEXT,
    os TEXT,
    osVersion TEXT,
    antivirus TEXT,
    antivirusVersion TEXT,
    applications TEXT,
    marque TEXT,
    modele TEXT,
    serialNumber TEXT,
    adresseIP TEXT,
    adresseMAC TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    titre TEXT NOT NULL,
    description TEXT,
    assetId TEXT,
    userId TEXT,
    technicienId TEXT,
    priorite TEXT,
    statut TEXT,
    categorie TEXT,
    dateCreation TEXT
  );
`);

// ── Seed data if empty ────────────────────────────────────────────────────────
function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (count.c > 0) return;

  const insertCat = db.prepare('INSERT INTO categories VALUES (@id,@name,@icon,@color)');
  const insertUser = db.prepare('INSERT INTO users VALUES (@id,@nom,@prenom,@email,@role,@department,@actif,@dateCreation)');
  const insertAsset = db.prepare('INSERT INTO assets VALUES (@id,@nom,@categoryId,@department,@userId,@statut,@dateAcquisition,@cpu,@ram,@disque,@os,@osVersion,@antivirus,@antivirusVersion,@applications,@marque,@modele,@serialNumber,@adresseIP,@adresseMAC,@notes)');
  const insertTicket = db.prepare('INSERT INTO tickets VALUES (@id,@titre,@description,@assetId,@userId,@technicienId,@priorite,@statut,@categorie,@dateCreation)');

  const categories = [
    { id: 'cat-1', name: 'Desktop', icon: 'Monitor', color: '#3B82F6' },
    { id: 'cat-2', name: 'Laptop', icon: 'Laptop', color: '#8B5CF6' },
    { id: 'cat-3', name: 'Imprimante', icon: 'Printer', color: '#10B981' },
    { id: 'cat-4', name: 'Routeur', icon: 'Router', color: '#F59E0B' },
    { id: 'cat-5', name: 'Switch', icon: 'Network', color: '#EF4444' },
    { id: 'cat-6', name: 'Serveur', icon: 'Server', color: '#EC4899' },
    { id: 'cat-7', name: 'Tablette', icon: 'Tablet', color: '#06B6D4' },
    { id: 'cat-8', name: 'Téléphone IP', icon: 'Phone', color: '#84CC16' },
  ];

  const users = [
    { id: 'u-1', nom: 'Benali', prenom: 'Karim', email: 'k.benali@sonatrach.dz', role: 'Admin', department: 'Informatique', actif: 1, dateCreation: '2023-01-15' },
    { id: 'u-2', nom: 'Hadj', prenom: 'Amina', email: 'a.hadj@sonatrach.dz', role: 'Technicien', department: 'Informatique', actif: 1, dateCreation: '2023-03-20' },
    { id: 'u-3', nom: 'Mekki', prenom: 'Youcef', email: 'y.mekki@sonatrach.dz', role: 'Manager', department: 'Direction', actif: 1, dateCreation: '2022-11-05' },
    { id: 'u-4', nom: 'Bouzid', prenom: 'Fatima', email: 'f.bouzid@sonatrach.dz', role: 'Technicien', department: 'Finances', actif: 1, dateCreation: '2023-06-10' },
    { id: 'u-5', nom: 'Aouadi', prenom: 'Rachid', email: 'r.aouadi@sonatrach.dz', role: 'Manager', department: 'Ressources Humaines', actif: 0, dateCreation: '2022-08-22' },
    { id: 'u-6', nom: 'Cherif', prenom: 'Nadia', email: 'n.cherif@sonatrach.dz', role: 'Technicien', department: 'Région Alger', actif: 1, dateCreation: '2023-09-01' },
    { id: 'u-7', nom: 'Larbi', prenom: 'Omar', email: 'o.larbi@sonatrach.dz', role: 'Admin', department: 'APS', actif: 1, dateCreation: '2023-02-14' },
    { id: 'u-8', nom: 'Saadi', prenom: 'Houria', email: 'h.saadi@sonatrach.dz', role: 'Technicien', department: 'Hygiène et Sécurité', actif: 1, dateCreation: '2026-01-08' },
  ];

  const assets = [
    { id: 'ast-1', nom: 'PC-DIR-001', categoryId: 'cat-1', department: 'Direction', userId: 'u-3', statut: 'Actif', dateAcquisition: '2022-05-10', cpu: 'Intel Core i7-12700', ram: '16 Go', disque: '512 Go SSD', os: 'Windows 11 Pro', osVersion: '22H2', antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.3', applications: JSON.stringify(['Microsoft Office 365', 'Adobe Reader', 'Chrome', 'Zoom']), marque: 'Dell', modele: 'OptiPlex 7090', serialNumber: 'SN-DL-001-2022', adresseIP: '192.168.1.10', adresseMAC: '00:1A:2B:3C:4D:5E', notes: 'PC direction générale' },
    { id: 'ast-2', nom: 'LPT-INFO-001', categoryId: 'cat-2', department: 'Informatique', userId: 'u-1', statut: 'Actif', dateAcquisition: '2023-01-20', cpu: 'Intel Core i5-1235U', ram: '8 Go', disque: '256 Go SSD', os: 'Windows 11 Pro', osVersion: '23H2', antivirus: 'Bitdefender GravityZone', antivirusVersion: '7.8', applications: JSON.stringify(['VS Code', 'Git', 'Chrome', 'Slack', 'VMware Workstation']), marque: 'Lenovo', modele: 'ThinkPad T14s', serialNumber: 'SN-LN-002-2023', adresseIP: '192.168.1.22', adresseMAC: '00:2B:3C:4D:5E:6F', notes: 'Laptop admin réseau' },
    { id: 'ast-3', nom: 'IMP-FIN-001', categoryId: 'cat-3', department: 'Finances', userId: 'u-4', statut: 'Actif', dateAcquisition: '2021-11-15', cpu: 'N/A', ram: 'N/A', disque: 'N/A', os: 'Firmware 3.4', osVersion: '3.4', antivirus: 'N/A', antivirusVersion: 'N/A', applications: JSON.stringify([]), marque: 'HP', modele: 'LaserJet Enterprise M507', serialNumber: 'SN-HP-003-2021', adresseIP: '192.168.1.50', adresseMAC: '00:3C:4D:5E:6F:7G', notes: 'Imprimante service comptabilité' },
    { id: 'ast-4', nom: 'PC-RH-001', categoryId: 'cat-1', department: 'Ressources Humaines', userId: 'u-5', statut: 'En maintenance', dateAcquisition: '2020-07-30', cpu: 'Intel Core i5-9400', ram: '8 Go', disque: '1 To HDD', os: 'Windows 10 Pro', osVersion: '21H2', antivirus: 'Kaspersky Endpoint', antivirusVersion: '20.1', applications: JSON.stringify(['Microsoft Office 2019', 'Adobe Reader', 'Firefox']), marque: 'HP', modele: 'EliteDesk 800 G5', serialNumber: 'SN-HP-004-2020', adresseIP: '192.168.2.11', adresseMAC: '00:4D:5E:6F:7G:8H', notes: 'Révision disque dur planifiée' },
    { id: 'ast-5', nom: 'SRV-INFO-001', categoryId: 'cat-6', department: 'Informatique', userId: 'u-2', statut: 'Actif', dateAcquisition: '2021-03-22', cpu: 'Intel Xeon Silver 4210R', ram: '64 Go ECC', disque: '4 To RAID 5', os: 'Windows Server 2022', osVersion: '21H2', antivirus: 'Bitdefender GravityZone', antivirusVersion: '7.6', applications: JSON.stringify(['Active Directory', 'IIS', 'SQL Server 2022', 'Veeam Backup']), marque: 'Dell', modele: 'PowerEdge R740', serialNumber: 'SN-DL-SRV-2021', adresseIP: '192.168.1.2', adresseMAC: '00:5E:6F:7G:8H:9I', notes: 'Serveur principal AD/DNS' },
    { id: 'ast-6', nom: 'LPT-HS-001', categoryId: 'cat-2', department: 'Hygiène et Sécurité', userId: 'u-8', statut: 'Actif', dateAcquisition: '2023-08-14', cpu: 'AMD Ryzen 5 5600U', ram: '16 Go', disque: '512 Go SSD', os: 'Windows 11 Pro', osVersion: '23H2', antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.3', applications: JSON.stringify(['AutoCAD LT', 'Microsoft Office 365', 'Chrome']), marque: 'HP', modele: 'EliteBook 845 G8', serialNumber: 'SN-HP-006-2023', adresseIP: '192.168.3.15', adresseMAC: '00:6F:7G:8H:9I:AJ', notes: '' },
    { id: 'ast-7', nom: 'RTR-INFO-001', categoryId: 'cat-4', department: 'Informatique', userId: 'u-1', statut: 'Actif', dateAcquisition: '2022-02-11', cpu: 'MIPS 1GHz', ram: '256 Mo', disque: 'Flash 256 Mo', os: 'Cisco IOS', osVersion: '15.7', antivirus: 'N/A', antivirusVersion: 'N/A', applications: JSON.stringify([]), marque: 'Cisco', modele: 'ISR 4331', serialNumber: 'SN-CS-007-2022', adresseIP: '192.168.1.1', adresseMAC: 'AA:BB:CC:DD:EE:FF', notes: 'Routeur cœur de réseau' },
    { id: 'ast-8', nom: 'PC-MG-001', categoryId: 'cat-1', department: 'Moyens Généraux', userId: null, statut: 'Hors service', dateAcquisition: '2018-04-05', cpu: 'Intel Core i3-8100', ram: '4 Go', disque: '500 Go HDD', os: 'Windows 10 Home', osVersion: '1909', antivirus: 'Aucun', antivirusVersion: 'N/A', applications: JSON.stringify(['Microsoft Office 2016']), marque: 'Acer', modele: 'Veriton M2640G', serialNumber: 'SN-AC-008-2018', adresseIP: '', adresseMAC: '00:8H:9I:AJ:BK:CL', notes: 'À remplacer' },
    { id: 'ast-9', nom: 'LPT-APS-001', categoryId: 'cat-2', department: 'APS', userId: 'u-7', statut: 'Actif', dateAcquisition: '2026-01-15', cpu: 'Intel Core i7-1355U', ram: '16 Go', disque: '512 Go SSD', os: 'Windows 11 Pro', osVersion: '23H2', antivirus: 'Bitdefender GravityZone', antivirusVersion: '7.8', applications: JSON.stringify(['Microsoft Office 365', 'Chrome', 'Teams']), marque: 'Lenovo', modele: 'ThinkPad L14 Gen 4', serialNumber: 'SN-LN-009-2026', adresseIP: '192.168.5.20', adresseMAC: '00:9I:AJ:BK:CL:DM', notes: '' },
    { id: 'ast-10', nom: 'PC-ENF-001', categoryId: 'cat-1', department: 'Enfances', userId: null, statut: 'Actif', dateAcquisition: '2022-09-01', cpu: 'Intel Core i5-10400', ram: '8 Go', disque: '256 Go SSD', os: 'Windows 10 Pro', osVersion: '22H2', antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.1', applications: JSON.stringify(['Microsoft Office 365', 'Firefox']), marque: 'Dell', modele: 'OptiPlex 5090', serialNumber: 'SN-DL-010-2022', adresseIP: '192.168.6.10', adresseMAC: '00:AJ:BK:CL:DM:EN', notes: '' },
    { id: 'ast-11', nom: 'SWT-INFO-001', categoryId: 'cat-5', department: 'Informatique', userId: 'u-2', statut: 'Actif', dateAcquisition: '2021-03-22', cpu: 'N/A', ram: 'N/A', disque: 'N/A', os: 'Cisco IOS', osVersion: '15.2', antivirus: 'N/A', antivirusVersion: 'N/A', applications: JSON.stringify([]), marque: 'Cisco', modele: 'Catalyst 2960-X', serialNumber: 'SN-CS-011-2021', adresseIP: '192.168.1.3', adresseMAC: 'BB:CC:DD:EE:FF:AA', notes: 'Switch de distribution' },
    { id: 'ast-12', nom: 'LPT-RA-001', categoryId: 'cat-2', department: 'Région Alger', userId: 'u-6', statut: 'Actif', dateAcquisition: '2023-05-20', cpu: 'Intel Core i5-1235U', ram: '8 Go', disque: '256 Go SSD', os: 'Windows 11 Pro', osVersion: '23H2', antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.3', applications: JSON.stringify(['Microsoft Office 365', 'Chrome', 'ArcGIS']), marque: 'Dell', modele: 'Latitude 5540', serialNumber: 'SN-DL-012-2023', adresseIP: '192.168.7.25', adresseMAC: '00:BK:CL:DM:EN:FO', notes: '' },
  ];

  const tickets = [
    { id: 'tkt-1', titre: 'Panne PC Bureau - Finance', description: 'Imprimante ne répond plus au réseau', assetId: 'ast-3', userId: 'u-4', technicienId: 'u-2', priorite: 'Haute', statut: 'Ouvert', categorie: 'Matériel', dateCreation: '2026-03-15' },
    { id: 'tkt-2', titre: 'Installation logiciel comptabilité', description: "Besoin d'installer Sage 100 sur le PC", assetId: 'ast-10', userId: null, technicienId: 'u-2', priorite: 'Moyenne', statut: 'En cours', categorie: 'Logiciel', dateCreation: '2026-03-18' },
    { id: 'tkt-3', titre: 'Mise à jour antivirus RH', description: 'Antivirus expiré, renouveler la licence', assetId: 'ast-4', userId: 'u-5', technicienId: null, priorite: 'Basse', statut: 'Résolu', categorie: 'Sécurité', dateCreation: '2026-03-10' },
  ];

  const seedAll = db.transaction(() => {
    categories.forEach(r => insertCat.run(r));
    users.forEach(r => insertUser.run(r));
    assets.forEach(r => insertAsset.run(r));
    tickets.forEach(r => insertTicket.run(r));
  });
  seedAll();
  console.log('Database seeded with initial data.');
}

seedIfEmpty();

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseAsset(row) {
  if (!row) return null;
  return { ...row, actif: undefined, applications: row.applications ? JSON.parse(row.applications) : [] };
}

function parseUser(row) {
  if (!row) return null;
  return { ...row, actif: row.actif === 1 };
}

// ── Categories API ─────────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT * FROM categories').all();
  res.json(rows);
});

app.post('/api/categories', (req, res) => {
  const { name, icon, color } = req.body;
  const id = `cat-${Date.now()}`;
  db.prepare('INSERT INTO categories VALUES (@id,@name,@icon,@color)').run({ id, name, icon, color });
  res.json({ id, name, icon, color });
});

app.put('/api/categories/:id', (req, res) => {
  const { name, icon, color } = req.body;
  db.prepare('UPDATE categories SET name=@name, icon=@icon, color=@color WHERE id=@id').run({ id: req.params.id, name, icon, color });
  res.json({ id: req.params.id, name, icon, color });
});

app.delete('/api/categories/:id', (req, res) => {
  db.prepare('DELETE FROM categories WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Users API ─────────────────────────────────────────────────────────────────
app.get('/api/users', (req, res) => {
  const rows = db.prepare('SELECT * FROM users').all();
  res.json(rows.map(parseUser));
});

app.post('/api/users', (req, res) => {
  const { nom, prenom, email, role, department, actif } = req.body;
  const id = `u-${Date.now()}`;
  const dateCreation = new Date().toISOString().split('T')[0];
  db.prepare('INSERT INTO users VALUES (@id,@nom,@prenom,@email,@role,@department,@actif,@dateCreation)')
    .run({ id, nom, prenom, email, role, department, actif: actif ? 1 : 0, dateCreation });
  res.json(parseUser({ id, nom, prenom, email, role, department, actif: actif ? 1 : 0, dateCreation }));
});

app.put('/api/users/:id', (req, res) => {
  const { nom, prenom, email, role, department, actif } = req.body;
  db.prepare('UPDATE users SET nom=@nom,prenom=@prenom,email=@email,role=@role,department=@department,actif=@actif WHERE id=@id')
    .run({ id: req.params.id, nom, prenom, email, role, department, actif: actif ? 1 : 0 });
  const row = db.prepare('SELECT * FROM users WHERE id=?').get(req.params.id);
  res.json(parseUser(row));
});

app.delete('/api/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Assets API ────────────────────────────────────────────────────────────────
app.get('/api/assets', (req, res) => {
  const rows = db.prepare('SELECT * FROM assets').all();
  res.json(rows.map(parseAsset));
});

app.post('/api/assets', (req, res) => {
  const a = req.body;
  const id = `ast-${Date.now()}`;
  db.prepare(`INSERT INTO assets VALUES (@id,@nom,@categoryId,@department,@userId,@statut,@dateAcquisition,@cpu,@ram,@disque,@os,@osVersion,@antivirus,@antivirusVersion,@applications,@marque,@modele,@serialNumber,@adresseIP,@adresseMAC,@notes)`)
    .run({ ...a, id, applications: JSON.stringify(a.applications || []) });
  res.json({ ...a, id, applications: a.applications || [] });
});

app.put('/api/assets/:id', (req, res) => {
  const a = req.body;
  db.prepare(`UPDATE assets SET nom=@nom,categoryId=@categoryId,department=@department,userId=@userId,statut=@statut,dateAcquisition=@dateAcquisition,cpu=@cpu,ram=@ram,disque=@disque,os=@os,osVersion=@osVersion,antivirus=@antivirus,antivirusVersion=@antivirusVersion,applications=@applications,marque=@marque,modele=@modele,serialNumber=@serialNumber,adresseIP=@adresseIP,adresseMAC=@adresseMAC,notes=@notes WHERE id=@id`)
    .run({ ...a, id: req.params.id, applications: JSON.stringify(a.applications || []) });
  const row = db.prepare('SELECT * FROM assets WHERE id=?').get(req.params.id);
  res.json(parseAsset(row));
});

app.delete('/api/assets/:id', (req, res) => {
  db.prepare('DELETE FROM assets WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Tickets API ───────────────────────────────────────────────────────────────
app.get('/api/tickets', (req, res) => {
  const rows = db.prepare('SELECT * FROM tickets').all();
  res.json(rows);
});

app.post('/api/tickets', (req, res) => {
  const t = req.body;
  const id = `tkt-${Date.now()}`;
  const dateCreation = new Date().toISOString().split('T')[0];
  db.prepare('INSERT INTO tickets VALUES (@id,@titre,@description,@assetId,@userId,@technicienId,@priorite,@statut,@categorie,@dateCreation)')
    .run({ ...t, id, dateCreation });
  res.json({ ...t, id, dateCreation });
});

app.put('/api/tickets/:id', (req, res) => {
  const t = req.body;
  db.prepare('UPDATE tickets SET titre=@titre,description=@description,assetId=@assetId,userId=@userId,technicienId=@technicienId,priorite=@priorite,statut=@statut,categorie=@categorie WHERE id=@id')
    .run({ ...t, id: req.params.id });
  const row = db.prepare('SELECT * FROM tickets WHERE id=?').get(req.params.id);
  res.json(row);
});

app.delete('/api/tickets/:id', (req, res) => {
  db.prepare('DELETE FROM tickets WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Reset ─────────────────────────────────────────────────────────────────────
app.post('/api/reset', (req, res) => {
  db.exec('DELETE FROM tickets; DELETE FROM assets; DELETE FROM users; DELETE FROM categories;');
  // Re-run seed
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (count.c === 0) seedIfEmpty();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`PARC IT API server running on http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});
