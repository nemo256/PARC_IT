export const DEPARTMENTS = [
  'Moyens Généraux',
  'Hygiène et Sécurité',
  'Informatique',
  'Direction',
  'Enfances',
  'Finances',
  'Ressources Humaines',
  'Région Alger',
  'APS',
];

export const ROLES = ['Admin', 'Technicien', 'Manager'];

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Desktop', icon: 'Monitor', color: '#3B82F6' },
  { id: 'cat-2', name: 'Laptop', icon: 'Laptop', color: '#8B5CF6' },
  { id: 'cat-3', name: 'Imprimante', icon: 'Printer', color: '#10B981' },
  { id: 'cat-4', name: 'Routeur', icon: 'Router', color: '#F59E0B' },
  { id: 'cat-5', name: 'Switch', icon: 'Network', color: '#EF4444' },
  { id: 'cat-6', name: 'Serveur', icon: 'Server', color: '#EC4899' },
  { id: 'cat-7', name: 'Tablette', icon: 'Tablet', color: '#06B6D4' },
  { id: 'cat-8', name: 'Téléphone IP', icon: 'Phone', color: '#84CC16' },
];

export const INITIAL_USERS = [
  { id: 'u-1', nom: 'Benali', prenom: 'Karim', email: 'k.benali@sonatrach.dz', role: 'Admin', department: 'Informatique', actif: true, dateCreation: '2023-01-15' },
  { id: 'u-2', nom: 'Hadj', prenom: 'Amina', email: 'a.hadj@sonatrach.dz', role: 'Technicien', department: 'Informatique', actif: true, dateCreation: '2023-03-20' },
  { id: 'u-3', nom: 'Mekki', prenom: 'Youcef', email: 'y.mekki@sonatrach.dz', role: 'Manager', department: 'Direction', actif: true, dateCreation: '2022-11-05' },
  { id: 'u-4', nom: 'Bouzid', prenom: 'Fatima', email: 'f.bouzid@sonatrach.dz', role: 'Technicien', department: 'Finances', actif: true, dateCreation: '2023-06-10' },
  { id: 'u-5', nom: 'Aouadi', prenom: 'Rachid', email: 'r.aouadi@sonatrach.dz', role: 'Manager', department: 'Ressources Humaines', actif: false, dateCreation: '2022-08-22' },
  { id: 'u-6', nom: 'Cherif', prenom: 'Nadia', email: 'n.cherif@sonatrach.dz', role: 'Technicien', department: 'Région Alger', actif: true, dateCreation: '2023-09-01' },
  { id: 'u-7', nom: 'Larbi', prenom: 'Omar', email: 'o.larbi@sonatrach.dz', role: 'Admin', department: 'APS', actif: true, dateCreation: '2023-02-14' },
  { id: 'u-8', nom: 'Saadi', prenom: 'Houria', email: 'h.saadi@sonatrach.dz', role: 'Technicien', department: 'Hygiène et Sécurité', actif: true, dateCreation: '2026-01-08' },
];

export const INITIAL_ASSETS = [
  {
    id: 'ast-1', nom: 'PC-DIR-001', categoryId: 'cat-1', department: 'Direction',
    userId: 'u-3', statut: 'Actif', dateAcquisition: '2022-05-10',
    cpu: 'Intel Core i7-12700', ram: '16 Go', disque: '512 Go SSD',
    os: 'Windows 11 Pro', osVersion: '22H2',
    antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.3',
    applications: ['Microsoft Office 365', 'Adobe Reader', 'Chrome', 'Zoom'],
    marque: 'Dell', modele: 'OptiPlex 7090', serialNumber: 'SN-DL-001-2022',
    adresseIP: '192.168.1.10', adresseMAC: '00:1A:2B:3C:4D:5E', notes: 'PC direction générale'
  },
  {
    id: 'ast-2', nom: 'LPT-INFO-001', categoryId: 'cat-2', department: 'Informatique',
    userId: 'u-1', statut: 'Actif', dateAcquisition: '2023-01-20',
    cpu: 'Intel Core i5-1235U', ram: '8 Go', disque: '256 Go SSD',
    os: 'Windows 11 Pro', osVersion: '23H2',
    antivirus: 'Bitdefender GravityZone', antivirusVersion: '7.8',
    applications: ['VS Code', 'Git', 'Chrome', 'Slack', 'VMware Workstation'],
    marque: 'Lenovo', modele: 'ThinkPad T14s', serialNumber: 'SN-LN-002-2023',
    adresseIP: '192.168.1.22', adresseMAC: '00:2B:3C:4D:5E:6F', notes: 'Laptop admin réseau'
  },
  {
    id: 'ast-3', nom: 'IMP-FIN-001', categoryId: 'cat-3', department: 'Finances',
    userId: 'u-4', statut: 'Actif', dateAcquisition: '2021-11-15',
    cpu: 'N/A', ram: 'N/A', disque: 'N/A',
    os: 'Firmware 3.4', osVersion: '3.4',
    antivirus: 'N/A', antivirusVersion: 'N/A',
    applications: [],
    marque: 'HP', modele: 'LaserJet Enterprise M507', serialNumber: 'SN-HP-003-2021',
    adresseIP: '192.168.1.50', adresseMAC: '00:3C:4D:5E:6F:7G', notes: 'Imprimante service comptabilité'
  },
  {
    id: 'ast-4', nom: 'PC-RH-001', categoryId: 'cat-1', department: 'Ressources Humaines',
    userId: 'u-5', statut: 'En maintenance', dateAcquisition: '2020-07-30',
    cpu: 'Intel Core i5-9400', ram: '8 Go', disque: '1 To HDD',
    os: 'Windows 10 Pro', osVersion: '21H2',
    antivirus: 'Kaspersky Endpoint', antivirusVersion: '20.1',
    applications: ['Microsoft Office 2019', 'Adobe Reader', 'Firefox'],
    marque: 'HP', modele: 'EliteDesk 800 G5', serialNumber: 'SN-HP-004-2020',
    adresseIP: '192.168.2.11', adresseMAC: '00:4D:5E:6F:7G:8H', notes: 'Révision disque dur planifiée'
  },
  {
    id: 'ast-5', nom: 'SRV-INFO-001', categoryId: 'cat-6', department: 'Informatique',
    userId: 'u-2', statut: 'Actif', dateAcquisition: '2021-03-22',
    cpu: 'Intel Xeon Silver 4210R', ram: '64 Go ECC', disque: '4 To RAID 5',
    os: 'Windows Server 2022', osVersion: '21H2',
    antivirus: 'Bitdefender GravityZone', antivirusVersion: '7.6',
    applications: ['Active Directory', 'IIS', 'SQL Server 2022', 'Veeam Backup'],
    marque: 'Dell', modele: 'PowerEdge R740', serialNumber: 'SN-DL-SRV-2021',
    adresseIP: '192.168.1.2', adresseMAC: '00:5E:6F:7G:8H:9I', notes: 'Serveur principal AD/DNS'
  },
  {
    id: 'ast-6', nom: 'LPT-HS-001', categoryId: 'cat-2', department: 'Hygiène et Sécurité',
    userId: 'u-8', statut: 'Actif', dateAcquisition: '2023-08-14',
    cpu: 'AMD Ryzen 5 5600U', ram: '16 Go', disque: '512 Go SSD',
    os: 'Windows 11 Pro', osVersion: '23H2',
    antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.3',
    applications: ['AutoCAD LT', 'Microsoft Office 365', 'Chrome'],
    marque: 'HP', modele: 'EliteBook 845 G8', serialNumber: 'SN-HP-006-2023',
    adresseIP: '192.168.3.15', adresseMAC: '00:6F:7G:8H:9I:AJ', notes: ''
  },
  {
    id: 'ast-7', nom: 'RTR-INFO-001', categoryId: 'cat-4', department: 'Informatique',
    userId: 'u-1', statut: 'Actif', dateAcquisition: '2022-02-11',
    cpu: 'MIPS 1GHz', ram: '256 Mo', disque: 'Flash 256 Mo',
    os: 'Cisco IOS', osVersion: '15.7',
    antivirus: 'N/A', antivirusVersion: 'N/A',
    applications: [],
    marque: 'Cisco', modele: 'ISR 4331', serialNumber: 'SN-CS-007-2022',
    adresseIP: '192.168.1.1', adresseMAC: 'AA:BB:CC:DD:EE:FF', notes: 'Routeur cœur de réseau'
  },
  {
    id: 'ast-8', nom: 'PC-MG-001', categoryId: 'cat-1', department: 'Moyens Généraux',
    userId: null, statut: 'Hors service', dateAcquisition: '2018-04-05',
    cpu: 'Intel Core i3-8100', ram: '4 Go', disque: '500 Go HDD',
    os: 'Windows 10 Home', osVersion: '1909',
    antivirus: 'Aucun', antivirusVersion: 'N/A',
    applications: ['Microsoft Office 2016'],
    marque: 'Acer', modele: 'Veriton M2640G', serialNumber: 'SN-AC-008-2018',
    adresseIP: '', adresseMAC: '00:8H:9I:AJ:BK:CL', notes: 'À remplacer'
  },
  {
    id: 'ast-9', nom: 'LPT-APS-001', categoryId: 'cat-2', department: 'APS',
    userId: 'u-7', statut: 'Actif', dateAcquisition: '2026-01-15',
    cpu: 'Intel Core i7-1355U', ram: '16 Go', disque: '512 Go SSD',
    os: 'Windows 11 Pro', osVersion: '23H2',
    antivirus: 'Bitdefender GravityZone', antivirusVersion: '7.8',
    applications: ['Microsoft Office 365', 'Chrome', 'Teams'],
    marque: 'Lenovo', modele: 'ThinkPad L14 Gen 4', serialNumber: 'SN-LN-009-2026',
    adresseIP: '192.168.5.20', adresseMAC: '00:9I:AJ:BK:CL:DM', notes: ''
  },
  {
    id: 'ast-10', nom: 'PC-ENF-001', categoryId: 'cat-1', department: 'Enfances',
    userId: null, statut: 'Actif', dateAcquisition: '2022-09-01',
    cpu: 'Intel Core i5-10400', ram: '8 Go', disque: '256 Go SSD',
    os: 'Windows 10 Pro', osVersion: '22H2',
    antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.1',
    applications: ['Microsoft Office 365', 'Firefox'],
    marque: 'Dell', modele: 'OptiPlex 5090', serialNumber: 'SN-DL-010-2022',
    adresseIP: '192.168.6.10', adresseMAC: '00:AJ:BK:CL:DM:EN', notes: ''
  },
  {
    id: 'ast-11', nom: 'SWT-INFO-001', categoryId: 'cat-5', department: 'Informatique',
    userId: 'u-2', statut: 'Actif', dateAcquisition: '2021-03-22',
    cpu: 'N/A', ram: 'N/A', disque: 'N/A',
    os: 'Cisco IOS', osVersion: '15.2',
    antivirus: 'N/A', antivirusVersion: 'N/A',
    applications: [],
    marque: 'Cisco', modele: 'Catalyst 2960-X', serialNumber: 'SN-CS-011-2021',
    adresseIP: '192.168.1.3', adresseMAC: 'BB:CC:DD:EE:FF:AA', notes: 'Switch de distribution'
  },
  {
    id: 'ast-12', nom: 'LPT-RA-001', categoryId: 'cat-2', department: 'Région Alger',
    userId: 'u-6', statut: 'Actif', dateAcquisition: '2023-05-20',
    cpu: 'Intel Core i5-1235U', ram: '8 Go', disque: '256 Go SSD',
    os: 'Windows 11 Pro', osVersion: '23H2',
    antivirus: 'Kaspersky Endpoint', antivirusVersion: '21.3',
    applications: ['Microsoft Office 365', 'Chrome', 'ArcGIS'],
    marque: 'Dell', modele: 'Latitude 5540', serialNumber: 'SN-DL-012-2023',
    adresseIP: '192.168.7.25', adresseMAC: '00:BK:CL:DM:EN:FO', notes: ''
  },
];

export const INITIAL_TICKETS = [
  { id: 'tkt-1', titre: 'Panne PC Bureau - Finance', assetId: 'ast-3', userId: 'u-4', technicienId: 'u-2', priorite: 'Haute', statut: 'Ouvert', dateCreation: '2026-03-15', description: 'Imprimante ne répond plus au réseau', categorie: 'Matériel' },
  { id: 'tkt-2', titre: 'Installation logiciel comptabilité', assetId: 'ast-10', userId: null, technicienId: 'u-2', priorite: 'Moyenne', statut: 'En cours', dateCreation: '2026-03-18', description: 'Besoin d\'installer Sage 100 sur le PC', categorie: 'Logiciel' },
  { id: 'tkt-3', titre: 'Mise à jour antivirus RH', assetId: 'ast-4', userId: 'u-5', technicienId: null, priorite: 'Basse', statut: 'Résolu', dateCreation: '2026-03-10', description: 'Antivirus expiré, renouveler la licence', categorie: 'Sécurité' },
];
