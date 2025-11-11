import type { Client } from "@/pages/private/records/clients/ClientsPage";

const mock: Client[] = [
  { id: "1", documentType: "CC", document: "123456", fullName: "Juan Pérez", email: "juan@example.com", phone: "3001234567", isFrequent: true, createdAt: new Date().toISOString(), active: true },
  { id: "2", documentType: "NIT", document: "900123456", fullName: "Empresa XYZ", email: "contacto@xyz.com", phone: "6012345678", isFrequent: false, createdAt: new Date().toISOString(), active: true },
  { id: "3", documentType: "CC", document: "789012", fullName: "Maria Gómez", phone: "3009876543", isFrequent: true, createdAt: new Date().toISOString(), active: false },
];

export const clientsService = {
  async list(params?: { q?: string }) {
    await new Promise(r => setTimeout(r, 250));
    if (!params?.q) return { data: mock, total: mock.length };
    const q = params.q.toLowerCase();
    const data = mock.filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.document.toLowerCase().includes(q) ||
      (c.phone?.toLowerCase().includes(q) ?? false)
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
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      isFrequent: !!payload.isFrequent,
      createdAt: new Date().toISOString(),
      active: true,
    };
    mock.unshift(created);
    return created;
  },
  async update(id: string, payload: Partial<Client>) {
    await new Promise(r => setTimeout(r, 200));
    const idx = mock.findIndex(c => c.id === id);
    if (idx >= 0) mock[idx] = { ...mock[idx], ...payload } as Client;
    return mock[idx] || null;
  },
  async toggleStatus(id: string) {
    await new Promise(r => setTimeout(r, 150));
    const cli = mock.find(c => c.id === id);
    if (cli) cli.active = !cli.active;
    return cli || null;
  },
};
