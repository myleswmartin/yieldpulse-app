export type PendingAnalysisEntry = {
  inputs: any;
  results: any;
  timestamp?: number;
  signature?: string;
};

const STORAGE_KEY = "yieldpulse-pending-analyses";
const SYNCED_KEY = "yieldpulse-synced-analyses";

type SyncedEntry = {
  signature: string;
  analysisId: string;
  timestamp?: number;
};

const hashString = (value: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
};

const stableStringify = (value: any): string => {
  const seen = new WeakSet();

  const normalize = (input: any): any => {
    if (input === null || input === undefined) return input;
    if (typeof input !== "object") return input;
    if (seen.has(input)) return undefined;
    seen.add(input);

    if (Array.isArray(input)) {
      return input.map((item) => normalize(item));
    }

    const output: Record<string, any> = {};
    const keys = Object.keys(input).sort();
    for (const key of keys) {
      if (key === "timestamp" || key === "signature") continue;
      const normalizedValue = normalize(input[key]);
      if (normalizedValue !== undefined) {
        output[key] = normalizedValue;
      }
    }
    return output;
  };

  return JSON.stringify(normalize(value));
};

export const buildPendingSignature = (inputs: any, results: any): string | null => {
  try {
    const raw = stableStringify({ inputs, results });
    return hashString(raw);
  } catch (err) {
    console.warn("Failed to build pending analysis signature:", err);
    return null;
  }
};

export const loadPendingAnalyses = (): PendingAnalysisEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    const deduped: PendingAnalysisEntry[] = [];
    const seen = new Set<string>();

    for (const entry of list) {
      if (!entry?.inputs || !entry?.results) continue;
      const signature =
        entry.signature || buildPendingSignature(entry.inputs, entry.results);
      if (!signature || seen.has(signature)) continue;

      seen.add(signature);
      deduped.push({
        ...entry,
        signature,
      });
    }

    deduped.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return deduped;
  } catch (err) {
    console.warn("Failed to load pending analyses:", err);
    return [];
  }
};

export const savePendingAnalyses = (list: PendingAnalysisEntry[]) => {
  try {
    if (!list.length) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("Failed to save pending analyses:", err);
  }
};

export const addPendingAnalysis = (inputs: any, results: any) => {
  if (!inputs || !results) return;

  const signature = buildPendingSignature(inputs, results);
  if (!signature) return;

  const list = loadPendingAnalyses();
  if (list.some((entry) => entry.signature === signature)) {
    return;
  }

    list.push({
      inputs,
      results,
      timestamp: Date.now(),
      signature,
    });

  savePendingAnalyses(list);
};

export const loadSyncedAnalyses = (): SyncedEntry[] => {
  try {
    const raw = localStorage.getItem(SYNCED_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    const deduped: SyncedEntry[] = [];
    const seen = new Set<string>();

    for (const entry of list) {
      if (!entry?.signature || !entry?.analysisId) continue;
      if (seen.has(entry.signature)) continue;
      seen.add(entry.signature);
      deduped.push(entry);
    }

    return deduped;
  } catch (err) {
    console.warn("Failed to load synced analyses:", err);
    return [];
  }
};

export const saveSyncedAnalyses = (list: SyncedEntry[]) => {
  try {
    if (!list.length) {
      localStorage.removeItem(SYNCED_KEY);
      return;
    }

    const trimmed = list.slice(-50);
    localStorage.setItem(SYNCED_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn("Failed to save synced analyses:", err);
  }
};

export const getSyncedAnalysisId = (signature: string): string | null => {
  if (!signature) return null;
  const list = loadSyncedAnalyses();
  const match = list.find((entry) => entry.signature === signature);
  return match?.analysisId || null;
};

export const upsertSyncedAnalysis = (signature: string, analysisId: string) => {
  if (!signature || !analysisId) return;
  const list = loadSyncedAnalyses();
  const existing = list.find((entry) => entry.signature === signature);
  if (existing) {
    existing.analysisId = analysisId;
    existing.timestamp = Date.now();
  } else {
    list.push({ signature, analysisId, timestamp: Date.now() });
  }
  saveSyncedAnalyses(list);
};

export const removePendingAnalysis = (signature: string) => {
  if (!signature) return;
  try {
    const current = loadPendingAnalyses();
    const filtered = current.filter((entry) => entry.signature !== signature);
    if (filtered.length === current.length) return;
    savePendingAnalyses(filtered);
  } catch (err) {
    console.warn("Failed to remove pending analysis:", err);
  }
};
