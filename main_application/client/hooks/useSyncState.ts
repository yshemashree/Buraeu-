import { useEffect, useRef } from "react";

export function useSyncState(state: any) {
  const lastSentRef = useRef<string>("");

  useEffect(() => {
    // Stringify to compare deeply enough for our simple states
    const stateStr = JSON.stringify(state);
    if (stateStr === lastSentRef.current) return;
    
    lastSentRef.current = stateStr;

    fetch("/api/sync/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: stateStr,
    }).catch((err) => {
      console.warn("Failed to sync state to spectator:", err);
    });
  }, [state]);

  // Only send idle when the component actually unmounts
  useEffect(() => {
    return () => {
      fetch("/api/sync/state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "idle" }),
        keepalive: true
      }).catch(() => {});
    };
  }, []);
}

