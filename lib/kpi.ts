// lib/kpi.ts
/**
 * KPI calculation utilities.
 * All functions accept raw activity records and return deterministic numbers.
 * Zero‑denominator cases return `null` which the UI will render as "—".
 */
export interface Activity {
  id: string;
  area: string;
  timeSlot: string; // e.g. "08:00-09:00"
  successfulOpenings: number;
  totalHours: number; // field + travel
  fieldHours: number;
  approachCount: number;
  conversationCount: number;
  registrationStartCount: number;
  registrationSuccessCount: number;
}

function sum<T>(items: T[], selector: (item: T) => number): number {
  return items.reduce((acc, cur) => acc + selector(cur), 0);
}

export function openingsPerHour(acts: Activity[]): number | null {
  const total = sum(acts, (a) => a.successfulOpenings);
  const hours = sum(acts, (a) => a.totalHours);
  return hours ? total / hours : null;
}

export function openingsPerFieldHour(acts: Activity[]): number | null {
  const total = sum(acts, (a) => a.successfulOpenings);
  const fieldHours = sum(acts, (a) => a.fieldHours);
  return fieldHours ? total / fieldHours : null;
}

export function approachToConversation(acts: Activity[]): number | null {
  const approaches = sum(acts, (a) => a.approachCount);
  const conversations = sum(acts, (a) => a.conversationCount);
  return approaches ? conversations / approaches : null;
}

export function registrationStartToSuccess(acts: Activity[]): number | null {
  const starts = sum(acts, (a) => a.registrationStartCount);
  const successes = sum(acts, (a) => a.registrationSuccessCount);
  return starts ? successes / starts : null;
}

export function approachToSuccess(acts: Activity[]): number | null {
  const approaches = sum(acts, (a) => a.approachCount);
  const successes = sum(acts, (a) => a.registrationSuccessCount);
  return approaches ? successes / approaches : null;
}

export function timePerSuccessfulOpening(acts: Activity[]): number | null {
  const totalHours = sum(acts, (a) => a.totalHours);
  const totalOpenings = sum(acts, (a) => a.successfulOpenings);
  return totalOpenings ? totalHours / totalOpenings : null;
}
