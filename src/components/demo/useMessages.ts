"use client";

import { useState } from "react";
import { LogicError } from "@/lib/demo/logic.ts";

/** Runs an action; a LogicError becomes the on-screen error, a string result the notice. */
export function useMessages() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const run = (fn: () => string) => {
    try {
      setNotice(fn());
      setError(null);
    } catch (e) {
      if (e instanceof LogicError) {
        setError(e.message);
        setNotice(null);
      } else throw e;
    }
  };
  const clear = () => {
    setError(null);
    setNotice(null);
  };
  return { error, notice, run, clear };
}
