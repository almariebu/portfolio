"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Tiny persisted store for the demos. localStorage can be missing or throw
 * (private windows, blocked storage), so every access is wrapped and an
 * in-memory copy keeps the demo working for the session.
 */
const listeners = new Set<() => void>();
const memory = new Map<string, string>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read(key: string): string | null {
  try {
    const value = window.localStorage.getItem(key);
    if (value !== null) return value;
  } catch {
    // fall through to memory
  }
  return memory.get(key) ?? null;
}

function write(key: string, value: string) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // memory copy is enough
  }
  notify();
}

function clear(key: string) {
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // nothing to do
  }
  notify();
}

export function useDemoStore<T>(key: string, seed: () => T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const state = useMemo<T>(() => {
    if (raw) {
      try {
        return JSON.parse(raw) as T;
      } catch {
        // corrupt data: fall back to the seed
      }
    }
    return seed();
  }, [raw, seed]);

  const save = useCallback(
    (next: T) => write(key, JSON.stringify(next)),
    [key],
  );
  const reset = useCallback(() => clear(key), [key]);
  return { state, save, reset };
}
