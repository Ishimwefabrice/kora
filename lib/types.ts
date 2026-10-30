export type LineStatus = "proven" | "blank" | "held";

export type LedgerLine = {
  id: string;
  raw: string;
  item: string;
  itemRw: string;
  quantity: string | null;
  amountRwf: number | null;
  confidence: number;
  status: LineStatus;
  reason: string;
  tavilyNote: string | null;
};

export type ObservatoryCall = {
  agent: "scout" | "ledge" | "stella" | "market";
  model: string;
  endpoint: string;
  promptTokens: number;
  completionTokens: number;
  ms: number;
};

export type Kit = {
  id: string;
  userId: string | null;
  publicSeed?: boolean;
  createdAt: string;
  shopName: string;
  shopNameRw: string;
  place: string;
  source: "seed" | "live";
  notes: string;
  lines: LedgerLine[];
  whatsappRw: string;
  whatsappEn: string;
  observatory: ObservatoryCall[];
  approved: boolean;
  approvedAt: string | null;
  paypal: {
    mode: "sandbox-live" | "seed";
    status: string;
    invoiceId: string | null;
    href: string | null;
    note: string;
  } | null;
};

export type ExtractRequest = {
  imageDataUrl?: string;
  notes?: string;
  seed?: "kimironko";
};

export type Health = {
  ok: true;
  product: "kora";
  database: boolean;
  tokenFactory: boolean;
  tavily: boolean;
  paypal: boolean;
  visionModel: string;
  copyModel: string;
  endpoint: string;
};
