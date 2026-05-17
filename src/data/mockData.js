/* ─── USUARIS ─────────────────────────────────────────────── */
export const users = [
  {
    id: 1,
    name: 'Joan Martí',
    dni: '12345678A',
    address: 'Carrer Major, 12, Barcelona',
    phone: '612345678',
    email: 'joan@transportalia.cat',
    password: '1234',
    blocked: false,
    licenseImage: null,
  },
  {
    id: 2,
    name: 'Pere Bloquejat',
    dni: '99999999B',
    address: '',
    phone: '',
    email: 'bloquejat@transportalia.cat',
    password: '1234',
    blocked: true,
    licenseImage: null,
  },
];

/* ─── CAMIONS ─────────────────────────────────────────────── */
export const trucks = [
  {
    id: 'T-001',
    plate: 'ABC-1234',
    model: 'Volvo FH16',
    year: 2021,
    capacity: '25 T',
  },
  {
    id: 'T-002',
    plate: 'XYZ-5678',
    model: 'Mercedes Actros',
    year: 2020,
    capacity: '20 T',
  },
];

/* ─── TRANSPORTS ──────────────────────────────────────────── */
export const transports = [
{ id: 'TR-A01', origin: 'Barcelona',  destination: 'Madrid',    cargo: 'Electrodomèstics',       weight: '18 T', volume: '42 m³', date: '15/05/2026 15:20', status: 'pending' },
{ id: 'TR-A02', origin: 'Girona',     destination: 'França',    cargo: 'Maquinària',             weight: '22 T', volume: '55 m³', date: '15/05/2026 08:45', status: 'pending' },
{ id: 'TR-A03', origin: 'Tarragona',  destination: 'Itàlia',    cargo: 'Químics',                weight: '15 T', volume: '38 m³', date: '15/05/2026 10:10', status: 'pending' },
{ id: 'TR-A04', origin: 'Lleida',     destination: 'Portugal',  cargo: 'Tèxtils',                weight: '20 T', volume: '60 m³', date: '15/05/2026 12:30', status: 'pending' },
{ id: 'TR-A05', origin: 'València',   destination: 'Bèlgica',   cargo: 'Electrònica',            weight: '12 T', volume: '30 m³', date: '15/05/2026 17:05', status: 'pending' },
{ id: 'TR-001', origin: 'Barcelona',  destination: 'Madrid',    cargo: 'Electrodomèstics',       weight: '18 T', volume: '42 m³', date: '20/05/2026 07:50', status: 'pending' },
{ id: 'TR-002', origin: 'Girona',     destination: 'Valencia',  cargo: 'Maquinària industrial',  weight: '22 T', volume: '55 m³', date: '22/05/2026 09:15', status: 'pending' },
{ id: 'TR-003', origin: 'Lleida',     destination: 'Zaragoza',  cargo: 'Productes alimentaris',  weight: '15 T', volume: '38 m³', date: '24/05/2026 11:40', status: 'pending' },
{ id: 'TR-004', origin: 'Tarragona',  destination: 'Bilbao',    cargo: 'Materials construcció',  weight: '20 T', volume: '60 m³', date: '25/05/2026 14:25', status: 'pending' },
{ id: 'TR-005', origin: 'Manresa',    destination: 'Sevilla',   cargo: 'Tèxtils',                weight: '12 T', volume: '30 m³', date: '26/05/2026 16:55', status: 'pending' },
{ id: 'TR-006', origin: 'Sabadell',   destination: 'Palma',     cargo: 'Electrònica',            weight: '8 T',  volume: '22 m³', date: '27/05/2026 06:35', status: 'pending' },
{ id: 'TR-007', origin: 'Terrassa',   destination: 'Alacant',   cargo: 'Mobles',                 weight: '16 T', volume: '48 m³', date: '28/05/2026 13:20', status: 'pending' },
{ id: 'TR-008', origin: 'Reus',       destination: 'Pamplona',  cargo: 'Químics',                weight: '19 T', volume: '50 m³', date: '29/05/2026 18:10', status: 'pending' },
{ id: 'TR-009', origin: 'Vic',        destination: 'Còrdova',   cargo: 'Paper',                  weight: '10 T', volume: '28 m³', date: '30/05/2026 08:05', status: 'pending' },
{ id: 'TR-010', origin: 'Figueres',   destination: 'Granada',   cargo: 'Vidre',                  weight: '14 T', volume: '35 m³', date: '31/05/2026 15:45', status: 'pending' },
{ id: 'TR-011', origin: 'Olot',       destination: 'Valladolid',cargo: 'Metal·lúrgia',           weight: '23 T', volume: '58 m³', date: '01/06/2026 19:00', status: 'pending' },
{ id: 'TR-012', origin: 'Igualada',   destination: 'Vigo',      cargo: 'Plàstics',               weight: '11 T', volume: '32 m³', date: '02/06/2026 10:50', status: 'pending' },
];

/* ─── ESTATS INICIALS DEL CONDUCTOR ─────────────────────────
   hasTruck:      si té camió assignat
   hasTransport:  si té transport assignat
   assignedTruck: el camió assignat (o null)
   assignedTransport: el transport assignat (o null)
──────────────────────────────────────────────────────────── */
export const initialDriverState = {
  hasTruck: false,
  hasTransport: false,
  assignedTruck: null,
  assignedTransport: null,
};
