export type ReceiptCapture = {
  uri: string;
  base64: string;
  source: "camera" | "gallery";
  createdAt: number;
  isDarkCapture: boolean;
};

export type ReceiptLineItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  confidence: number;
};

export type ReceiptDraft = {
  merchant_name: string | null;
  receipt_date: string | null;
  currency: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  confidence: number;
  raw_text: string;
  notes: string[];
  items: ReceiptLineItem[];
};

export type ReceiptSession = {
  capture: ReceiptCapture | null;
  extraction: ReceiptDraft | null;
};

let activeReceiptSession: ReceiptSession = {
  capture: null,
  extraction: null,
};

export function saveReceiptCapture(capture: ReceiptCapture) {
  activeReceiptSession = {
    capture,
    extraction: null,
  };
}

export function saveReceiptExtraction(extraction: ReceiptDraft) {
  activeReceiptSession = {
    ...activeReceiptSession,
    extraction,
  };
}

export function getReceiptSession() {
  return activeReceiptSession;
}

export function clearReceiptSession() {
  activeReceiptSession = {
    capture: null,
    extraction: null,
  };
}
