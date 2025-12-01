import type { Client } from "@/pages/private/masters/clients/Clients";

const mock: Client[] = [
  {
    id: "1",
    documentType: "CC",
    document: "123456",
    fullName: "Juan Pérez",
    email: "juan@example.com",
    phone: "3001234567",
    type: "Frecuente",
    address: "Calle 123 #45-67",
    neighborhood: "Centro",
    notes: "Cliente preferencial, siempre pide descuento.",
    tags: ["VIP", "Mayorista"],
    lastPurchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 45,
    pendingBalance: 0,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    audit: {
      createdBy: "admin",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      lastModifiedBy: "admin",
      lastModifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "2",
    documentType: "NIT",
    document: "900123456",
    fullName: "Empresa XYZ",
    companyName: "Empresa XYZ SAS",
    email: "contacto@xyz.com",
    phone: "6012345678",
    type: "Corporativo",
    address: "Av Principal #100-200",
    lastPurchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 120,
    pendingBalance: 450000,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    audit: {
      createdBy: "admin",
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "3",
    documentType: "CC",
    document: "789012",
    fullName: "Maria Gómez",
    phone: "3009876543",
    type: "Particular",
    lastPurchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 8,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    active: false,
    audit: {
      createdBy: "admin",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

export const clientsService = {
  async list(params?: { q?: string }) {
    await new Promise(r => setTimeout(r, 250));
    if (!params?.q) return { data: mock, total: mock.length };
    const q = params.q.toLowerCase();
    const data = mock.filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.document.toLowerCase().includes(q) ||
      (c.phone?.toLowerCase().includes(q) ?? false) ||
      (c.email?.toLowerCase().includes(q) ?? false)
    );
    return { data, total: data.length };
  },
  async get(id: string) {
    await new Promise(r => setTimeout(r, 150));
    return mock.find(c => c.id === id) || null;
  },
  async create(payload: Partial<Client>) {
    await new Promise(r => setTimeout(r, 200));
    const created: Client = {
      id: String(Date.now()),
      documentType: (payload.documentType as Client["documentType"]) || "CC",
      document: payload.document || "",
      fullName: payload.fullName || "",
      companyName: payload.companyName,
      email: payload.email,
      phone: payload.phone,
      phone2: payload.phone2,
      address: payload.address,
      neighborhood: payload.neighborhood,
      type: payload.type || "Particular",
      notes: payload.notes,
      tags: payload.tags || [],
      createdAt: new Date().toISOString(),
      active: true,
      audit: {
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
    };
    mock.unshift(created);
    return created;
  },
  async update(id: string, payload: Partial<Client>) {
    await new Promise(r => setTimeout(r, 200));
    const idx = mock.findIndex(c => c.id === id);
    if (idx >= 0) {
      mock[idx] = {
        ...mock[idx],
        ...payload,
        audit: {
          ...mock[idx].audit,
          lastModifiedBy: "admin",
          lastModifiedAt: new Date().toISOString(),
        },
      } as Client;
    }
    return mock[idx] || null;
  },
  async toggleStatus(id: string) {
    await new Promise(r => setTimeout(r, 150));
    const cli = mock.find(c => c.id === id);
    if (cli) {
      cli.active = !cli.active;
      cli.audit = {
        ...cli.audit,
        lastModifiedBy: "admin",
        lastModifiedAt: new Date().toISOString(),
      };
    }
    return cli || null;
  },
};
