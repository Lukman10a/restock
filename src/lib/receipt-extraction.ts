// import TextRecognition from "react-native-text-recognition";
import TextRecognition from "@react-native-ml-kit/text-recognition";

import type { ReceiptDraft, ReceiptLineItem } from "@/lib/receipt-session";

type ParsedTotals = {
  subtotal: number | null;
  tax: number | null;
  total: number | null;
};

const CURRENCY_HINTS = [
  "$",
  "USD",
  "US$",
  "CAD",
  "EUR",
  "GBP",
  "NGN",
  "₦",
  "€",
  "£",
];
const IGNORED_LINE_KEYWORDS = [
  "subtotal",
  "sub total",
  "tax",
  "vat",
  "total",
  "balance",
  "change",
  "cash",
  "card",
  "debit",
  "credit",
  "thank you",
  "receipt",
  "invoice",
  "amount due",
  "amount paid",
  "served",
  "server",
];
const DATE_PATTERNS = [
  /\b(?:\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/,
  /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/,
  /\b(?:\d{1,2}\s+[A-Z]{3,9}\s+\d{2,4})\b/i,
  /\b(?:[A-Z]{3,9}\s+\d{1,2},?\s+\d{2,4})\b/i,
];

function normalizeLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

function isIgnoredLine(line: string) {
  const lower = line.toLowerCase();
  return IGNORED_LINE_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function isLikelyItemLine(line: string) {
  return /[a-zA-Z]/.test(line) && /\d/.test(line) && !isIgnoredLine(line);
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function moneyFromLine(line: string) {
  const matches = line.match(/(?:[$€£₦]?\s*)?(\d{1,4}(?:[.,]\d{2})?)/g);

  if (!matches) {
    return [] as number[];
  }

  return matches
    .map((match) => toNumber(match))
    .filter((value): value is number => value !== null);
}

function findDate(lines: string[]) {
  for (const line of lines) {
    for (const pattern of DATE_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        return match[0];
      }
    }
  }

  return null;
}

function findCurrency(lines: string[]) {
  const joined = lines.join(" ").toUpperCase();

  for (const hint of CURRENCY_HINTS) {
    if (joined.includes(hint)) {
      if (hint === "₦") return "NGN";
      if (hint === "$" || hint === "US$") return "USD";
      return hint.replace("US$", "USD");
    }
  }

  return "USD";
}

function findMerchant(lines: string[]) {
  const filtered = lines.filter((line) => {
    const normalized = normalizeLine(line);
    return (
      normalized.length > 2 &&
      !isIgnoredLine(normalized) &&
      !/\d/.test(normalized)
    );
  });

  if (filtered.length > 0) {
    return normalizeLine(filtered[0]);
  }

  const fallback = lines.find((line) => {
    const normalized = normalizeLine(line);
    return (
      normalized.length > 2 &&
      /[A-Z]/.test(normalized) &&
      !isIgnoredLine(normalized)
    );
  });

  return fallback ? normalizeLine(fallback) : null;
}

function findTotals(lines: string[]): ParsedTotals {
  let subtotal: number | null = null;
  let tax: number | null = null;
  let total: number | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const amount = moneyFromLine(line).at(-1) ?? null;

    if (amount === null) {
      continue;
    }

    if (lower.includes("subtotal") || lower.includes("sub total")) {
      subtotal = amount;
      continue;
    }

    if (lower.includes("tax") || lower.includes("vat")) {
      tax = amount;
      continue;
    }

    if (
      lower.includes("total") &&
      !lower.includes("subtotal") &&
      !lower.includes("sub total") &&
      !lower.includes("change") &&
      !lower.includes("balance")
    ) {
      total = amount;
    }
  }

  return { subtotal, tax, total };
}

function parseQuantityAndPrices(line: string) {
  const amountMatches = [
    ...line.matchAll(/(?:[$€£₦]?\s*)?(\d{1,4}(?:[.,]\d{2})?)/g),
  ];
  const amounts = amountMatches
    .map((match) => toNumber(match[1]))
    .filter((value): value is number => value !== null);

  if (amounts.length === 0) {
    return null;
  }

  const quantityMatch = line.match(/\b(\d+)\s*[x×]\s*/i);
  const quantity = quantityMatch ? Number.parseInt(quantityMatch[1], 10) : 1;
  const nameBeforeAmounts = normalizeLine(line.split(amountMatches[0][0])[0]);
  const cleanedName = nameBeforeAmounts
    .replace(/\b\d+\s*[x×]\s*/i, "")
    .replace(/[\-:,]+$/g, "")
    .trim();

  if (!cleanedName || cleanedName.length < 2) {
    return null;
  }

  let unitPrice = amounts[0];
  let totalPrice = amounts[amounts.length - 1];

  if (quantity > 1 && amounts.length >= 2) {
    unitPrice = amounts[0];
    totalPrice = amounts[amounts.length - 1];
  }

  if (amounts.length === 1) {
    unitPrice = amounts[0];
    totalPrice = amounts[0];
  }

  const confidence = quantityMatch ? 0.88 : amounts.length > 1 ? 0.8 : 0.7;

  return {
    product_name: cleanedName,
    quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    confidence,
  } satisfies ReceiptLineItem;
}

function parseItems(lines: string[]) {
  return lines
    .map((line) => normalizeLine(line))
    .filter((line) => isLikelyItemLine(line))
    .filter(
      (line) => !/\b(?:subtotal|total|tax|change|cash|balance)\b/i.test(line),
    )
    .map((line) => parseQuantityAndPrices(line))
    .filter((item): item is ReceiptLineItem => item !== null);
}

function buildNotes(lines: string[], items: ReceiptLineItem[]) {
  const notes: string[] = [];

  if (lines.length === 0) {
    notes.push("No readable text was returned by the local OCR engine.");
  }

  if (items.length === 0) {
    notes.push(
      "No line items could be confidently parsed. Please review manually.",
    );
  }

  return notes;
}

export async function extractReceiptData(
  imagePath: string,
): Promise<ReceiptDraft> {
  const result = await TextRecognition.recognize(imagePath);

  const lines =
    result.blocks?.flatMap((block) =>
      block.lines.map((line) => normalizeLine(line.text)),
    ).filter(Boolean) ??
    result.text
      .split(/\r?\n/)
      .map((line) => normalizeLine(line))
      .filter(Boolean);

  const rawText = lines.join("\n");
  const merchantName = findMerchant(lines);
  const receiptDate = findDate(lines);
  const currency = findCurrency(lines);
  const totals = findTotals(lines);
  const items = parseItems(lines);
  const computedTotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const confidenceScores = [
    merchantName ? 0.75 : 0.45,
    receiptDate ? 0.7 : 0.4,
    items.length > 0 ? 0.85 : 0.45,
    totals.total !== null ? 0.8 : items.length > 0 ? 0.7 : 0.4,
  ];
  const confidence =
    confidenceScores.reduce((sum, value) => sum + value, 0) /
    confidenceScores.length;

  return {
    merchant_name: merchantName,
    receipt_date: receiptDate,
    currency,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total ?? (computedTotal > 0 ? computedTotal : null),
    confidence,
    raw_text: rawText,
    notes: buildNotes(lines, items),
    items,
  };
}

